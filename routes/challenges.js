/* MAIN IMPORTS */ 

const router = require("express").Router();
const Challenge = require('../models/Challenge.model');
const Session = require('../models/Session.model');
const { nanoid } = require('nanoid');

/* STARTING A CHALLENGE */ 

router.post('/start/:id', async (req, res) => {
  try {

    const { id } = req.params; 
    const courseId = req.body._id
    const shortId = nanoid(10);

    const userChallenges = await Challenge
      .find({ owner: id })
      .populate('course')
      .populate('owner')

    const existingChallenge = userChallenges.find(challenge => {
      return challenge.course._id.equals(courseId);
    })

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

    console.log('error starting a challenge', error);
    res.sendStatus(400);

  }
})

/* FINDING ONE SINGLE CHALLENGE */ 

router.get('/page/:id', async (req, res) => {
  try {

    const { id } = req.params;  

    const foundChallenge = await Challenge
      .findOne({ shortId: id })
      .populate('course')
      .populate('owner')

    if (foundChallenge && !foundChallenge.isPrivate) {

      res.status(200);
      res.json(foundChallenge);

    } else if (foundChallenge) {
      
      const foundSession = await Session
        .findOne({ _id: req.headers.authorization })
        .populate('user')

      if (
        foundSession && 
        foundSession.user._id.equals(foundChallenge.owner._id)
      ) {
        res.status(200);
        res.json(foundChallenge);
      } else {
        res.sendStatus(404);
      }

    } else {
      res.sendStatus(404);
    }

  } catch (error) {

    console.log('error finding one single challenge', error);
    res.sendStatus(400);

  }
})

/* UPDATING A CHALLENGE */ 

router.put('/update/:challengeID', async (req, res) => {
  try {

    const { challengeID } = req.params; 
    const { completedDays, currentDay, isPrivate } = req.body;

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

    console.log('error updating a challenge', error);
    res.sendStatus(400);

  }
})

/* RESTARTING A CHALLENGE */

router.put('/restart/:challengeID', async (req, res) => {
  try {

    const { challengeID } = req.params; 

    const updatedChallenge = await Challenge
      .findByIdAndUpdate(
        challengeID,
        {
          completedDays: [],
          currentDay: 1,
          startDate: new Date()
        },
        { new: true }
      )
      .populate('course')
      .populate('owner')

    res.status(200);
    res.json(updatedChallenge);

  } catch (error) {

    console.log('error updating a challenge', error);
    res.sendStatus(400);

  }
})

/* DELETING A CHALLENGE */

router.delete('/delete/:challengeID', async (req, res) => {
  try {

    const { challengeID } = req.params; 

    const deletedChallenge = await Challenge
      .findOneAndDelete({ shortId: challengeID })

    res.status(200);
    res.json(deletedChallenge);

  } catch (error) {

    console.log('error deleting a challenge', error);
    res.sendStatus(400);

  }
})

/* FINDING ALL USER CHALLENGES */ 

router.get('/:id', async (req, res) => {
  try {

    const { id } = req.params; 
    
    const userChallenges = await Challenge
      .find({ owner: id })
      .populate('course')
      .populate('owner')

    res.status(200);
    res.json(userChallenges);

  } catch (error) {

    console.log('error finding all user challenges', error);
    res.sendStatus(400);

  }
})

module.exports = router;