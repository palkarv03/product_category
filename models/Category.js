const joi = require('@hapi/joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	category_id: { type: Number, required: true },
	category_name: { type: String, required: true, minlength: 3, maxlength: 15 },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
let category = mongoose.model('Category', categorySchema);

function ValidationError(message) {
	let Schema = joi.object().keys({
		category_id: joi.number().required(),
		category_name: joi.string().required(),
		createdAt: joi.date().default(Date.now()),
	});
	return Schema.validate(message);
}

module.exports = { category, ValidationError };
