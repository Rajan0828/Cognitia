import express from 'express';
import { uploadDocuments, getDocuments, getDocument, updateDocument, deleteDocument } from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Protected Routes
router.use(protect);

router.post('/upload', upload.single('file'), uploadDocuments);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
