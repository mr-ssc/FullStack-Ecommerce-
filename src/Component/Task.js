import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css";

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterUser, setFilterUser] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        due_date: "",
        fk_user_id: "",
        status: "done", // Default status
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8989/task");
            const formattedTasks = response.data.map(task => ({
                ...task,
                due_date: new Date(task.due_date).toLocaleDateString("en-GB")
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8989/user");
            setUsers(response.data);
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
            const updatedData = {
                ...formData,
                due_date: new Date(formData.due_date).toISOString(),
            };
            if (editId) {
                await axios.put(`http://localhost:8989/task/update/${editId}`, updatedData);
            } else {
                await axios.post("http://localhost:8989/task/create", updatedData);
            }
            fetchTasks();
            setFormData({ title: "", due_date: "", fk_user_id: "", status: "done" });
            setEditId(null);
        } catch (error) {
            console.error("Error adding/updating task:", error);
            alert("An error occurred while adding/updating the task.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`http://localhost:8989/task/delete/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            due_date: task.due_date.split("/").reverse().join("-"),
            fk_user_id: task.fk_user_id,
            status: task.status,
        });
        setEditId(task.id);
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await axios.put(`http://localhost:8989/task/update/${task.id}`, {
                ...task,
                status: newStatus,
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("An error occurred while updating the task status.");
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterUser ? task.fk_user_id === Number(filterUser) : true)
    );

    return (
        <div className="task-management">
            <h2>Task Management</h2>

            <form className="task-form" onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" required />
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
                <select name="fk_user_id" value={formData.fk_user_id} onChange={handleChange} required>
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                {/* <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="done">Done</option>
                    <option value="snooze">Snooze</option>
                    <option value="delete">Delete</option>
                </select> */}
                <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
            </form>

            <h2 className="heading">Task List</h2>
            <div className="filters">
                <input type="text" placeholder="Search by task title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                    <option value="">Filter by User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>

            <table className="task-table">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Assigned User</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task, index) => (
                        <tr key={task.id}>
                            <td>{index + 1}</td>
                            <td>{task.title}</td>
                            <td>{task.due_date}</td>
                            <td>{task.fk_user_name}</td>
                            <td>
                                <select value={task.status} onChange={(e) => handleStatusChange(task, e.target.value)}>
                                    <option value="done">Done</option>
                                    <option value="snooze">Snooze</option>
                                    <option value="delete">Delete</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(task)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Task;
