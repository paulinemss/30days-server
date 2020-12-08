const mongoose = require("mongoose");
const courses = require('./courses.json');
const Course = require('../models/Course.model');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/30days";

const shortUrls = [
  'wDoXKrofMI (used)',
  'F5Zyxew0fQ',
  'VxlnJboDTu',
  'QK5p8QJcPm',
  'bFvVImKTm_',
  'u_fjbe_GnX',
  'iszApQfn1g',
  'rC7XVxrgc4',
  'nghL1lwvkA',
  'jqlfiaCdhA'
]

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    return Course.insertMany(courses);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });