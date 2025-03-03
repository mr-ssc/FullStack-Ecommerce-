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

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8989/user");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8989/user/update/${editId}`, formData);
        alert("User updated successfully");
        setEditId(null);
      } else {
        await axios.post("http://localhost:8989/user/create", formData);
        alert("User added successfully");
      }
      setFormData({ name: "", age: "", address: "", phone_no: "", email: "", salary: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Edit user details
  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({
      name: user.name,
      age: user.age,
      address: user.address,
      phone_no: user.phone_no,
      email: user.email,
      salary: user.salary,
    });
  };

  // Delete user from frontend and backend
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8989/delete/${id}`);
        alert("User deleted successfully");
        setUsers(users.filter(user => user.id !== id)); // Update state to reflect deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Filter users by age range
  const filterByAgeRange = (user) => {
    const age = user.age;
    const ageRanges = {
      "1-10": [1, 10], "11-20": [11, 20], "21-30": [21, 30], "31-40": [31, 40], "41-50": [41, 50], "51-100": [51, 100]
    };
    return filterAgeRange ? (age >= ageRanges[filterAgeRange][0] && age <= ageRanges[filterAgeRange][1]) : true;
  };

  // Apply search and filters
  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase()))
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

      {/* User Form */}
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map(key => (
          <input key={key} type={key === "email" ? "email" : "text"} name={key} placeholder={key.replace("_", " ")} value={formData[key]} onChange={handleChange} required />
        ))}
        <button type="submit" className="submit-btn">{editId ? "Update User" : "Add User"}</button>
      </form>

      <h2 className="title">All User Data</h2>

      {/* Search & Filters */}
      <div className="filters">
        <input type="text" placeholder="Search by Name, Email, Address" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        <select onChange={(e) => setFilterAgeRange(e.target.value)} className="select">
          <option value="">All Age Ranges</option>
          {["1-10", "11-20", "21-30", "31-40", "41-50", "51-100"].map(range => <option key={range} value={range}>{range}</option>)}
        </select>
        <select onChange={(e) => setSortType(e.target.value)} className="select">
          <option value="">Sort By</option>
          <option value="salary-asc">Salary (Low to High)</option>
          <option value="salary-desc">Salary (High to Low)</option>
          <option value="age-asc">Age (Young to Old)</option>
          <option value="age-desc">Age (Old to Young)</option>
        </select>
      </div>

      {/* User Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Phone No</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id} className="table-row">
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.address}</td>
              <td>{user.phone_no}</td>
              <td>{user.email}</td>
              <td>{user.salary}</td>
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
