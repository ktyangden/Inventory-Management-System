import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', email: '', products: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('http://localhost:3001/suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            setError('Failed to fetch suppliers');
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3001/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        }
    };

    const addSupplier = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSupplier)
            });

            if (res.status === 201) {
                setNewSupplier({ name: '', contact: '', email: '', products: [] });
                fetchSuppliers();
            } else {
                setError('Failed to add supplier');
            }
        } catch (err) {
            setError('An error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (productId) => {
        setNewSupplier(prev => ({
            ...prev,
            products: prev.products.includes(productId)
                ? prev.products.filter(id => id !== productId)
                : [...prev.products, productId]
        }));
    };

    return (
        <div className='container-fluid p-5'>
            <h1>Manage Suppliers</h1>
            
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <form onSubmit={addSupplier}>
                    <div className="mb-3">
                        <label htmlFor="supplier_name" className="form-label fw-bold">Supplier Name</label>
                        <input
                            type="text"
                            className="form-control fs-5"
                            id="supplier_name"
                            value={newSupplier.name}
                            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="supplier_contact" className="form-label fw-bold">Contact Number</label>
                        <input
                            type="text"
                            className="form-control fs-5"
                            id="supplier_contact"
                            value={newSupplier.contact}
                            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="supplier_email" className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            className="form-control fs-5"
                            id="supplier_email"
                            value={newSupplier.email}
                            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Products Supplied</label>
                        <div className="border p-3 rounded">
                            {products.map(product => (
                                <div key={product._id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`product-${product._id}`}
                                        checked={newSupplier.products.includes(product._id)}
                                        onChange={() => handleProductSelect(product._id)}
                                    />
                                    <label className="form-check-label" htmlFor={`product-${product._id}`}>
                                        {product.ProductName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary fs-4" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Supplier'}
                    </button>
                </form>
            </div>

            <div className="mt-5">
                <h2>Existing Suppliers</h2>
                <div className="row">
                    {suppliers.map((supplier) => (
                        <div key={supplier._id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{supplier.name}</h5>
                                    <p className="card-text">Contact: {supplier.contact}</p>
                                    <p className="card-text">Email: {supplier.email}</p>
                                    <h6>Products Supplied:</h6>
                                    <ul>
                                        {supplier.products.map(product => (
                                            <li key={product._id}>{product.ProductName}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
        </div>
    );
} 