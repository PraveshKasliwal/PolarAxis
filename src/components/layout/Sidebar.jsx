import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Plane, Ship, Brain as Train, Truck, Archive, Users, MapPin, FileText, AlertCircle, BarChart3, Leaf, Settings, ShoppingCart, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const opsNavigation = [
  {
    section: 'Main',
    items: [
      { name: 'Control Tower', path: '/ops/dashboard', icon: LayoutDashboard },
      {
        name: 'Shipments',
        icon: Package,
        items: [
          { name: 'All Shipments', path: '/ops/shipments', icon: Package },
          { name: 'Air', path: '/ops/shipments/air', icon: Plane },
          { name: 'Sea', path: '/ops/shipments/sea', icon: Ship },
          { name: 'Rail', path: '/ops/shipments/rail', icon: Train },
          { name: 'Road', path: '/ops/shipments/road', icon: Truck }
        ]
      }
    ]
  },
  {
    section: 'Operations',
    items: [
      { name: 'Inventory', path: '/inventory', icon: Archive },
      { name: 'Cold Storage', path: '/cold-storage', icon: MapPin },
      { name: 'Tenants', path: '/admin/tenants', icon: Building2 }
    ]
  },
  {
    section: 'Monitoring',
    items: [
      { name: 'Compliance', path: '/compliance', icon: FileText },
      { name: 'Alerts', path: '/alerts', icon: AlertCircle },
      { name: 'Analytics', path: '/ops/analytics', icon: BarChart3 },
      { name: 'Sustainability', path: '/sustainability', icon: Leaf }
    ]
  },
  {
    section: 'Settings',
    items: [{ name: 'Settings', path: '/settings', icon: Settings }]
  }
];

const clientNavigation = [
  {
    section: 'Main',
    items: [
      { name: 'Overview', path: '/client/dashboard', icon: LayoutDashboard },
      { name: 'My Shipments', path: '/client/shipments', icon: Package },
      { name: 'New Order', path: '/orders/new', icon: ShoppingCart },
      { name: 'Procurement', path: '/procurement', icon: Archive }
    ]
  },
  {
    section: 'Management',
    items: [
      { name: 'Documents', path: '/compliance', icon: FileText },
      { name: 'Alerts', path: '/alerts', icon: AlertCircle },
      { name: 'Settings', path: '/settings', icon: Settings }
    ]
  }
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const navigation =
    currentUser?.role === 'operations_admin' || currentUser?.role === 'logistics_coordinator'
      ? opsNavigation
      : clientNavigation;

  const toggleExpanded = (name) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="bg-surface border-r border-border flex flex-col h-screen sticky top-0"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[#16b6bb] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary">PolarAxis</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-border rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-secondary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-secondary" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-6">
        {navigation.map((section) => (
          <div key={section.section}>
            {!isCollapsed && (
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-3">
                {section.section}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.name}>
                  {item.items ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-border hover:text-primary transition-colors"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left text-sm font-medium">
                              {item.name}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                expandedItems[item.name] ? 'rotate-90' : ''
                              }`}
                            />
                          </>
                        )}
                      </button>
                      {expandedItems[item.name] && !isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-4 mt-1 space-y-1"
                        >
                          {item.items.map((subItem) => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? 'bg-accent text-white'
                                    : 'text-secondary hover:bg-border hover:text-primary'
                                }`
                              }
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-accent text-white'
                            : 'text-secondary hover:bg-border hover:text-primary'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {!isCollapsed && currentUser && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-secondary truncate">{currentUser.role.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
