import { useEffect, useState, useCallback } from "react";
import { getUsers, deleteUser } from "../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState(""); // حالة البحث

  const loadUsers = useCallback(async () => {
    try {
      setErr("");
      const { data } = await getUsers();
      setUsers(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Server error");
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/";
      return;
    }
    loadUsers();
  }, [loadUsers]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((list) => list.filter((u) => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Server error");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // فلترة المستخدمين حسب البحث
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="topbar">
        <h2>User Dashboard</h2>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      {err && <div className="error">{err}</div>}

      {/* Search input */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "#0b1220",
            color: "var(--text)"
          }}
        />
      </div>

      {/* Table for desktop */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="danger" onClick={() => onDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>No users</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="cards-wrap">
        {filteredUsers.map((u, i) => (
          <div className="user-card" key={u._id}>
            <h3>{u.username}</h3>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>
            <button className="danger" onClick={() => onDelete(u._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
