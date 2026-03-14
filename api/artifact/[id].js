import { deleteArtifact } from '../../backend/linkedinService.js';
import { allowMethods, sendServiceError } from '../_utils.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['DELETE'])) {
    return;
  }

  try {
    const ritualId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    res.status(200).json(await deleteArtifact({ ritualId }));
  } catch (error) {
    sendServiceError(res, error);
  }
}
