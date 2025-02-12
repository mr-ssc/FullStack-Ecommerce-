import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Crud.css";

const Crud = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", address: "", phone_no: "", email: "", salary: "" });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAgeRange, setFilterAgeRange] = useState("");
  const [sortType, setSortType] = useState("");

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      setFormData({ name: "", age: "", address: "", phone_no: "", email: "", salary: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({ name: user.name, age: user.age, address: user.address, phone_no: user.phone_no, email: user.email, salary: user.salary });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8989/delete/${id}`);
        alert("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filterByAgeRange = (user) => {
    const age = user.age;
    if (filterAgeRange === "1-10") return age >= 1 && age <= 10;
    if (filterAgeRange === "11-20") return age >= 11 && age <= 20;
    if (filterAgeRange === "21-30") return age >= 21 && age <= 30;
    if (filterAgeRange === "31-40") return age >= 31 && age <= 40;
    if (filterAgeRange === "41-50") return age >= 41 && age <= 50;
    if (filterAgeRange === "51-100") return age >= 51 && age <= 100;
    return true; // If no filter, show all users
  };

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(filterByAgeRange)
    .sort((a, b) => {
      if (sortType === "salary-asc") return a.salary - b.salary;
      if (sortType === "salary-desc") return b.salary - a.salary;
      if (sortType === "age-asc") return a.age - b.age;
      if (sortType === "age-desc") return b.age - a.age;
      return 0;
    });

  return (
    <div className="container">
      <h2 className="title">CRUD Function</h2>

      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="phone_no" placeholder="Phone No" value={formData.phone_no} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
        <button type="submit" className="submit-btn">{editId ? "Update User" : "Add User"}</button>
      </form>

      <h2 className="title">All User Data</h2>

      <div className="filters">
        <input type="text" placeholder="Search by Name, Email, Address" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        
        <select onChange={(e) => setFilterAgeRange(e.target.value)} className="select">
          <option value="">All Age Ranges</option>
          <option value="1-10">1 - 10</option>
          <option value="11-20">11 - 20</option>
          <option value="21-30">21 - 30</option>
          <option value="31-40">31 - 40</option>
          <option value="41-50">41 - 50</option>
          <option value="51-100">51 - 100</option>
        </select>

        <select onChange={(e) => setSortType(e.target.value)} className="select">
          <option value="">Sort By</option>
          <option value="salary-asc">Salary (Low to High)</option>
          <option value="salary-desc">Salary (High to Low)</option>
          <option value="age-asc">Age (Young to Old)</option>
          <option value="age-desc">Age (Old to Young)</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Age</th><th>Address</th><th>Phone No</th><th>Email</th><th>Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="table-row">
              <td>{user.name}</td><td>{user.age}</td><td>{user.address}</td><td>{user.phone_no}</td><td>{user.email}</td><td>{user.salary}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="action-btn edit-btn">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="action-btn delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;