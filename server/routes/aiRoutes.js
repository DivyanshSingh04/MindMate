import express from 'express';
import { analyzeJournalEntry } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', analyzeJournalEntry);

export default router;
