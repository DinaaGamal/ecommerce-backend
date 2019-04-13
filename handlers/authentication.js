const {User,Product} = require("../models/db");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/keys");
const {generateToken} = require("../models/user");
const createError = require('http-errors')
//signup
//registeration
exports.signup = async (req, res, next)=>{
  try{
    const user = await User.create(req.body);
    if(!user) return next(createError(404));
    res.send(user);

  }catch(error){
   return next(createError(error));
  }
	
	// try {
  //   let user = await User.create({
  //     username: req.body.username,
  //     password:req.body.password,
  //     email:req.body.email
  //   });
  //   let {username,email,password} = user;
  //   let token = jwt.sign({ email, username, password }, secretKey);
	// 	// return res.send(id, username); 
	// 	return res.status(200).json({username,password,email,token})
  // } catch (err) {
  //   //validation fails
  //   if (err.code === 11000) {
  //     err.message = "Sorry , that Username and/or Email is already taken";
  //   }
  //   console.log(err); 
    
  //   return next({
  //     status: 400,
  //     message: err.errmsg 
  //   });
  // }

};

exports.signin = async function(req, res, next) {

  try {
    const {email,password} = req.body;
    if(!password || !email)throw new Error ('missing params');
    const user = await User.findOne({ email });
    if(!email)throw new Error('authentication faild');
    let isMatch = await user.verifyPassword(req.body.password);
    if (isMatch) {
      await user.generateToken()
      // let token = jwt.sign(
      //   {
      //     id,
      //     username
      //   },
      //   secretKey
      // );
      return res.status(200).json({id,username,token})
    } else {
      return next({
        status: 400,
        message: "Invalid Email/password"
      });
    }
    // if (!user) throw new Error('authentication failed');
    // const isMatch = await user.verifyPassword(password);
    // if (!isMatch) {
    // 	throw new Error('authentication failed');
    // }
    // const token = await user.generateToken();
    // res.send({
    // 	token,
    // 	user
    // });
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid Email/password"
    });
  }
};
