import { getDatabase, ref, update } from "firebase/database";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function Posts({ user, logout }){
  const [activeTab, setActiveTab] = useState("home"); // To track active tab
  const [searchQuery, setSearchQuery] = useState("");

  const sampleUsers = [
    'john-doe',
    'alice',
    'lorem ipsum',
    'arnav001',
    'aakash098',
    'saurav12',
    'thakur_rao',
    'neeraj-k',
    'kartik',
    'aryan@777'
  ]

  const samplePosts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    user: sampleUsers[i],
    avatar: "https://via.placeholder.com/50",
    content: `Sample post content ${i + 1}`,
    image: `https://placehold.co/100X30`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }));

  const db = getDatabase();

  const handleLike = (username) => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/activities/likes`);

    update(userRef, {
      [username]: true, // Add the liked post ID
    });

    // console.log(`${user.displayName} liked post a by ${username}`);
  };

  function handleTabSwitch(tab){
    if(!user) return;
      
    setActiveTab(tab)

    const dbLocRef = ref(db, `users/${user.uid}/activities/tabSwitch`);

    const timestamp = new Date();

    update(dbLocRef,{
        [timestamp]: tab
    })
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed h-screen w-1/4 bg-white shadow-md flex flex-col justify-between p-4">
        <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-6">SocialApp</h2>
            <button
                onClick={() => handleTabSwitch("home")}
                className={`py-2 px-4 mb-2 text-left rounded ${
                    activeTab === "home" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
            >
            🏠 Home
            </button>
            <button
          onClick={() => handleTabSwitch("explore")}
          className={`py-2 px-4 mb-2 text-left rounded ${
            activeTab === "explore"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          🔍 Explore
        </button>
        <button
          onClick={() => handleTabSwitch("settings")}
          className={`py-2 px-4 text-left rounded ${
            activeTab === "settings"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          ⚙️ Settings
        </button>
        </div>
        <div>
            <Link
                to="/admin"
                className="py-2 px-4 mb-2 text-left rounded hover:bg-blue-500 text-white bg-black transition-all duration-150"
            >
                Got to Admin Panel
            </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ps-[26%] p-6">
        {activeTab === "home" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Home</h2>
            {samplePosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded shadow mb-6 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={post.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold">{post.user}</h3>
                    <p className="text-gray-500 text-sm">Just now</p>
                  </div>
                </div>
                <p className="mb-4">{post.content}</p>
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded mb-4 max-w-full h-auto"
                />
                <div className="flex justify-between text-gray-600 text-sm">
                  <button onClick={() => handleLike(post.user)} className="hover:scale-110 transition-all duration-300">
                    👍 {post.likes} Likes
                  </button>
                  <button className="hover:scale-110 transition-all duration-300">
                    💬 {post.comments} Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "explore" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Explore</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            {samplePosts
              .filter((post) =>
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded shadow mb-6 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={post.avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-semibold">{post.user}</h3>
                      <p className="text-gray-500 text-sm">Just now</p>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <img
                    src={post.image}
                    alt="Post"
                    className="rounded mb-4 max-w-full h-auto"
                  />
                </div>
              ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <button onClick={logout} className="bg-white p-4 rounded shadow hover:bg-gray-100 cursor-pointer">Log out</button>
          </div>
        )}
      </div>
    </div>
  );
};