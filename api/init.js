import { initApp } from '../backend/linkedinService.js';
import { allowMethods, sendServiceError } from './_utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    res.status(200).json(await initApp());
  } catch (error) {
    sendServiceError(res, error);
  }
}
