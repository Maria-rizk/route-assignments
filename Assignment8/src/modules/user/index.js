import { Router } from 'express';
import { getUser, updateUser, deleteUser } from './user.controller.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getUser);
router.patch('/', updateUser);
router.delete('/', deleteUser);

export default router;
