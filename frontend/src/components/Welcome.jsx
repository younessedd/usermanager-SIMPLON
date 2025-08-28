export default function Welcome() {
  const username = localStorage.getItem("username") || "User";

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="welcome">
      <div className="card">
        <h2>Welcome, {username} 🎉</h2>
        <p>You are logged in successfully.</p>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
