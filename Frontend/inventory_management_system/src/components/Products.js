import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Products() {
    const [productData, setProductData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const res = await fetch("http://localhost:3001/products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            console.log('Products data:', data);

            if (res.status === 200) {
                console.log("Data Retrieved.");
                setProductData(data);
            } else {
                console.log("Something went wrong. Please try again.");
                setError("Failed to fetch products");
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError("An error occurred while fetching products");
        }
    }

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/deleteproduct/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const deletedata = await response.json();
            console.log('Delete response:', deletedata);

            if (response.status === 200) {
                console.log("Product deleted");
                getProducts();
            } else {
                console.log("Error deleting product");
                setError("Failed to delete product");
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            setError("An error occurred while deleting the product");
        }
    }

    return (
        <div className='container-fluid p-5'>
            <h1>Products Inventory</h1>
            <div className='add_button'>
                <NavLink to="/insertproduct" className='btn btn-primary fs-5'> + Add New Product</NavLink>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="overflow-auto mt-3" style={{ maxHeight: "38rem" }}>
                <table className="table table-striped table-hover mt-3 fs-5">
                    <thead>
                        <tr className="tr_color">
                            <th scope="col">#</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Product Price</th>
                            <th scope="col">Product Barcode</th>
                            <th scope="col">Category</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.map((element, id) => (
                            <tr key={element._id}>
                                <th scope="row">{id + 1}</th>
                                <td>{element.ProductName}</td>
                                <td>{element.ProductPrice}</td>
                                <td>{element.ProductBarcode}</td>
                                <td>{element.category ? element.category.name : 'No Category'}</td>
                                <td>
                                    <NavLink to={`/updateproduct/${element._id}`} className="btn btn-primary">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </NavLink>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteProduct(element._id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
