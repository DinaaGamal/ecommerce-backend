const createError = require('http-errors');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secretKey = require('./../config/keys').SECRET_KEY;


exports.loginRequired = function(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, secretKey, function(err, decoded) {
			if (decoded) {
				next();
			} else {
				return next({
					status: 401,
					message: 'Please login first'
				});
			}
		});
	} catch (err) {
		return next({
			status: 401,
			message: 'Please login first'
		});
	}
};

exports.ensureCorrectUser = function(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, secretKey, function(err, decoded) {
			if (decoded && decoded.id === req.params.id) {
				return next();
			} else {
				return next({
					status: 401,
					message: 'Unauthorized'
				});
			}
		});
	} catch (err) {
		return next({
			status: 401,
			message: 'Unauthorized'
		});
	}
};



exports.authenticationMiddleware = async (req, res, next) => {
	try {
		const { authorization: token } = req.headers;
		if (!token) throw new Error('token required');
		req.user = await User.getUserByToken(token);
		next();
	} catch (err) {
		next(createError(401, 'not-authenticated'));
	}
};  
