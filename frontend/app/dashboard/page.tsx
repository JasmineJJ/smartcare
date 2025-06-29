"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}</h1>
        <p className="mb-6">This is a protected dashboard.</p>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">Log out</button>
      </div>
    </ProtectedRoute>
  );
} 