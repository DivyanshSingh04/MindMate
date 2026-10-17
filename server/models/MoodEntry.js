import mongoose from 'mongoose';

const CopingActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['breathing', 'walk', 'music', 'study-break', 'grounding', 'reflection'],
    default: 'breathing'
  },
  title: { type: String, required: true },
  duration: { type: String, default: '5 mins' },
  instruction: { type: String, required: true }
}, { _id: false });

const MoodEntrySchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['awful', 'bad', 'meh', 'good', 'rad'],
    required: true
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  journalText: {
    type: String,
    trim: true,
    default: ''
  },
  aiAnalysis: {
    burnoutScore: { type: Number, default: 0 },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Severe', 'Neutral'],
      default: 'Low'
    },
    sentiment: { type: String, default: 'Neutral' },
    primaryTriggers: [{ type: String }],
    summary: { type: String, default: '' },
    copingRecommendations: [CopingActivitySchema]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);
export default MoodEntry;
