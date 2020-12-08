const router = require("express").Router();
const authRoutes = require("./auth");
const Course = require('../models/Course.model');

/* GET home page */
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
