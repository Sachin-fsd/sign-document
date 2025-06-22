import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js'
import fileRoutes from './file.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('/users', userRoutes)
export default router;
