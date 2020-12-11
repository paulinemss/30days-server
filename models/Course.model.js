const { Schema, model } = require('mongoose'); 

const courseSchema = new Schema({
  title: String,
  shortId: String,
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dffhi2onp/image/upload/v1607514271/growth-2_nob6is.png'
  },
  isOnline: {
    type: Boolean,
    default: true
  }, 
  smallDescription: String,
  longDescription: String,
  category: String,
  likes: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, 
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