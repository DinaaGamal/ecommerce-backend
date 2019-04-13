const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const logger = require('morgan');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/products');
const indexRouter = require('./routes');
const { Product } = require('./models/db');
const app = express();
const { loginRequired, ensureCorrectUser } = require('./middelware/auth');
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static(path.join(__dirname, 'public')));

// app.use("/", indexRouter)
app.use('/api/users', usersRouter);
app.use('/api/users/:id/products', loginRequired, ensureCorrectUser, productRouter);

app.get('/products', loginRequired, async (req, res, next) => {
	try {
		let products = await Product.find().sort({ createdAt: 'desc' }).populate('user', {
			username: true,
			email: true
		});
		return res.status(200).json(products);
	} catch (error) {
		return next(error);
	}
});

//error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

module.exports = app;
