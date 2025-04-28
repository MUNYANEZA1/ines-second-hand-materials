// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Page Components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import CreateItemPage from "./pages/CreateItemPage";
import EditItemPage from "./pages/EditItemPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import AdminPage from "./pages/AdminPage";

// Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Notification from "./components/common/Notification";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Context Providers
import { NotificationProvider } from "./context/NotificationContext";

// Services
import { authService } from "./services/authService";

function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already logged in with a valid token
    const verifyAuth = async () => {
      try {
        await authService.verifyToken();
      } catch (error) {
        console.error("Token verification failed:", error);
        authService.logout();
      } finally {
        setInitializing(false);
      }
    };

    verifyAuth();
  }, []);

  if (initializing) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/item/:id" element={<ItemDetailPage />} />

              {/* Protected routes */}
              <Route
                path="/item/create"
                element={
                  <ProtectedRoute>
                    <CreateItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/item/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Notification />
      </div>
    </NotificationProvider>
  );
}

export default App;
