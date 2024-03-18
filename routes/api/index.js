const router = require('express').Router();
const ideaRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

router.use('/ideas', ideaRoutes);
router.use('/users', userRoutes);

module.exports = router;
