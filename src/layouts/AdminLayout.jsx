import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Boxes, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldCheck,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { BRAND } from '../theme/brand';

const AdminLayout = () => {
  const { user, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isDark, toggleTheme, pageBg, sidebarBg, headerBg, border, textMuted, textMain } = useAdminTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#C8A051] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Guard: if not admin
  if (!user || !isAdmin) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${pageBg}`}>
        <div className={`max-w-md w-full border rounded-2xl p-8 text-center shadow-xl ${isDark ? 'bg-[#1E1E1E] border-[#2E2E2E]' : 'bg-white border-slate-200'}`}>
          <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-tight">Admin Restricted Area</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Authorized administrator credentials are required to view this operations dashboard.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-2.5 px-4 bg-[#C8A051] hover:bg-[#B38D40] text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className={`flex-1 py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border ${isDark ? 'bg-[#2A2A2A] hover:bg-[#333333] border-[#383838] text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex ${pageBg} transition-colors duration-200`}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col ${collapsed ? 'w-20' : 'w-64'} ${sidebarBg} border-r ${border} p-4 justify-between transition-all duration-200 z-20`}
      >
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50 dark:border-[#282828]">
            <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#C8A051]/60 bg-[#1B382B] shrink-0 p-0.5">
                <img
                  src={BRAND.logo.src}
                  alt={BRAND.logo.alt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {!collapsed && (
                <div className="leading-tight">
                  <h1 className={`font-black text-sm tracking-tight ${textMain}`}>
                    Cup2Eat
                  </h1>
                  <span className="text-[10px] text-[#C8A051] font-bold uppercase tracking-wider">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-[#252525] dark:hover:text-white transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setCollapsed(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-[#252525] dark:hover:text-white transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? isDark
                        ? 'bg-[#2A2A2A] text-white border border-[#383838] shadow-sm font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isDark
                      ? 'text-slate-400 hover:bg-[#222222] hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#C8A051]' : ''}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className={`pt-4 border-t ${border} space-y-2`}>
          <Link
            to="/"
            target="_blank"
            title="Open Live Storefront"
            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-[#C8A051] transition-colors`}
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#C8A051]" />
              {!collapsed && <span>Live Store</span>}
            </span>
            {!collapsed && (
              <ExternalLink className="w-3 h-3 text-slate-400" />
            )}
          </Link>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-2 px-3.5'} py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`h-16 ${headerBg} border-b ${border} px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
                E-Commerce Management Dashboard
              </p>
            </div>
          </div>

          {/* Right Header: Theme Switcher & Admin Info */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${
                isDark
                  ? 'bg-[#252525] border-[#383838] text-amber-400 hover:bg-[#2C2C2C]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle admin color theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-slate-300 text-[11px]">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden md:inline text-slate-600 text-[11px]">Dark Mode</span>
                </>
              )}
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-[#2C2C2C]">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-[#C8A051] dark:bg-[#2A2A2A] font-bold flex items-center justify-center text-xs border border-[#C8A051]/30">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-xs font-bold leading-none ${textMain}`}>{user.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <div className={`w-72 max-w-[85%] ${sidebarBg} h-full p-6 flex flex-col justify-between shadow-2xl border-r ${border}`}>
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-[#282828]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#C8A051] bg-[#1B382B] p-0.5">
                      <img src={BRAND.logo.src} alt={BRAND.logo.alt} className="w-full h-full object-cover rounded" />
                    </div>
                    <div>
                      <h2 className={`font-bold text-sm ${textMain}`}>Cup2Eat Admin</h2>
                      <span className="text-[10px] text-[#C8A051] uppercase font-bold">Operations</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                          active
                            ? isDark
                              ? 'bg-[#2A2A2A] text-white font-bold'
                              : 'bg-slate-900 text-white font-bold'
                            : isDark
                            ? 'text-slate-400 hover:bg-[#222222]'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-[#C8A051]' : ''}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className={`pt-4 border-t ${border} space-y-2`}>
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium border ${isDark ? 'bg-[#252525] border-[#333333] text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                >
                  <span className="flex items-center gap-2">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Admin Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
