import { createContext, useContext, useState } from 'react';
import { employees } from '../data/mock.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (employeeId, password) => {
    const found = employees.find((e) => e.employee_id === employeeId.trim().toUpperCase());
    if (!found) return { ok: false, error: 'Employee ID not recognised.' };
    if (!password) return { ok: false, error: 'Password is required.' };
    setUser(found);
    return { ok: true, user: found };
  };

  const logout = () => setUser(null);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
