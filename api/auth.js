import { authUser } from '../backend/linkedinService.js';
import { allowMethods, readJsonBody, sendServiceError } from './_utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    res.status(200).json(await authUser(body));
  } catch (error) {
    sendServiceError(res, error);
  }
}
