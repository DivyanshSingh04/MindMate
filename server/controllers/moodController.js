import MoodEntry from '../models/MoodEntry.js';

// In-memory store fallback if MongoDB isn't running locally
const memoryStore = [];

/**
 * Log a new mood check-in with journal & AI insight
 */
export const createMoodEntry = async (req, res) => {
  try {
    const {
      anonymousId,
      mood,
      moodScore,
      tags = [],
      journalText = '',
      aiAnalysis = {}
    } = req.body;

    if (!anonymousId || !mood || !moodScore) {
      return res.status(400).json({
        success: false,
        message: 'anonymousId, mood, and moodScore are required fields.'
      });
    }

    let savedEntry;
    try {
      savedEntry = await MoodEntry.create({
        anonymousId,
        mood,
        moodScore,
        tags,
        journalText,
        aiAnalysis
      });
    } catch (dbErr) {
      // In-memory fallback
      console.warn('DB write failed, using in-memory store:', dbErr.message);
      savedEntry = {
        _id: 'mem_' + Date.now(),
        anonymousId,
        mood,
        moodScore,
        tags,
        journalText,
        aiAnalysis,
        createdAt: new Date()
      };
      memoryStore.push(savedEntry);
    }

    return res.status(201).json({
      success: true,
      message: 'Mood entry recorded anonymously',
      data: savedEntry
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error saving mood entry',
      error: error.message
    });
  }
};

/**
 * Get past entries for an anonymous user ID
 */
export const getMoodEntries = async (req, res) => {
  try {
    const { anonymousId } = req.params;

    if (!anonymousId) {
      return res.status(400).json({ success: false, message: 'anonymousId is required.' });
    }

    let entries = [];
    try {
      entries = await MoodEntry.find({ anonymousId }).sort({ createdAt: -1 }).limit(30);
    } catch (dbErr) {
      entries = memoryStore
        .filter(e => e.anonymousId === anonymousId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving entries',
      error: error.message
    });
  }
};

/**
 * Aggregate weekly & monthly analytics (trends, burnout index, tag frequencies)
 */
export const getMoodAnalytics = async (req, res) => {
  try {
    const { anonymousId } = req.params;

    let entries = [];
    try {
      entries = await MoodEntry.find({ anonymousId }).sort({ createdAt: 1 });
    } catch (dbErr) {
      entries = memoryStore
        .filter(e => e.anonymousId === anonymousId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (entries.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalEntries: 0,
          averageMood: 0,
          averageBurnout: 0,
          timeline: [],
          distribution: { rad: 0, good: 0, meh: 0, bad: 0, awful: 0 },
          commonTags: []
        }
      });
    }

    const distribution = { rad: 0, good: 0, meh: 0, bad: 0, awful: 0 };
    const tagCount = {};
    let totalScore = 0;
    let totalBurnout = 0;
    let burnoutEntryCount = 0;

    const timeline = entries.map(entry => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
      totalScore += entry.moodScore;

      if (entry.aiAnalysis?.burnoutScore) {
        totalBurnout += entry.aiAnalysis.burnoutScore;
        burnoutEntryCount++;
      }

      (entry.tags || []).forEach(t => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });

      const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      return {
        date: dateStr,
        moodScore: entry.moodScore,
        mood: entry.mood,
        burnout: entry.aiAnalysis?.burnoutScore || 0,
        stressLevel: entry.aiAnalysis?.stressLevel || 'Low'
      };
    });

    const commonTags = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        totalEntries: entries.length,
        averageMood: +(totalScore / entries.length).toFixed(1),
        averageBurnout: burnoutEntryCount > 0 ? Math.round(totalBurnout / burnoutEntryCount) : 0,
        timeline,
        distribution,
        commonTags
      }
    });
  } catch (error) {
    console.error('Error computing analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error computing mood analytics',
      error: error.message
    });
  }
};
