import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:3001/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error(err);
        }
    };

    const addCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCategory)
            });

            if (res.status === 201) {
                setNewCategory({ name: '', description: '' });
                fetchCategories();
            } else {
                setError('Failed to add category');
            }
        } catch (err) {
            setError('An error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container-fluid p-5'>
            <h1>Manage Categories</h1>
            
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <form onSubmit={addCategory}>
                    <div className="mb-3">
                        <label htmlFor="category_name" className="form-label fw-bold">Category Name</label>
                        <input
                            type="text"
                            className="form-control fs-5"
                            id="category_name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category_description" className="form-label fw-bold">Description</label>
                        <textarea
                            className="form-control fs-5"
                            id="category_description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary fs-4" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            </div>

            <div className="mt-5">
                <h2>Existing Categories</h2>
                <div className="row">
                    {categories.map((category) => (
                        <div key={category._id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{category.name}</h5>
                                    <p className="card-text">{category.description}</p>
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