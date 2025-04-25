// src/components/Navbar.jsx
// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { currentUser, isAuthenticated, logout, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const userName = currentUser?.firstName || "User"
  const userRole = currentUser?.role || ""

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl">INES Second-Hand</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/items" className="hover:text-blue-200">Browse Items</Link>

            {isAuthenticated ? (
              <>
                <Link to="/add-item" className="hover:text-blue-200">Sell Item</Link>
                <Link to="/messages" className="hover:text-blue-200">Messages</Link>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200">
                    <span className="mr-2">{userName}</span>
                    {userRole && (
                      <span className="bg-white text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {userRole}
                      </span>
                    )}
                    <svg className="h-4 w-4 ml-1 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">Profile</Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">Admin Dashboard</Link>
                    )}
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-100">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700">
            <Link to="/" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/items" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Browse Items</Link>

            {isAuthenticated ? (
              <>
                <Link to="/add-item" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Sell Item</Link>
                <Link to="/messages" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Messages</Link>
                <Link to="/profile" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Profile</Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => {
                    logout()
                    toggleMobileMenu()
                  }}
                  className="block w-full text-left py-2 hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-blue-200" onClick={toggleMobileMenu}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
