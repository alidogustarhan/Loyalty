const mongoose = require('mongoose');

const product = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    soldWithPoints: {
        type: Boolean,
        required: true
    },
    pointsEarned: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    actions: {
        type: Array,
        default: []
    },
})

const productSchema = mongoose.model('product', product)

module.exports = { productSchema }