import { Search, Bell, User, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../shared/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { alerts } from '../../data/alerts';
import { useState } from 'react';

export default function TopBar() {
  const { currentUser, logout, login } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadAlerts = alerts.filter(a =>
    !a.acknowledged &&
    (currentUser?.role.includes('operations') || a.tenantId === currentUser?.tenantId)
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-surface border-b border-border sticky top-0 z-40 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search shipments, materials, or documents..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Tenant Isolated Session
          </span>
        </div>

        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2 hover:bg-border rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-secondary" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          )}
        </button>

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 hover:bg-border rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-secondary" />
          </button>

          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="font-semibold text-primary">{currentUser?.name}</div>
                <div className="text-sm text-secondary">{currentUser?.email}</div>
                <div className="text-xs text-muted mt-1">{currentUser?.tenantName}</div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-border hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
