import { createClient } from "@libsql/client/web";

const url = import.meta.env.VITE_TURSO_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.warn("Turso URL or Auth Token is missing. Database features will not work.");
}

export const turso = createClient({
  url: url || "",
  authToken: authToken || "",
});

/**
 * Utility to initialize the schema if it doesn't exist.
 * Note: In a production app, you'd usually do this via migrations.
 */
export const initSchema = async () => {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS km_linkedin_alpha (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        voice_dna TEXT,
        anti_words TEXT,
        usage_count INTEGER DEFAULT 0,
        history TEXT
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
    console.log("Turso schema verified.");
  } catch (error) {
    console.error("Failed to initialize Turso schema:", error);
  }
};

/**
 * Utility to log events to the database.
 */
export const logSystemEvent = async (
  level: 'INFO' | 'WARN' | 'ERROR',
  action: string,
  message: string,
  userEmail?: string,
  error?: any
) => {
  try {
    await turso.execute({
      sql: `INSERT INTO km_system_logs (timestamp, level, user_email, action, message, error_details) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        Date.now(),
        level,
        userEmail || null,
        action,
        message,
        error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : null
      ]
    });
  } catch (e) {
    console.error("CRITICAL: Failed to write to logging table", e);
  }
};

