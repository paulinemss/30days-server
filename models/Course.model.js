const { Schema, model } = require('mongoose'); 

const courseSchema = new Schema({
  title: String,
  shortId: String,
  image: String,
  smallDescription: String,
  longDescription: String,
  tags: [String],
  likes: Number,
  author: String, 
  days: [
    {
      dayNumber: Number,
      title: String,
      description: String,
      externalUrl: String
    }
  ]
})

const Course = model('Course', courseSchema);
module.exports = Course; 