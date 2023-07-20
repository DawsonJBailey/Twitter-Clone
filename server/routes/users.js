import express from 'express';
import {getUser, update, deleteUser, follow, unFollow} from '../controllers/user.js'
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

// With multiple functions, the next() causes it to move to the next one
// So this function is updating a profile. It verifies the token before updating
router.put('/:id', verifyToken, update)

// Get user
router.get('/find/:id', getUser);

// Delete user
router.delete('/:id', verifyToken, deleteUser);

// Follow user
router.put('/follow/:id', verifyToken, follow);

// Unfollow user
router.put('/unfollow/:id', verifyToken, unFollow)

export default router;