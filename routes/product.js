const express = require('express');
const router = express.Router();
const datetime = require('node-datetime');
const { product, ValidationError } = require('../models/Product');

// @desc    Add Product
// @route   POST /product
router.post('/', async (req, res) => {
	try {
		let { error } = ValidationError(req.body);
		if (error) return res.status(401).send(error.details[0].message);

		let name = await product.findOne({
			product_name: req.body.product_name,
		});
		if (name) {
			return res.status(401).send({ message: 'Product Already Exist' });
		}

		// Formatting Date
		let dt = datetime.create(Date.now(), 'yy/m/d H:M:S');
		let formatted_Date = dt.format();

		const data = new product({
			product_id: req.body.product_id,
			product_name: req.body.product_name,
			category_id: req.body.category_id,
			category_name: req.body.category_name,
			product_price: req.body.product_price,
			product_description: req.body.product_description,
			createdAt: formatted_Date,
		});

		let items = await data.save();
		res.send({ message: 'Product Added Sucessfully', data: items });
	} catch (err) {
		console.error(err);
	}
});

// @desc    Show all products
// @route   GET /product
router.get('/', async (req, res) => {
	try {
		let productData = await product.find({});
		if (!productData)
			return res.status(404).send({ message: 'No Data Found !' });
		res.send(productData);
	} catch (err) {
		console.error(err);
	}
});

// @desc    Show product by name
// @route   GET /product/:product_name
router.get('/:product_name', async (req, res) => {
	try {
		let productData = await product.findOne({
			product_name: req.params.product_name,
		});
		if (!productData)
			return res.status(402).send({ message: 'Invalid Product Name' });
		res.send(productData);
	} catch (err) {
		console.error(err);
	}
});

// @desc 	Update product by name
// @route	PUT /update/:product_name
router.put('/update/:product_name', async (req, res) => {
	let productData = await product.findOne({
		product_name: req.params.product_name,
	});
	if (!productData)
		return res.status(401).send({ message: 'Invalid Product Name' });

	(productData.product_id = req.body.product_id),
		(productData.product_name = req.body.product_name),
		(productData.category_id = req.body.category_id),
		(productData.category_name = req.body.category_name),
		(productData.product_price = req.body.product_price),
		(productData.product_description = req.body.product_description),
		(createdAt = Date.now());

	let items = await productData.save();
	res.send({ message: 'Product Updated Sucessfully', data: items });
});

// @desc 	Delete product by name
// @route	DELETE /product/remove/:product_name
router.delete('/remove/:product_name', async (req, res) => {
	try {
		let productData = await product.findOne({
			product_name: req.params.product_name,
		});
		if (!productData)
			return res.status(404).send({ message: 'Invalid Product Name' });
		let items = await product.findOneAndRemove({
			product_name: req.params.product_name,
		});
		let rdata = await items.save();
		res.json({ message: 'Data Deleted Sucessfully', data: rdata });
	} catch (err) {
		console.error(err);
	}
});

// @desc    Pagination
// @route   GET /product/pageIndex/:id
router.get('/pageIndex/:id', async (req, res) => {
	try {
		let perPage = 10;
		let page = req.params.id || 1;
		let pageData = await product
			.find({})
			.skip(perPage * page - perPage)
			.limit(perPage);
		let dataCount = await product.find({}).count();
		let pageSize = Math.ceil(dataCount / perPage);
		res.send({
			perPage: perPage,
			currentPage: page,
			dataLimit: pageData,
			dataCount: dataCount,
			pageSize: pageSize,
		});
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
