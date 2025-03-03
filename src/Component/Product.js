import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        categoryid: "",
        categoryname: "",
        sub_category_id: "",
        sub_category_name: "",
        weight: "",
        pcs: "",
        original_price: "",
        discount_price: "",
        image: null,
    });

    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8989/product");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8989/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8989/subcategories");
            setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else if (name === "categoryid") {
            const selectedCategory = categories.find(cat => cat.id === parseInt(value));
            setFormData({ 
                ...formData, 
                categoryid: value, 
                categoryname: selectedCategory ? selectedCategory.name : "" 
            });
        } else if (name === "sub_category_id") {
            const selectedSubCategory = subCategories.find(sub => sub.id === parseInt(value));
            setFormData({ 
                ...formData, 
                sub_category_id: value, 
                sub_category_name: selectedSubCategory ? selectedSubCategory.name : "" 
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            if (editing) {
                await axios.put(`http://localhost:8989/product/${formData.id}`, formDataToSend);
            } else {
                await axios.post("http://localhost:8989/product", formDataToSend);
            }

            setFormData({ 
                id: "", name: "", categoryid: "", categoryname: "", 
                sub_category_id: "", sub_category_name: "", weight: "", 
                pcs: "", original_price: "", discount_price: "", image: null 
            });
            setEditing(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            categoryid: product.categoryid,
            categoryname: product.categoryname,
            sub_category_id: product.sub_category_id,
            sub_category_name: product.sub_category_name,
            weight: product.weight,
            pcs: product.pcs,
            original_price: product.original_price,
            discount_price: product.discount_price,
            image: null, // Keep null so that existing image is not lost
        });
        setEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:8989/product/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    return (
        <div className="product-container">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
                <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} required />
                <input type="number" name="pcs" placeholder="Pcs" value={formData.pcs} onChange={handleChange} required />
                <input type="number" name="original_price" placeholder="Original Price" value={formData.original_price} onChange={handleChange} required />
                <input type="number" name="discount_price" placeholder="Discount Price" value={formData.discount_price} onChange={handleChange} required />

                <select name="categoryid" value={formData.categoryid} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <select name="sub_category_id" value={formData.sub_category_id} onChange={handleChange} required>
                    <option value="">Select Subcategory</option>
                    {subCategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>

                <input type="file" name="image" onChange={handleChange} accept="image/png, image/jpeg" />
                <button type="submit">{editing ? "Update" : "Add"} Product</button>
            </form>

            <h2>Product List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Pcs</th>
                        <th>Original Price</th>
                        <th>Discount Price</th>
                        <th>Category Name</th>
                        <th>Subcategory Name</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.weight}</td>
                            <td>{product.pcs}</td>
                            <td>{product.original_price}</td>
                            <td>{product.discount_price}</td>
                            <td>{product.categoryname}</td>
                            <td>{product.subcategory_name}</td>
                            <td>
                                {product.image && (
                                    <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} width="50" height="50" />
                                )}
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Product;
