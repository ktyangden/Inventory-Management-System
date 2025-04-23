const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }]
}, { timestamps: true });

const Suppliers = mongoose.model("Suppliers", SupplierSchema);
module.exports = Suppliers; 