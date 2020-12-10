const { Schema, model } = require('mongoose'); 

const challengeSchema = new Schema({
  completedDays: [Number],
  currentDay: Number,
  shortId: String,
  isPrivate: {
    type: Boolean,
    default: true
  }, 
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }, 
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Challenge = model('Challenge', challengeSchema);
module.exports = Challenge; 