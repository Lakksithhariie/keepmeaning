import { createClient } from '@libsql/client';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MAX_GENERATIONS = 20;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const AI_SLOP = [
  'delve',
  'tapestry',
  'unlock',
  'unleash',
  'testament',
  'vibrant',
  'nuance',
  'landscape',
  '🚀',
  '🔥',
  '💡',
  'humbled',
  'honored',
  'thrilled',
  'excited to share',
  'dive into',
];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const globalState = globalThis;

if (!globalState.__kmRateLimits) {
  globalState.__kmRateLimits = new Map();
}

const rateLimits = globalState.__kmRateLimits;

const getEnv = (primaryName, fallbackName) =>
  process.env[primaryName] || (fallbackName ? process.env[fallbackName] : '') || '';

const getTursoClient = () => {
  if (!globalState.__kmTursoClient) {
    const url = getEnv('TURSO_URL', 'VITE_TURSO_URL');
    const authToken = getEnv('TURSO_AUTH_TOKEN', 'VITE_TURSO_AUTH_TOKEN');

    if (!url || !authToken) {
      throw new HttpError(500, 'Missing Turso configuration.');
    }

    globalState.__kmTursoClient = createClient({ url, authToken });
  }

  return globalState.__kmTursoClient;
};

const getMistralApiKey = () => {
  const apiKey = getEnv('MISTRAL_API_KEY', 'VITE_MISTRAL_API_KEY');

  if (!apiKey) {
    throw new HttpError(500, 'Missing Mistral API key.');
  }

  return apiKey;
};

const normalizeErrorMessage = (error) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
};

const safeJsonParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const ensureSchema = async () => {
  if (!globalState.__kmSchemaPromise) {
    const turso = getTursoClient();

    globalState.__kmSchemaPromise = (async () => {
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS km_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          voice_dna TEXT,
          anti_words TEXT,
          usage_count INTEGER DEFAULT 0
        );
      `);
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS km_artifacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          ritual_id TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          draft TEXT,
          anchor TEXT,
          lens_id TEXT,
          artifact TEXT,
          meaning_score INTEGER,
          slop_score INTEGER,
          chat_history TEXT,
          purged_items TEXT,
          FOREIGN KEY(user_id) REFERENCES km_users(id)
        );
      `);
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS km_system_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER NOT NULL,
          level TEXT NOT NULL,
          user_email TEXT,
          action TEXT NOT NULL,
          message TEXT NOT NULL,
          error_details TEXT
        );
      `);
    })().catch((error) => {
      globalState.__kmSchemaPromise = null;
      throw error;
    });
  }

  await globalState.__kmSchemaPromise;
};

export const logSystemEvent = async (
  level,
  action,
  message,
  userEmail = null,
  error = null,
) => {
  try {
    await ensureSchema();
    const turso = getTursoClient();

    await turso.execute({
      sql: `
        INSERT INTO km_system_logs (timestamp, level, user_email, action, message, error_details)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        Date.now(),
        level,
        userEmail,
        action,
        message,
        error ? JSON.stringify(error) : null,
      ],
    });
  } catch (loggingError) {
    console.error('Failed to log:', loggingError);
  }
};

export const initApp = async () => {
  await ensureSchema();
  return { success: true };
};

export const authUser = async ({ email }) => {
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, 'Invalid email');
  }

  await ensureSchema();
  const turso = getTursoClient();
  const normalizedEmail = email.trim();

  try {
    let userResult = await turso.execute({
      sql: 'SELECT * FROM km_users WHERE email = ?',
      args: [normalizedEmail],
    });

    if (userResult.rows.length === 0) {
      const insert = await turso.execute({
        sql: 'INSERT INTO km_users (email) VALUES (?)',
        args: [normalizedEmail],
      });

      userResult = await turso.execute({
        sql: 'SELECT * FROM km_users WHERE id = ?',
        args: [insert.lastInsertRowid],
      });
    }

    const user = {
      ...userResult.rows[0],
      voice_dna: safeJsonParse(userResult.rows[0].voice_dna, []),
    };

    const artifactsResult = await turso.execute({
      sql: 'SELECT * FROM km_artifacts WHERE user_id = ? ORDER BY timestamp DESC',
      args: [user.id],
    });

    const artifacts = artifactsResult.rows.map((row) => ({
      ...row,
      chatHistory: safeJsonParse(row.chat_history, []),
      purgedItems: safeJsonParse(row.purged_items, []),
    }));

    return { user, artifacts };
  } catch (error) {
    await logSystemEvent('ERROR', 'AUTH', 'Auth failed', normalizedEmail, normalizeErrorMessage(error));
    throw new HttpError(500, normalizeErrorMessage(error));
  }
};

