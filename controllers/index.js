const router = require('express').Router();
const express = require('express');
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const profileRoutes = require('./profileRoutes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/profile', profileRoutes )

const app = express();
app.use(express.static('/public/images')); 

module.exports = router;
