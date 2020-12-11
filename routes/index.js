const router = require("express").Router();
const authRoutes = require("./auth");
const coursesRoutes = require('./courses');
const challengesRoutes = require('./challenges');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/courses", coursesRoutes);
router.use("/challenges", challengesRoutes);

module.exports = router;
