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
      .populate('user')

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
  let image; 
  const shortId = nanoid(10);

  if (req.file) {
    image = req.file.path; 
  }

  try {

    console.log('req body', req.body);
    console.log('req file', req.file);

    if (!title || !smallDescription || !longDescription || !author || !image || !category) {
      res.status(400);
      res.json({ err: 'Oops! Something went wrong' });
      return;
    }

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

router.put('/courses/edit/:id', upload.single('image'), async (req, res) => {
  const { 
    title, 
    smallDescription, 
    longDescription, 
    author, 
    category
  } = req.body;
  const days = JSON.parse(req.body.days);
  let image; 
  const shortId = nanoid(10);

  if (req.file) {
    image = req.file.path; 
  }

  try {

    console.log('req body', req.body);
    console.log('req file', req.file);

    if (!title || !smallDescription || !longDescription || !author || !category) {
      res.status(400);
      res.json({ err: 'Oops! Something went wrong' });
      return;
    }

    let updatedCourse; 

    if (!req.file) {
      updatedCourse = await Course.findOneAndUpdate(
        {
          shortId: req.params.id
        }, 
        {
          title,
          smallDescription,
          longDescription,
          category,
          author,
          days
        }, 
        { 
          new: true
        }
      )
    } else {
      updatedCourse = await Course.findOneAndUpdate(
        {
          shortId: req.params.id
        }, 
        {
          title,
          image,
          smallDescription,
          longDescription,
          category,
          author,
          days
        }, 
        { 
          new: true
        }
      )
    }

    res.status(200);
    res.json(updatedCourse);
    
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
