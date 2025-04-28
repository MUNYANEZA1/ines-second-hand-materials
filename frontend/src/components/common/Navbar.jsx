// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              INES Marketplace
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                >
                  Home
                </Link>
                {currentUser && (
                  <>
                    <Link
                      to="/create-item"
                      className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                    >
                      Post Item
                    </Link>
                    <Link
                      to="/messages"
                      className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                    >
                      Messages
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="flex items-center">
                  <Link
                    to="/profile"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link
                    to="/login"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/create-item"
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Item
                </Link>
                <Link
                  to="/messages"
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

