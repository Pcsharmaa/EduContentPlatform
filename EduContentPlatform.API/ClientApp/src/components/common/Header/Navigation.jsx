import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          EduContent
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex items-center space-x-6">

          <Link to="/browse" className="hover:text-blue-500">
            Browse
          </Link>

          {user && (
            <>
              <Link to="/upload" className="hover:text-blue-500">
                Upload
              </Link>

              <Link to="/dashboard" className="hover:text-blue-500">
                Dashboard
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => {
              const m = document.getElementById("mobile-menu");
              m.classList.toggle("hidden");
            }}
          >
            <span className="text-2xl">&#9776;</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-white px-4 pb-3 space-y-3">

        <Link to="/browse" className="block hover:text-blue-500">
          Browse
        </Link>

        {user && (
          <>
            <Link to="/upload" className="block hover:text-blue-500">
              Upload
            </Link>

            <Link to="/dashboard" className="block hover:text-blue-500">
              Dashboard
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="block hover:text-blue-500">
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <button
            className="block px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
