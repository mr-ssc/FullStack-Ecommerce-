// Category.js Code :-

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Category.css"; // Import the CSS file


const Category = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get("http://localhost:8989/categories");
        setCategories(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if (image) formData.append("image", image);

        if (editingId) {
            await axios.put(`http://localhost:8989/categories/${editingId}`, formData);
        } else {
            await axios.post("http://localhost:8989/categories", formData);
        }

        setName("");
        setImage(null);
        setEditingId(null);
        fetchCategories();
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8989/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="category-container">
            <form onSubmit={handleSubmit} className="category-form">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    required
                    />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">{editingId ? "Update" : "Add"}</button>
            </form>

                    <h2>Category List</h2>
            <table className="category-table">
                <thead>
                    <tr>
                        <th>SR No.</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.id}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>
                                {category.image && (
                                    <img
                                        src={`data:image/png;base64,${category.image}`}
                                        alt="Category"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                )}
                            </td>

                            <td> 
                                <button className="edit-button" onClick={() => handleEdit(category)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(category.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Category;
