const mongoose = require('mongoose');

const weeklistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  tasks: [
    {
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date, default: null },
    },
  ],
});

const Weeklist = mongoose.model('Weeklist', weeklistSchema);

module.exports = Weeklist;
