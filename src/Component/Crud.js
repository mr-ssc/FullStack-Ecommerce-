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
    const ageRanges = {
      "1-10": [1, 10], "11-20": [11, 20], "21-30": [21, 30], "31-40": [31, 40], "41-50": [41, 50], "51-100": [51, 100]
    };
    return filterAgeRange ? (age >= ageRanges[filterAgeRange][0] && age <= ageRanges[filterAgeRange][1]) : true;
  };

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.address.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(filterByAgeRange)
    .sort((a, b) => {
      const sorting = {
        "salary-asc": a.salary - b.salary,
        "salary-desc": b.salary - a.salary,
        "age-asc": a.age - b.age,
        "age-desc": b.age - a.age
      };
      return sortType ? sorting[sortType] : 0;
    });

  return (
    <div className="container">
      <h2 className="title">CRUD Function</h2>

      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map(key => (
          <input key={key} type={key === "email" ? "email" : "text"} name={key} placeholder={key.replace("_", " ")} value={formData[key]} onChange={handleChange} required />
        ))}
        <button type="submit" className="submit-btn">{editId ? "Update User" : "Add User"}</button>
      </form>

      <h2 className="title">All User Data</h2>

      <div className="filters">
        <input type="text" placeholder="Search by Name, Email, Address" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        <select onChange={(e) => setFilterAgeRange(e.target.value)} className="select">
          <option value="">All Age Ranges</option>
          {["1-10", "11-20", "21-30", "31-40", "41-50", "51-100"].map(range => <option key={range} value={range}>{range}</option>)}
        </select>
        <select onChange={(e) => setSortType(e.target.value)} className="select">
          <option value="">Sort By</option>
          {[["salary-asc", "Salary (Low to High)"], ["salary-desc", "Salary (High to Low)"], ["age-asc", "Age (Young to Old)"], ["age-desc", "Age (Old to Young)"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>{["Name", "Age", "Address", "Phone No", "Email", "Salary", "Actions"].map(header => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="table-row">
              {Object.values(user).slice(1).map((value, index) => <td key={index}>{value}</td>)}
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
