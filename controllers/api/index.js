const router = require('express').Router();
const userRoutes = require('./userRoutes');
const checkoutRoutes = require('./checkoutRoutes');

router.use('/users', userRoutes);
router.use('/checkout', checkoutRoutes);
module.exports = router;
