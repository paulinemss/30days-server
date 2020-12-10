const router = require("express").Router();
const { nanoid } = require('nanoid');
const authRoutes = require("./auth");
const Course = require('../models/Course.model');
const Challenge = require('../models/Challenge.model');
const Session = require('../models/Session.model');
const User = require('../models/User.model');

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

router.post('/challenges/start/:id', async (req, res) => {
  const { id } = req.params; 
  const courseId = req.body._id
  const shortId = nanoid(10);

  console.log('courseId', courseId);

  try {

    const userChallenges = await Challenge
      .find({ owner: id })
      .populate('course')

    console.log('userChallenges', userChallenges);

    const existingChallenge = userChallenges.find(challenge => {
      console.log('challenge.course._id', challenge.course._id)
      return challenge.course._id.equals(courseId);
    })

    console.log('existingChallenge', existingChallenge);

    if (existingChallenge) {

      res.status(200);
      res.json(existingChallenge);

    } else {

      const newChallenge = await Challenge.create({
        completedDays: [],
        currentDay: 1,
        shortId,
        isPrivate: true,
        course: courseId,
        owner: id
      })

      res.status(200);
      res.json(newChallenge);

    }

  } catch (error) {
    console.log('error', error);
    res.sendStatus(400);
  }
})

router.get('/challenges/page/:id', async (req, res) => {
  const { id } = req.params; 
  console.log('req.headers', req.headers);
  
  try {

    const foundChallenge = await Challenge
      .findOne({ shortId: id })
      .populate('course')
      .populate('owner')

    if (foundChallenge && !foundChallenge.isPrivate) {
      // a challenge was found and it's publicly available
      res.status(200);
      res.json(foundChallenge);

    } else if (foundChallenge) {
      
      const foundSession = await Session
        .findOne({ 
          _id: req.headers.authorization 
        })
        .populate('user')

      console.log('foundSession', foundSession);

      if (foundSession && foundSession.user._id.equals(foundChallenge.owner._id)) {
        res.status(200);
        res.json(foundChallenge);
      } else {
        res.sendStatus(404);
      }

    } else {     
      // no challenge exists
      res.sendStatus(404);
    }

  } catch (error) {
    console.log('error', error);
    res.sendStatus(400);
  }
})

router.put('/challenges/update/:challengeID', async (req, res) => {
  const { challengeID } = req.params; 
  const { completedDays, currentDay, isPrivate } = req.body;
  
  console.log('challengeID', challengeID);
  console.log('req.body challenge to update', req.body); 

  try {
    const updatedChallenge = await Challenge
      .findByIdAndUpdate(
        challengeID,
        {
          completedDays,
          currentDay,
          isPrivate
        },
        { new: true }
      )
      .populate('course')
      .populate('owner')

    res.status(200);
    res.json(updatedChallenge);

  } catch (error) {
    console.log('error', error);
    res.sendStatus(400);
  }
})

router.get('/challenges/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    
    const userChallenges = await Challenge
      .find({ owner: id })
      .populate('course')

    res.status(200);
    res.json(userChallenges);

  } catch (error) {
    console.log('error', error);
    res.sendStatus(400);
  }
})

router.use("/auth", authRoutes);

module.exports = router;
