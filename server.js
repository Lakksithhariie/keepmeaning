import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {
  authUser,
  deleteArtifact,
  extractVoiceDna,
  generateArtifact,
  getErrorMessage,
  getErrorStatus,
  initApp,
} from './backend/linkedinService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sendError = (res, error) => {
  res.status(getErrorStatus(error)).json({ error: getErrorMessage(error) });
};

app.post('/api/init', async (_req, res) => {
  try {
    res.json(await initApp());
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/auth', async (req, res) => {
  try {
    res.json(await authUser(req.body ?? {}));
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/user/voice', async (req, res) => {
  try {
    res.json(await extractVoiceDna(req.body ?? {}));
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    res.json(await generateArtifact(req.body ?? {}));
  } catch (error) {
    sendError(res, error);
  }
});

app.delete('/api/artifact/:id', async (req, res) => {
  try {
    res.json(await deleteArtifact({ ritualId: req.params.id }));
  } catch (error) {
    sendError(res, error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});
