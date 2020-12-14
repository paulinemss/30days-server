/* MAIN IMPORTS */ 

const router = require("express").Router();
const Course = require('../models/Course.model');
const { nanoid } = require('nanoid');

/* CLOUDINARY CONFIGS */

const multer = require('multer');
const cloudinary = require('cloudinary'); 
const multerStorageCloudinary = require('multer-storage-cloudinary');
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
})
const upload = multer({ storage }); 

/* GETTING ALL COURSES */

router.get('/', async (req, res) => {
  try {

    const courses = await Course
      .find({ isOnline: true }, { days: 0 })
      .sort({ likes: -1 })
      .populate('user')

    res.status(200);
    res.json(courses); 

  } catch (error) {

    console.log('error getting all courses', error);
    res.sendStatus(400);

  }
})

/* CREATING A COURSE */ 

router.post('/create', upload.single('image'), async (req, res) => {
  try {

    const { 
      title, 
      smallDescription, 
      longDescription, 
      author, 
      category
    } = req.body;
    
    const days = JSON.parse(req.body.days);
    const shortId = nanoid(10);

    let image; 
    if (req.file) { image = req.file.path }

    console.log('req body', req.body)
    console.log('days', days);
    console.log('req file', req.file);

    if (
      !title ||
      !smallDescription || 
      !longDescription ||
      !author ||
      !image ||
      !category
    ) {
      console.log('missing user input to create a course');
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

    console.log('error creating a course', error);
    res.sendStatus(400);

  }
})

/* EDITING A COURSE */ 

router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {

    const { 
      title, 
      smallDescription, 
      longDescription, 
      author, 
      category
    } = req.body;
    const days = JSON.parse(req.body.days);
    let image; 
    if (req.file) { image = req.file.path }

    if (
      !title || 
      !smallDescription || 
      !longDescription || 
      !author || 
      !category
    ) {
      console.log('missing user input to edit a course');
      res.status(400);
      res.json({ err: 'Oops! Something went wrong' });
      return;
    }

    let updatedCourse; 

    if (!req.file) {
      updatedCourse = await Course.findOneAndUpdate(
        { shortId: req.params.id }, 
        {
          title,
          smallDescription,
          longDescription,
          category,
          author,
          days
        }, 
        { new: true }
      )
    } else {
      updatedCourse = await Course.findOneAndUpdate(
        { shortId: req.params.id }, 
        {
          title,
          image,
          smallDescription,
          longDescription,
          category,
          author,
          days
        }, 
        { new: true }
      )
    }

    res.status(200);
    res.json(updatedCourse);
    
  } catch (error) {

    console.log('error editing a course', error);
    res.sendStatus(400);

  }
})

/* LIKING A COURSE */ 

router.put('/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { likes } = req.body;
    
    const likedCourse = await Course.findOneAndUpdate(
      { shortId: id },
      { likes },
      { new: true }
    );

    const allCourses = await Course.find({ isOnline: true });

    res.status(200);
    res.json(allCourses);

  } catch (error) {

    console.log('error liking a course', error);
    res.sendStatus(400);

  }
})

/* DELETING A COURSE */

router.put('/delete/:id', async (req, res) => {
  try {

    const { id } = req.params;

    const deletedCourse = await Course.findOneAndUpdate(
      { shortId: id },
      { isOnline: false },
      { new: true }
    );

    const allCourses = await Course.find({ isOnline: true });

    res.status(200);
    res.json(allCourses);
    
  } catch (error) {

    console.log('error deleting a course', error);
    res.sendStatus(400);

  }
})

/* FINDING ONE SINGLE COURSE */ 

router.get('/:id', async (req, res) => {
  try {

    const { id } = req.params; 
    const foundCourse = await Course.findOne({ shortId: id });

    if (foundCourse) {
      res.status(200);
      res.json(foundCourse);
    } else {
      res.sendStatus(404);
    }

  } catch (error) {

    console.log('error finding one single course', error);
    res.sendStatus(400);

  }
})

module.exports = router;