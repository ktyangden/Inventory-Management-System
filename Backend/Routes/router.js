const express = require('express');
const router = express.Router();
const products = require('../models/Products');
const categories = require('../models/Categories');
const suppliers = require('../models/Suppliers');

// Category Routes
router.post("/categories", async (req, res) => {
    const { name, description } = req.body;

    try {
        const pre = await categories.findOne({ name: name });
        if (pre) {
            res.status(422).json("Category already exists.");
        } else {
            const addCategory = new categories({ name, description });
            await addCategory.save();
            res.status(201).json(addCategory);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.get('/categories', async (req, res) => {
    try {
        const getCategories = await categories.find({});
        res.status(200).json(getCategories);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

// Supplier Routes
router.post("/suppliers", async (req, res) => {
    const { name, contact, email, products: productIds } = req.body;

    try {
        const pre = await suppliers.findOne({ email: email });
        if (pre) {
            res.status(422).json("Supplier already exists.");
        } else {
            const addSupplier = new suppliers({ name, contact, email, products: productIds });
            await addSupplier.save();

            // Update products with the new supplier
            if (productIds && productIds.length > 0) {
                await products.updateMany(
                    { _id: { $in: productIds } },
                    { $push: { suppliers: addSupplier._id } }
                );
            }

            res.status(201).json(addSupplier);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.get('/suppliers', async (req, res) => {
    try {
        const getSuppliers = await suppliers.find({}).populate('products');
        res.status(200).json(getSuppliers);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

// Product Routes
router.post("/insertproduct", async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, category } = req.body;

    try {
        const pre = await products.findOne({ ProductBarcode: ProductBarcode });
        if (pre) {
            res.status(422).json("Product is already added.");
        } else {
            const addProduct = new products({ 
                ProductName, 
                ProductPrice, 
                ProductBarcode,
                category: category || undefined
            });

            await addProduct.save();
            res.status(201).json(addProduct);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.get('/products', async (req, res) => {
    try {
        const getProducts = await products.find({}).populate('category').populate('suppliers');
        res.status(200).json(getProducts);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const getProduct = await products.findById(req.params.id).populate('category').populate('suppliers');
        res.status(200).json(getProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.put('/updateproduct/:id', async (req, res) => {
    const { ProductName, ProductPrice, ProductBarcode, category } = req.body;

    try {
        const updateProducts = await products.findByIdAndUpdate(
            req.params.id, 
            { ProductName, ProductPrice, ProductBarcode, category: category || undefined }, 
            { new: true }
        );
        res.status(200).json(updateProducts);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

router.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const deleteProduct = await products.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

module.exports = router;