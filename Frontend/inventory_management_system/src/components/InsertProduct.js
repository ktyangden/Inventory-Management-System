import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState();
    const [productBarcode, setProductBarcode] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const res = await fetch('http://localhost:3001/categories');
            const data = await res.json();
            console.log('Categories fetched:', data);
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories. Please try again later.');
        }
    };

    const setName = (e) => {
        setProductName(e.target.value);
    }

    const setPrice = (e) => {
        setProductPrice(e.target.value);
    }

    const setBarcode = (e) => {
        const value = e.target.value.slice(0, 12);
        setProductBarcode(value);
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!productName || !productPrice || !productBarcode) {
            setError("*Please fill in all the required fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const productData = {
                ProductName: productName,
                ProductPrice: productPrice,
                ProductBarcode: productBarcode
            };

            if (selectedCategory) {
                productData.category = selectedCategory;
            }

            console.log('Sending product data:', productData);

            const res = await fetch("http://localhost:3001/insertproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            const responseData = await res.json();
            console.log('Server response:', responseData);

            if (res.status === 201) {
                alert("Data Inserted");
                setProductName("");
                setProductPrice(0);
                setProductBarcode(0);
                setSelectedCategory("");
                navigate('/products');
            }
            else if (res.status === 422) {
                alert("Product is already added with that barcode.");
            }
            else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error('Error adding product:', err);
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container-fluid p-5'>
            <h1 className=''>Enter Product Information</h1>
            
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_name" className="form-label fw-bold">Product Name</label>
                <input type="text" onChange={setName} value={productName} className="form-control fs-5" id="product_name" placeholder="Enter Product Name" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_price" className="form-label fw-bold">Product Price</label>
                <input type="number" onChange={setPrice} value={productPrice} className="form-control fs-5" id="product_price" placeholder="Enter Product Price" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode</label>
                <input type="number" onChange={setBarcode} value={productBarcode} maxLength={12} className="form-control fs-5" id="product_barcode" placeholder="Enter Product Barcode" required />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_category" className="form-label fw-bold">Category (Optional)</label>
                <select
                    className="form-control fs-5"
                    id="product_category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No categories available</option>
                    )}
                </select>
                {categories.length === 0 && (
                    <small className="text-muted">Please add categories first from the Categories page</small>
                )}
            </div>
            <div className='d-flex justify-content-center col-lg-6 col-md-6 mt-5'>
                <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                <button type="submit" onClick={addProduct} className="btn btn-primary fs-4" disabled={loading}>{loading ? 'Inserting...' : 'Insert'}</button>
            </div>
            <div className="col text-center col-lg-6">
                {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
            </div>
        </div>
    )
}
