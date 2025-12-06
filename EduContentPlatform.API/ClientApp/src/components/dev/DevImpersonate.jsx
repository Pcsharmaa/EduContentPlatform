import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DEV_USERS = [
  { email: 'Prafullsharma0524@outlook.com', displayName: 'Prafull chandra sharma', role: 'admin' },
  { email: 'Student@test.com', displayName: 'Student', role: 'student' },
  { email: 'Teacher@test.com', displayName: 'Teacher', role: 'teacher' },
  { email: 'Publisher@test.com', displayName: 'Publisher', role: 'scholar' },
  { email: 'Editor@test.com', displayName: 'Editor', role: 'editor' },
  { email: 'Reviewer@test.com', displayName: 'Reviewer', role: 'reviewer' },
];

const DevImpersonate = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState(DEV_USERS[0].email);

  const handleImpersonate = () => {
    const selectedUser = DEV_USERS.find(u => u.email === selected);
    if (!selectedUser) return;

    const token = `dev-token-${selectedUser.role}-${Date.now()}`;
    const userObj = {
      email: selectedUser.email,
      firstName: selectedUser.displayName.split(' ')[0] || selectedUser.displayName,
      name: selectedUser.displayName,
      role: selectedUser.role,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    // small delay to ensure storage is written then reload
    setTimeout(() => window.location.reload(), 200);
  };

  // Only render in non-production environments AND for admin users
  if ((import.meta.env && import.meta.env.PROD) || !user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        style={{ padding: '6px 8px', borderRadius: 6 }}
        aria-label="Dev impersonation select"
      >
        {DEV_USERS.map(u => (
          <option key={u.email} value={u.email}>{u.displayName} ({u.role})</option>
        ))}
      </select>
      <button
        onClick={handleImpersonate}
        style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
        title="Impersonate selected dev user"
      >
        Impersonate
      </button>
    </div>
  );
};

export default DevImpersonate;
