import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/users';
import { invites } from '../data/invites';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('polaraxis-user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('polaraxis-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('polaraxis-user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = users.find(u =>
      u.email === email &&
      u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;

  const switchUser = (user) => {
    const { password, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
  };

  const registerFromInvite = (token, password) => {
    const invite = invites.find(i => i.token === token);
    if (!invite) return { success: false, message: 'Invalid token' };
    if (invite.status === 'accepted')
      return { success: false, message: 'Invite already used' };
    if (new Date(invite.expiresAt) < new Date())
      return { success: false, message: 'Invite expired' };

    const existing = users.find(u => u.email === invite.email);
    if (existing) return { success: false, message: 'Email already registered' };

    const initials = invite.name
      .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const newUser = {
      id: 'user-' + Date.now(),
      name: invite.name,
      email: invite.email,
      password: password,
      role: invite.role,
      tenantId: invite.tenantId,
      tenantName: invite.tenantName,
      avatar: initials
    };

    users.push(newUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      switchUser,
      isAuthenticated,
      registerFromInvite
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
