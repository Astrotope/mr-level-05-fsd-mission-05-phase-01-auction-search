const express = require('express');
const { searchItems } = require('../controllers/search');

const router = express.Router();

router.get('/search', searchItems);

module.exports = router;