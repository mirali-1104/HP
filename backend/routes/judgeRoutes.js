// routes/judgeRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); 


router.get('/groups', async (req, res) => {
  try {

    const groups = await Group.find({ isLoggedIn: true });
    console.log("Fetched groups:", groups); 
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
});

module.exports = router;
