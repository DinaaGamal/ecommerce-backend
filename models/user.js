const mongoose = require('mongoose'); 
// const validator = require('validator');
const { promisify } = require('util'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {saltRounds,secretKey,tokenExpiry} = require('../config/keys');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);



//create schema
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		email: {
			type: String,
			required: true,
			unique:true,
			index: {
				unique: true
			},
		},
		password: {
			type: String,
			required: true,
			index: {
				unique: true
			} 
		},
		products: [
			{
			  type: mongoose.Schema.Types.ObjectId,

			  //ref l objectId mongoose make it return id as default lma a7b ageeb the rest of data b3ml .populate 
			  ref: "Product"
			}
		  ]
	},
	{
		collection: 'users',
		toJSON: {
			hidden: [ 'password', '__v' ],
			transform: true
		}
	},
);

//hidden feilds
userSchema.options.toJSON.transform = (document, retrn, options) => {
	if (Array.isArray(options.hidden)) {
		options.hidden.forEach((field) => {
			delete retrn[field];
		});
	}
	return retrn;
};

//for istance objects from schema
//verify password
userSchema.method('verifyPassword', async function(confirmPassword ,next) {
	const user = this;
	try{
		
		let isMatch = await  bcrypt.compare(confirmPassword, user.password); //return&bcrypt.compare >>promise
		return isMatch
	}catch(err){
           return next(err)
	}

});
//generate token
userSchema.method('generateToken', function(confirmPassword) {
	
	return sign(
		{
			id,
			username
		},
		secretKey,
		{ expiresIn: tokenExpiry }
	);
});

///decode token
userSchema.static('getUserByToken', async function(token) {
	const decoded = await verify(token, secretKey);
	const user = await User.findById(decoded._id);
	if (!user) throw new Error('user not found ');
	return user;
});

		const hashPassword = (password)=>  bcrypt.hash(password, saltRounds);

//hooks >>> middleware
//hook pre >>CHECk password before save
userSchema.pre('save', async function() {
	const user = this; //user instance
	if (user.isNew || user.modifiedPaths().includes('password')){
	user.password = await hashPassword(user.password);
	}

	// 	const user = this; //user instance
	// 	// if (user.isNew || user.modifiedPaths().includes('password')) {return true};
	// 	if(!this.isModified("password")){
	// 		return next()
	// 	}
	// 	const hashPassword =  await bcrypt.hash(this.password, saltRounds);
	// 	this.password=hashPassword;
	// 	return next();
	// }catch(err){
	// 	return next(err)
	// }
})

module.exports = User =  mongoose.model('User', userSchema);

// module.exports = mongoose.model('User', schema);