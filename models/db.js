const mongoose = require('mongoose');
mongoose.Promise= Promise; //make sure we use promises in case forget =>
const { mongoURL } = require('../config/keys');
const User = require("./user")
const Product = require("./product")

mongoose.connect(
	mongoURL,
	{
		useCreateIndex: true,
		useNewUrlParser: true
	}
);
module.exports = {User, Product}; 
