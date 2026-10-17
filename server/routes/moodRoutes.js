import express from 'express';
import {
  createMoodEntry,
  getMoodEntries,
  getMoodAnalytics
} from '../controllers/moodController.js';

const router = express.Router();

router.post('/', createMoodEntry);
router.get('/user/:anonymousId', getMoodEntries);
router.get('/analytics/:anonymousId', getMoodAnalytics);

export default router;
