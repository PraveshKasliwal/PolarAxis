import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, EyeOff, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { invites, consumeInvite } from '../../data/invites';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const toast = useToast();
  const { registerFromInvite } = useAuth();

  const [invite, setInvite] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('checking');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      return;
    }
    const found = invites.find(i => i.token === token);
    if (!found) {
      setTokenStatus('invalid');
      return;
    }
    if (found.status === 'accepted') {
      setTokenStatus('used');
      return;
    }
    if (new Date(found.expiresAt) < new Date()) {
      setTokenStatus('expired');
      return;
    }
    setInvite(found);
    setTokenStatus('valid');
  }, [token]);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-danger', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-warning', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-accent', width: '75%' };
    return { label: 'Strong', color: 'bg-success', width: '100%' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = () => {
    const e = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    setTimeout(() => {
      const result = registerFromInvite(token, password);
      setLoading(false);
      if (result.success) {
        consumeInvite(token);
        setDone(true);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    }, 1000);
  };

  if (tokenStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const StatusScreen = ({ icon: Icon, iconClass, title, message, action }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">PolarAxis</span>
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${iconClass}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
        <p className="text-secondary mb-8 leading-relaxed">{message}</p>
        {action && (
          <Link to="/login"
            className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors">
            {action}
          </Link>
        )}
      </motion.div>
    </div>
  );

  if (tokenStatus === 'invalid') return (
    <StatusScreen
      icon={AlertTriangle}
      iconClass="bg-danger/10 text-danger"
      title="Invalid invitation"
      message="This invitation link is invalid or does not exist. Please contact your PolarAxis administrator for a new invitation."
      action="Go to Sign In"
    />
  );

  if (tokenStatus === 'expired') return (
    <StatusScreen
      icon={Clock}
      iconClass="bg-warning/10 text-warning"
      title="Invitation expired"
      message="This invitation link has expired. Invitation links are valid for 30 days. Please ask your PolarAxis administrator to send a new invitation."
      action="Go to Sign In"
    />
  );

  if (tokenStatus === 'used') return (
    <StatusScreen
      icon={CheckCircle}
      iconClass="bg-success/10 text-success"
      title="Already registered"
      message="This invitation has already been used to create an account. If this was you, sign in below. If not, contact your administrator."
      action="Sign In"
    />
  );

  if (done) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">PolarAxis</span>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-success" />
        </motion.div>
        <h2 className="text-2xl font-bold text-primary mb-3">
          Welcome to PolarAxis!
        </h2>
        <p className="text-secondary mb-2">
          Your account is ready, <span className="font-semibold text-primary">{invite.name}</span>.
        </p>
        <p className="text-sm text-muted mb-8">
          You've been added to{' '}
          <span className="text-accent font-medium">{invite.tenantName}</span>{' '}
          as <span className="font-medium text-primary capitalize">{invite.role.replace(/_/g, ' ')}</span>.
        </p>
        <div className="bg-surface border border-border rounded-xl p-4 mb-6 text-left space-y-3">
          <div className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
            Your Account
          </div>
          {[
            { label: 'Name', value: invite.name },
            { label: 'Email', value: invite.email },
            { label: 'Organization', value: invite.tenantName },
            { label: 'Role', value: invite.role.replace(/_/g, ' ') }
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-muted">{row.label}</span>
              <span className="text-primary font-medium capitalize">{row.value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors"
        >
          Sign In to Your Account →
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-6 right-6"><ThemeToggle /></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">PolarAxis</span>
          </div>

          <div className="bg-accent/8 border border-accent/25 rounded-xl p-4 mb-8">
            <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
              You've been invited
            </div>
            <p className="text-sm text-primary font-medium">{invite.name}</p>
            <p className="text-xs text-secondary mt-0.5">{invite.email}</p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-accent/15">
              <div>
                <span className="text-xs text-muted">Organization: </span>
                <span className="text-xs font-semibold text-primary">{invite.tenantName}</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div>
                <span className="text-xs text-muted">Role: </span>
                <span className="text-xs font-semibold text-primary capitalize">
                  {invite.role.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">Set your password</h1>
          <p className="text-secondary text-sm mb-7">
            Choose a strong password to secure your account.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(p => ({ ...p, password: '' }));
                  }}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 bg-surface border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 pr-11 transition-colors ${
                    errors.password ? 'border-danger' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && strength && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted">Strength</span>
                    <span className={`text-xs font-medium ${
                      strength.label === 'Strong' ? 'text-success' :
                      strength.label === 'Good' ? 'text-accent' :
                      strength.label === 'Fair' ? 'text-warning' : 'text-danger'
                    }`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${strength.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: '' }));
                  }}
                  placeholder="Repeat your password"
                  className={`w-full px-4 py-3 bg-surface border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 pr-11 transition-colors ${
                    errors.confirmPassword ? 'border-danger' : 'border-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                <p className="text-success text-xs mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up your account...
                </>
              ) : (
                'Activate Account →'
              )}
            </button>

            <p className="text-center text-xs text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-white max-w-sm space-y-10"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-snug">
              Welcome to the PolarAxis network.
            </h2>
            <p className="text-blue-200 leading-relaxed">
              You've been personally invited to join a
              pharmaceutical-grade cold chain platform
              trusted by leading biotech companies worldwide.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: '🔒', text: 'Your account is pre-configured with the correct role and data access' },
              { icon: '🌡️', text: 'Monitor shipments, temperature logs, and alerts in real time' },
              { icon: '📋', text: 'Access compliance documents and audit trails instantly' },
              { icon: '🚨', text: 'Receive instant alerts for excursions and delays' }
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <p className="text-sm text-blue-200 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-blue-200">
            <span className="text-white font-semibold">Invite-only platform. </span>
            Access is provisioned by your PolarAxis operations administrator.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
