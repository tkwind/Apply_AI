import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createNewApplication,
  editApplication,
  getApplications,
  parseDescription,
  removeApplication,
} from '../controllers/applicationController';

const router = Router();

router.post('/parse', authenticate, parseDescription);
router.get('/', authenticate, getApplications);
router.post('/', authenticate, createNewApplication);
router.put('/:id', authenticate, editApplication);
router.delete('/:id', authenticate, removeApplication);

export default router;
