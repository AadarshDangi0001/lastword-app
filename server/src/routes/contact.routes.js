import { Router } from 'express';
import {
  createContact,
  deleteContact,
  getContacts,
  sendAllMessages,
} from '../controllers/contact.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  validateContactCreate,
  validateContactIdParam,
} from '../middlewares/validator.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getContacts);
router.post('/', validateContactCreate, createContact);
router.post('/send-all', sendAllMessages);
router.delete('/:contactId', validateContactIdParam, deleteContact);

export default router;
