const express = require('express');
const router = express.Router();

// import v1 routes
const authRoute = require('./v1/auth.route');
const userRoute = require('./user.route'); // agar use kar rahi ho
const docsRoute = require('./docs.route'); // agar use kar rahi ho

// mount routes
router.use('/v1/auth', authRoute);
router.use('/v1/users', userRoute);
router.use('/v1/docs', docsRoute);

module.exports = router;
