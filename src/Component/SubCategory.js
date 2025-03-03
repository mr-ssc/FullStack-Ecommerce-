import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SubCategory.css"; // Import the CSS file

const SubCategory = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        fk_category_id: "",
        fk_category_name: "",
        image: null,
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8989/subcategories");
            setSubcategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8989/categories"); // Ensure this API exists
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("fk_category_id", formData.fk_category_id);
        formDataToSend.append("fk_category_name", categories.find(cat => cat.id === parseInt(formData.fk_category_id))?.name || "");
        if (formData.image) formDataToSend.append("image", formData.image);

        try {
            if (editing) {
                await axios.put(`http://localhost:8989/subcategories/${formData.id}`, formDataToSend);
            } else {
                await axios.post("http://localhost:8989/subcategories", formDataToSend);
            }
            setFormData({ id: "", name: "", fk_category_id: "", fk_category_name: "", image: null });
            setEditing(false);
            fetchSubCategories();
        } catch (error) {
            console.error("Error saving subcategory:", error);
        }
    };

    const handleEdit = (sub) => {
        setFormData({
            id: sub.id,
            name: sub.name,
            fk_category_id: sub.fk_category_id,
            fk_category_name: sub.fk_category_name,
            image: null, 
        });
        setEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            try {
                await axios.delete(`http://localhost:8989/subcategories/${id}`);
                fetchSubCategories();
            } catch (error) {
                console.error("Error deleting subcategory:", error);
            }
        }
    };

    return (
        <div className="subcategory-container">
            <h2 className="subcategory-heading">SubCategory List</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="subcategory-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Subcategory Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="subcategory-input"
                    required
                />

                <select
                    name="fk_category_id"
                    value={formData.fk_category_id}
                    onChange={handleChange}
                    className="subcategory-select"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id} className="subcategory-option">
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/png, image/jpeg"
                    className="subcategory-file-input"
                />

                <button type="submit" className="subcategory-submit-button">
                    {editing ? "Update" : "Add"} SubCategory
                </button>
            </form>

            <table className="subcategory-table">
                <thead>
                    <tr>
                        <th className="subcategory-th">Sr No.</th>
                        <th className="subcategory-th">Name</th>
                        <th className="subcategory-th">Category Name</th>
                        <th className="subcategory-th">Image</th>
                        <th className="subcategory-th">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subcategories.map((sub, index) => (
                        <tr key={sub.id} className="subcategory-tr">
                            <td className="subcategory-td">{index + 1}</td>
                            <td className="subcategory-td">{sub.name}</td>
                            <td className="subcategory-td">{sub.fk_category_name}</td>
                            <td className="subcategory-td">
                                {sub.image && (
                                    <img
                                        src={`data:image/png;base64,${sub.image}`}
                                        alt={sub.name}
                                        className="subcategory-image"
                                    />
                                )}
                            </td>
                            <td className="subcategory-td">
                                <button
                                    onClick={() => handleEdit(sub)}
                                    className="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(sub.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubCategory;