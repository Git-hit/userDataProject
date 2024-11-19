import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from "firebase/database";
import Posts from "../components/Posts";

const Home = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user"); // Default role as 'user'

  useEffect(() => {
    const db = getDatabase();
  
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setRole("user");
  
        const userRef = ref(db, `users/${currentUser.uid}`);
  
        // Update status to online
        await set(userRef, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          online: true,
          lastActive: serverTimestamp(),
        });
  
        // Ensure `onDisconnect` is set
        onDisconnect(userRef).update({
          online: false,
          lastActive: serverTimestamp(),
        });
      } else {
        setUser(null);
        setRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const db = getDatabase();
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
  
      const userRef = ref(db, `users/${user.uid}`);
  
      // Update user details and set online status
      await set(userRef, {
        displayName: user.displayName,
        email: user.email,
        online: true,
        lastActive: serverTimestamp(),
      });
  
      // Ensure `onDisconnect` is called AFTER the user logs in
      onDisconnect(userRef).update({
        online: false,
        lastActive: serverTimestamp(),
      });
  
      setUser(user);
      setRole("user");
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  const logout = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Mark user as offline before signing out
      await set(userRef, {
        displayName: user.displayName,
        email: user.email,
        online: false,
        lastActive: serverTimestamp(),
      });

      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <Posts user={user} logout={logout} />
        </>
      ) : (
        <button onClick={loginWithGoogle} className="p-2 bg-blue-500 text-white">
          Log In with Google
        </button>
      )}
    </div>
  );
};

export default Home;