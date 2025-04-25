import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ItemsPage from "./pages/ItemsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AddItemPage from "./pages/AddItemPage";
import MessagesPage from "./pages/MessagesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-item" element={<AddItemPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