export const extractVoiceDna = async ({ userId, email, voiceSamples }) => {
  if (!userId || !voiceSamples?.trim()) {
    throw new HttpError(400, 'Missing voice analysis input.');
  }

  await ensureSchema();
  const turso = getTursoClient();
  const mistralApiKey = getMistralApiKey();

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a writing voice analyst.
Analyze the pasted LinkedIn posts and output a structured Voice DNA block.
Format your response as a JSON object with:
IDENTITY (string), AUDIENCE (string), VOICE_RULES (array of strings), OUTPUT_CALIBRATION (string paragraph).`,
      },
      { role: 'user', content: `Analyze these posts:\n\n${voiceSamples}` },
    ];

    const aiRes = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      throw new Error(`Mistral API error: ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const newDna = JSON.parse(data.choices[0].message.content);

    const userRes = await turso.execute({
      sql: 'SELECT voice_dna FROM km_users WHERE id = ?',
      args: [userId],
    });

    const existingHistory =
      userRes.rows.length > 0 ? safeJsonParse(userRes.rows[0].voice_dna, []) : [];
    const dnaHistory = [
      { timestamp: Date.now(), dna: newDna, samples: voiceSamples },
      ...existingHistory,
    ];

    await turso.execute({
      sql: 'UPDATE km_users SET voice_dna = ? WHERE id = ?',
      args: [JSON.stringify(dnaHistory), userId],
    });

    await logSystemEvent('INFO', 'EXTRACT_DNA', 'Successfully extracted Voice DNA', email);

    return { voiceDNA: dnaHistory };
  } catch (error) {
    await logSystemEvent(
      'ERROR',
      'EXTRACT_DNA',
      'Failed to extract Voice DNA',
      email,
      normalizeErrorMessage(error),
    );
    throw new HttpError(500, normalizeErrorMessage(error));
  }
};

