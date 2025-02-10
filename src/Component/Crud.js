import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Crud.css";

const Crud = () => {
  const [users, setUsers] = useState([]); // Store user data
  const [formData, setFormData] = useState({ name: "", age: "", address: "", phone_no: "", email: "" }); // Form input data
  const [editId, setEditId] = useState(null); // Track ID for updating

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8989/user");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8989/update/${editId}`, formData);
        alert("User updated successfully");
        setEditId(null);
      } else {
        await axios.post("http://localhost:8989/create", formData);
        alert("User added successfully");
      }
      setFormData({ name: "", age: "", address: "", phone_no: "", email: "" });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Set data for editing
  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({ name: user.name, age: user.age, address: user.address, phone_no: user.phone_no, email: user.email });
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8989/delete/${id}`);
        alert("User deleted successfully");
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2>CRUD Function</h2>

      {/* Form for Create/Update */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="phone_no" placeholder="Phone No" value={formData.phone_no} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <button type="submit">{editId ? "Update User" : "Add User"}</button>
      </form>

      {/* Display Users */}
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Phone No</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.address}</td>
              <td>{user.phone_no}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;
