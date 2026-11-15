import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, ShieldAlert, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND } from '../theme/brand';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Cups', path: '/#our-cups' },
    { label: 'About Us', path: '/#about-us' },
    { label: 'Features', path: '/#features' },
    { label: 'Ingredients', path: '/#ingredients' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Cup2Eat Circular Emblem Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8A051] shadow-md group-hover:scale-105 transition-transform duration-200 bg-[#1B382B]">
              <img
                src={BRAND.logo.src}
                alt={BRAND.logo.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center font-bold text-xs text-[#D4AF37]">C2E</div>';
                }}
              />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-[#1B382B] flex items-center leading-none">
                CUP<span className="text-[#C8A051] mx-1">2</span>EAT
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-bold text-[#6C7A70] mt-1">
                The Cup You Can Eat
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  isActive(link.path)
                    ? 'text-[#1B382B] border-b-2 border-[#C8A051] pb-1'
                    : 'text-[#4A574E] hover:text-[#1B382B]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Admin Portal Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1B382B] text-[#D4AF37] border border-[#C8A051]/40 hover:bg-[#142B21] transition-colors shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#1B382B] hover:bg-[#EDE4D5]/60 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C8A051] text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#1B382B] hover:bg-[#EDE4D5]/60 transition-colors text-xs font-bold"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B382B] text-[#D4AF37] flex items-center justify-center font-bold text-xs border border-[#C8A051]/50">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-[#F5EFE6] font-semibold"
                    >
                      My Dashboard & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-xs text-[#1B382B] bg-[#E8ECE8] font-bold"
                      >
                        Admin Operations Portal
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-xs font-bold text-[#1B382B] hover:text-[#0C1C15] px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-[#1B382B] hover:bg-[#142B21] text-[#FBF9F5] px-4 py-2.5 rounded-xl border border-[#C8A051]/40 shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1B382B] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F5] border-b border-[#E8E2D5] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#1B382B] py-2 border-b border-[#EDE4D5]"
            >
              {link.label}
            </a>
          ))}
          {!user && (
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-[#1B382B] border border-[#1B382B] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-[#1B382B] text-white rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
