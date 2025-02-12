import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css"; // Import the CSS file

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        due_date: "",
        assigned_name: "",
    });
    const [editId, setEditId] = useState(null); // To track which task is being edited

    // Fetch all tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8989/task");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add or Update Task
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Update existing task
                await axios.put(`http://localhost:8989/task/update/${editId}`, formData);
            } else {
                // Add new task
                await axios.post("http://localhost:8989/task/create", formData);
            }
            fetchTasks();
            setFormData({ title: "", due_date: "", assigned_name: "" });
            setEditId(null);
        } catch (error) {
            console.error("Error adding/updating task:", error);
        }
    };

    // Delete task
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8989/task/delete/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Edit task
    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            due_date: task.due_date,
            assigned_name: task.assigned_name,
        });
        setEditId(task.id);
    };

    return (
        <div className="task-management">
            <h2>Task Management</h2>
            
            {/* Task Form */}
            <form className="task-form" onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" required />
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
                <input type="text" name="assigned_name" value={formData.assigned_name} onChange={handleChange} placeholder="Assigned To" required />
                <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
            </form>

            {/* Task List */}
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> - {task.due_date} - {task.assigned_name}
                        <button onClick={() => handleEdit(task)}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Task;