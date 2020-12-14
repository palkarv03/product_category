const joi = require('@hapi/joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	product_id: { type: Number, required: true },
	product_name: { type: String, required: true, minlength: 3, maxlength: 15 },
	category_id: { type: Number, required: true },
	category_name: { type: String, required: true },
	product_price: { type: Number, required: true },
	product_description: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
let product = mongoose.model('Product', productSchema);

function ValidationError(message) {
	let Schema = joi.object().keys({
		product_id: joi.number().required(),
		product_name: joi.string().required(),
		category_id: joi.number().required(),
		category_name: joi.string().required(),
		product_price: joi.number().required(),
		product_description: joi.string().required(),
		createdAt: joi.date().default(Date.now()),
	});
	return Schema.validate(message);
}

module.exports = { product, ValidationError };
