import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null); // To track which user's dropdown is expanded

    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, "users");

        // Listen for changes in the users' data
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedUsers = Object.keys(data).map((uid) => ({
                    uid,
                    ...data[uid],
                }));
                setUsers(formattedUsers);
            } else {
                setUsers([]); // No users found
            }
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    const toggleDropdown = (uid) => {
        setExpandedUser(expandedUser === uid ? null : uid);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <div className="w-full max-w-4xl bg-white rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-2">User Status & Activities</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-200">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Last Active</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.uid} className="border-b">
                                        <td className="px-4 py-2">{user.displayName || "N/A"}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">
                                            {user.online ? (
                                                <span className="text-green-500 font-semibold">Online</span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">Offline</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {user.lastActive
                                                ? new Date(user.lastActive).toLocaleString()
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => toggleDropdown(user.uid)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                            >
                                                {expandedUser === user.uid ? "Hide" : "View"} Activities
                                            </button>
                                            {expandedUser === user.uid && (
                                                <div className="mt-2 p-4 bg-gray-100 border rounded">
                                                    <h3 className="text-lg font-semibold">Activities</h3>
                                                    {user.activities ? (
                                                        <>
                                                            {user.activities.likes && (
                                                                <details className="mb-2">
                                                                    <summary className="cursor-pointer">Liked Posts</summary>
                                                                    <ul className="list-disc ml-4">
                                                                        {Object.keys(user.activities.likes).map((username) => (
                                                                            <li key={username}>Liked {username}&#39;s post</li>
                                                                        ))}
                                                                    </ul>
                                                                </details>
                                                            )}
                                                            {user.activities.tabSwitch && (
                                                                <details>
                                                                    <summary className="cursor-pointer">Tab Switch History</summary>
                                                                    <ul className="list-disc ml-4">
                                                                        {Object.entries(user.activities.tabSwitch).map(([timestamp, tab]) => (
                                                                            <li key={timestamp}>
                                                                                Switched to <strong>{tab}</strong> at {new Date(timestamp).toLocaleString()}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </details>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p>No activity found</p>
                                                    )}


                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;