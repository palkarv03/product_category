const express = require('express');
const router = express.Router();
const datetime = require('node-datetime');
const { category, ValidationError } = require('../models/Category');

// @desc    Add Category
// @route   POST /category
router.post('/', async (req, res) => {
	try {
		res.render('category');
		let { error } = ValidationError(req.body);
		if (error) return res.status(401).send(error.details[0].message);

		let name = await category.findOne({
			category_name: req.body.category_name,
		});
		if (name) {
			return res.status(401).send({ message: 'Category Already Exists' });
		}

		// Formatting Date
		let dt = datetime.create(Date.now(), 'yy/m/d H:M:S');
		let formatted_Date = dt.format();

		const data = new category({
			category_id: req.body.category_id,
			category_name: req.body.category_name,
			createdAt: formatted_Date,
		});

		let items = await data.save();
		res.send({ message: 'Category Added Successfully', data: items });
	} catch (err) {
		console.error(err);
	}
});

// @desc    Show all categories
// @route   GET /category
router.get('/', async (req, res) => {
	try {
		res.render('category');
		let categoryData = await category.find({});
		if (!categoryData)
			return res.status(404).send({ message: 'No Data Found !' });
		res.send(categoryData);
	} catch (err) {
		console.error(err);
	}
});

// @desc    Show category by id
// @route   GET /category/:category_id
router.get('/:category_id', async (req, res) => {
	try {
		let categoryData = await category.findOne({
			category_id: req.params.category_id,
		});
		if (!categoryData)
			return res.status(402).send({ message: 'Invalid Category ID !' });
		res.send(categoryData);
	} catch (err) {
		console.error(err);
	}
});

// @desc 	Update category by name
// @route	PUT /update/:category_name
router.put('/update/:category_name', async (req, res) => {
	let categoryData = await category.findOne({
		category_name: req.params.category_name,
	});
	if (!categoryData)
		return res.status(401).send({ message: 'Invalid Category Name' });

	(categoryData.category_id = req.body.category_id),
		(categoryData.category_name = req.body.category_name),
		(createdAt = Date.now());

	let items = await categoryData.save();
	res.send({ message: 'Category Updated Sucessfully', data: items });
});

// @desc 	Delete category by name
// @route	DELETE /category/remove/:category_id
router.delete('/remove/:category_name', async (req, res) => {
	try {
		let categoryData = await category.findOne({
			category_name: req.params.category_name,
		});
		if (!categoryData)
			return res.status(404).send({ message: 'Invalid Category Name' });
		let items = await category.findOneAndRemove({
			category_name: req.params.category_name,
		});
		let rdata = await items.save();
		res.json({ message: 'Data Deleted Sucessfully', data: rdata });
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
