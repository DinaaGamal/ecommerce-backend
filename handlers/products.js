const {User,Product} = require('../models/db');

exports.createProduct = async function(req, res, next) {
	try {
		// access db and create product
		let product = await Product.create({
			productName : req.body.productName,
			priceAfter:req.body.priceAfter,
			priceBefore:req.body.priceBefore,
			productCategory: req.body.productCategory,
			productDescription:req.body.productDescription,
			
		});
		//1) find attached user
		let foundUser = await User.findById(req.params.id);
		// 2)push product to THAT user
		foundUser.products.push(product.id);
		//3) have to manually save
		await foundUser.save();
		// by now the product has been saved successfully
		//4) populate user
		let foundProduct = await Product.findById(product.id).populate('user', {
			username: true,
			email: true
		}); 
		// 5) send response as json to the client - always send response dont forget
		return res.status(200).json(foundProduct);
		// 6) handle error
	} catch (err) {
		return next(err);
	}
};

exports.getProduct = async function(req, res, next) {
	try {
		let foundProduct = await Product.findById(req.params.product_id);
		return res.status(200).json(foundProduct);
	} catch (error) {
		return next(error);
	}
};

exports.deleteProduct = async function(req, res, next) {
	try {
		let foundProduct = await Product.findById(req.params.product_id);
		await foundProduct.remove();
		return res.status(200).json(foundProduct);
	} catch (err) {
		return next(err);
	}
};