export const generateArtifact = async ({
  email,
  userId,
  draft,
  anchor,
  lens,
  voiceDNA,
  isRefining,
  currentHistory,
  refinementInput,
}) => {
  if (!email || !EMAIL_PATTERN.test(email) || !userId || !draft?.trim()) {
    throw new HttpError(400, 'Missing generation input.');
  }

  const usage = rateLimits.get(email) || 0;
  if (usage >= MAX_GENERATIONS) {
    throw new HttpError(429, 'Daily limit reached. Take a breath and try again tomorrow.');
  }

  await ensureSchema();
  const turso = getTursoClient();
  const mistralApiKey = getMistralApiKey();

  try {
    let voiceContext = '';
    if (Array.isArray(voiceDNA) && voiceDNA.length > 0 && voiceDNA[0]?.dna) {
      const latestDna = voiceDNA[0].dna;
      const rules = Array.isArray(latestDna.VOICE_RULES) ? latestDna.VOICE_RULES.join(', ') : '';
      voiceContext = `\n\n# Voice DNA\nIdentity: ${latestDna.IDENTITY}\nAudience: ${latestDna.AUDIENCE}\nRules: ${rules}`;
    }

    const safeHistory = Array.isArray(currentHistory) ? currentHistory : [];
    const draftMessages = [
      {
        role: 'system',
        content: `# Role
You are a world-class LinkedIn ghostwriter. Transform raw material into a highly authentic post.

# Rules
- NO PREAMBLES.
- NO MARKDOWN.
- NO ROBOTIC PUNCTUATION.
- Preserve Meaning: "${anchor || 'Extract core truth'}"
- Current Lens: ${lens?.name} (${lens?.desc})${voiceContext}`,
      },
    ];

    if (isRefining) {
      safeHistory.forEach((message) => draftMessages.push(message));
      draftMessages.push({
        role: 'user',
        content: `REFINE (STAY ON LENS: ${lens?.name}): ${refinementInput}`,
      });
    } else {
      draftMessages.push({ role: 'user', content: `Draft: ${draft}` });
    }

    const draftResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages: draftMessages,
        temperature: 0.8,
      }),
    });

    if (!draftResponse.ok) {
      throw new Error('Drafting failed');
    }

    const draftData = await draftResponse.json();
    const rawOutput = draftData.choices[0].message.content;

    const auditResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages: [
          {
            role: 'system',
            content: `# Role
You are the KeepMeaning Audit Engine. Clean the post.

# Response Format
<CLEANED_POST>
(text)
</CLEANED_POST>
<SCORE>X</SCORE>`,
          },
          { role: 'user', content: `Post to Audit: ${rawOutput}` },
        ],
        temperature: 0.1,
      }),
    });

    if (!auditResponse.ok) {
      throw new Error('Auditing failed');
    }

    const auditData = await auditResponse.json();
    const auditContent = auditData.choices[0].message.content;
    const cleanedPostMatch = auditContent.match(/<CLEANED_POST>([\s\S]*?)<\/CLEANED_POST>/i);
    const cleanedPost = cleanedPostMatch
      ? cleanedPostMatch[1].trim()
      : auditContent.replace(/<SCORE>\d+<\/SCORE>/i, '').trim();
    const scoreMatch = auditContent.match(/<SCORE>(\d+)<\/SCORE>/i);

    const finalClean = cleanedPost
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/—/g, ' ')
      .replace(/:/g, '')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .trim();

    const meaningScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 9;
    const ritualId = `ritual_${Date.now()}`;
    const updatedHistory = [...safeHistory];

    if (!isRefining) {
      updatedHistory.push({ role: 'user', content: `Draft: ${draft}` });
    } else {
      updatedHistory.push({ role: 'user', content: refinementInput });
    }

    updatedHistory.push({ role: 'assistant', content: finalClean });

    const purgedItems = AI_SLOP.filter(
      (word) => draft.toLowerCase().includes(word) && !finalClean.toLowerCase().includes(word),
    );

    await turso.execute({
      sql: `
        INSERT INTO km_artifacts (
          user_id,
          ritual_id,
          timestamp,
          draft,
          anchor,
          lens_id,
          artifact,
          meaning_score,
          slop_score,
          chat_history,
          purged_items
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        userId,
        ritualId,
        Date.now(),
        draft,
        anchor,
        lens?.id || '',
        finalClean,
        meaningScore,
        1,
        JSON.stringify(updatedHistory),
        JSON.stringify(purgedItems),
      ],
    });

    await turso.execute({
      sql: 'UPDATE km_users SET usage_count = usage_count + 1 WHERE id = ?',
      args: [userId],
    });

    rateLimits.set(email, usage + 1);

    return {
      ritualId,
      artifact: finalClean,
      meaningScore,
      chatHistory: updatedHistory,
      purgedItems,
    };
  } catch (error) {
    await logSystemEvent('ERROR', 'GENERATE', 'Failed to generate', email, normalizeErrorMessage(error));
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(500, normalizeErrorMessage(error));
  }
};

export const deleteArtifact = async ({ ritualId }) => {
  if (!ritualId) {
    throw new HttpError(400, 'Missing artifact id.');
  }

  await ensureSchema();
  const turso = getTursoClient();

  try {
    await turso.execute({
      sql: 'DELETE FROM km_artifacts WHERE ritual_id = ?',
      args: [ritualId],
    });

    return { success: true };
  } catch (error) {
    throw new HttpError(500, normalizeErrorMessage(error));
  }
};

export const getErrorStatus = (error) => (error instanceof HttpError ? error.status : 500);
export const getErrorMessage = (error) =>
  error instanceof HttpError ? error.message : normalizeErrorMessage(error);
