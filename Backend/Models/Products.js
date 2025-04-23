const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductPrice: {
        type: Number,
        required: true,
    },
    ProductBarcode: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: false
    },
    suppliers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers'
    }]
}, { timestamps: true });

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
