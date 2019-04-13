const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user');
const {authenticationMiddleware,loginRequired, ensureCorrectUser} = require('./../middelware/auth');
const {signin ,signup} = require('../handlers/authentication');

 
//get users
//  = /api/
router.get('/', async (req, res, next) => { 

	const users = await User.find().catch(console.error);
	if(!users) return next(createError(404));
	res.send(users);
});

//registeration
// deh = /api/auth/users/signup
router.post('/signup',signup); 

//login
router.post('/signin',signin)
	
router.use(loginRequired,ensureCorrectUser);
router.get('/profile', authenticationMiddleware,loginRequired,ensureCorrectUser, (req, res, next) => {
	res.send(req.user);
});

module.exports = router;
