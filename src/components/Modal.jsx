import "./Modal.css";

import { useState } from "react";

const Modal = ({ onStartGame }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    const userData = localStorage.getItem(username);
    if (userData) {
      const storedData = JSON.parse(userData);
      if (password === storedData.password) {
        onStartGame(username, storedData.level);
        return;
      }
    }
    // If user doesn't exist or password is incorrect, create a new user
    const newUserData = { username, password, level: 1 };
    localStorage.setItem(username, JSON.stringify(newUserData));
    onStartGame(username, 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Welcome to Memoryfa!</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 font-semibold text-ye"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Modal;
