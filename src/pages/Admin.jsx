import { useState, useEffect } from "react";
import AdminPanelHome from "../components/AdminPanelHome";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const ADMIN_EMAIL = "admin";
  const ADMIN_PASSWORD = "admin";

  useEffect(() => {
    const storedAdminStatus = localStorage.getItem("adminLoggedIn");
    if (storedAdminStatus === "true") {
      setAdminLoggedIn(true);
      setRole("admin");
    }
  }, []);

  const loginAsAdmin = (e) => {
    e.preventDefault();
    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true);
      setRole("admin");
      localStorage.setItem("adminLoggedIn", "true");
    } else {
      alert("Invalid admin credentials");
    }
  };

  const logoutAdmin = () => {
    setAdminLoggedIn(false);
    setRole("user");
    localStorage.removeItem("adminLoggedIn");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {role === "admin" ? (
        <>
          <AdminPanelHome />
        </>
      ) : (
        <>
          <h1>Please Log In as Admin</h1>
          <form onSubmit={loginAsAdmin} className="space-y-4">
            <input
              type="name"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-64"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-64"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white">
              Log In as Admin
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Admin;