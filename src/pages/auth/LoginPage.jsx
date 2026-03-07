import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, TrendingUp, User, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { tenants } from '../../data/tenants';
import { users } from '../../data/users';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [stats, setStats] = useState({ shipments: 0, compliance: 0, countries: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { shipments: 247, compliance: 99.8, countries: 14 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        shipments: Math.floor(targets.shipments * progress),
        compliance: (targets.compliance * progress).toFixed(1),
        countries: Math.floor(targets.countries * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !tenantId) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = login(email, password, tenantId);

    if (success) {
      toast.success('Login successful');
      if (tenantId === 'ops') {
        navigate('/ops/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleDemoLogin = (role) => {
    let demoUser;
    switch (role) {
      case 'operations':
        demoUser = users.find(u => u.role === 'operations_admin');
        break;
      case 'client':
        demoUser = users.find(u => u.role === 'client_user' && u.tenantId === 'tenant-1');
        break;
      case 'auditor':
        demoUser = users.find(u => u.role === 'compliance_auditor');
        break;
      default:
        return;
    }

    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
      setTenantId(demoUser.tenantId);

      setTimeout(() => {
        const success = login(demoUser.email, demoUser.password, demoUser.tenantId);
        if (success) {
          toast.success('Demo login successful');
          if (demoUser.tenantId === 'ops') {
            navigate('/ops/dashboard');
          } else {
            navigate('/client/dashboard');
          }
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#16b6bb] to-[#008086] rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">PolarAxis</span>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-primary">Sign in to your account</h1>
          <p className="text-secondary mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Organization
              </label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="">Select organization...</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} {tenant.id !== 'ops' && `(${tenant.plan})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-secondary uppercase mb-3">Quick Demo Login</div>
              <button
                type="button"
                onClick={() => handleDemoLogin('operations')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#16b6bb]/10 hover:bg-[#16b6bb]/20 border border-sky-500/30 rounded-lg text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-[#16b6bb] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-primary">Login as Operations Admin</div>
                  <div className="text-xs text-secondary">View all shipments and analytics</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-primary">Login as Client User</div>
                  <div className="text-xs text-secondary">NovaBio Pharma dashboard</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('auditor')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-primary">Login as Compliance Auditor</div>
                  <div className="text-xs text-secondary">Compliance and documentation</div>
                </div>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0d2b2c] via-[#0d3b3c] to-[#0d2b2c] dark:from-black dark:via-[#0d3b3c] dark:to-black items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-white space-y-12"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Cold-chain control.
              <br />
              Zero compromise.
            </h2>
            <p className="text-[#befcfe] text-lg">
              Real-time monitoring and AI-powered logistics for pharmaceutical supply chains
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <Globe className="w-8 h-8 text-[#befcfe] mb-3" />
              <div className="text-3xl font-bold mb-1 font-mono">{stats.shipments}</div>
              <div className="text-sm text-[#befcfe]">Active Shipments</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
              <div className="text-3xl font-bold mb-1 font-mono">{stats.compliance}%</div>
              <div className="text-sm text-[#befcfe]">Temp Compliance</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <Package className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-3xl font-bold mb-1 font-mono">{stats.countries}</div>
              <div className="text-sm text-[#befcfe]">Countries Covered</div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#16b6bb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <div className="font-semibold mb-1">Multi-tenant isolation</div>
                <div className="text-sm text-[#befcfe]">Enterprise-grade security and data separation</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#16b6bb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <div className="font-semibold mb-1">Real-time telemetry</div>
                <div className="text-sm text-[#befcfe]">24/7 temperature monitoring with instant alerts</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#16b6bb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">✓</span>
              </div>
              <div>
                <div className="font-semibold mb-1">Compliance automation</div>
                <div className="text-sm text-[#befcfe]">Automated documentation and audit trails</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
