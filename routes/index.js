const router = require("express").Router();
const { nanoid } = require('nanoid');
const authRoutes = require("./auth");
const Course = require('../models/Course.model');

/* Cloudinary config */

const multer = require('multer');
const cloudinary = require('cloudinary'); 
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
})

const upload = multer({ storage }); 

/* Main routes */

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course
      .find({}, {days: 0})
      .sort({ likes: -1 })

    res.status(200);
    res.json(courses); 

  } catch (error) {
    res.sendStatus(400);
  }
})

router.post('/courses/create', upload.single('image'), async (req, res) => {
  const { 
    title, 
    smallDescription, 
    longDescription, 
    author, 
    category
  } = req.body;
  const days = JSON.parse(req.body.days);
  const { image } = req.file.path; 
  const shortId = nanoid(10);

  try {

    console.log('req body', req.body);
    console.log('req file', req.file);

    const newCourse = await Course.create({
      title,
      shortId,
      image,
      smallDescription,
      longDescription,
      category,
      likes: 0,
      author,
      days
    })

    res.status(200);
    res.json(newCourse);

  } catch (error) {

    console.log('error', error);
    res.sendStatus(400);

  }
})

router.get('/courses/:id', async (req, res) => {
  const { id } = req.params; 
  
  try {
    const foundCourse = await Course.findOne({ shortId: id });

    if (foundCourse) {
      // a course was found
      res.status(200);
      res.json(foundCourse);

    } else {
      // no course exists
      res.sendStatus(404);
    }

  } catch (error) {
    console.log('error', error);
    res.sendStatus(400);
  }
})

router.use("/auth", authRoutes);

module.exports = router;
