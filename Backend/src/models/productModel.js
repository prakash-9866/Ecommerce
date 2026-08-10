const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please provide product stock'],
        default: 0,
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
