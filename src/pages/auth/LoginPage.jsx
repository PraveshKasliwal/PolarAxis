import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { useToast } from '../../context/ToastContext';
import { users } from '../../data/users';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = login(email, password);

    if (success) {
      toast.success('Login successful');
      const loggedUser = users.find(u => u.email === email);
      if (loggedUser?.tenantId === 'ops') {
        navigate('/ops/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } else {
      toast.error('Invalid credentials');
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
            <img src="/ChatGPT_Image_Mar_8__2026__10_36_09_AM-removebg-preview.png" alt="PolarAxis" className="w-12 h-12 object-contain" />
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
