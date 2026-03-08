export let invites = [
  {
    token: 'INVITE-NOVA-001',
    email: 'newuser@novabio.com',
    name: 'Alex Thompson',
    role: 'client_user',
    tenantId: 'tenant-1',
    tenantName: 'NovaBio Pharma',
    invitedBy: 'ops@polaraxis.com',
    createdAt: '2026-03-01T10:00:00Z',
    expiresAt: '2026-04-01T10:00:00Z',
    status: 'pending'
  },
  {
    token: 'INVITE-CRYO-001',
    email: 'analyst@cryomed.com',
    name: 'Nina Patel',
    role: 'client_admin',
    tenantId: 'tenant-2',
    tenantName: 'CryoMed Solutions',
    invitedBy: 'ops@polaraxis.com',
    createdAt: '2026-03-05T14:00:00Z',
    expiresAt: '2026-04-05T14:00:00Z',
    status: 'pending'
  },
  {
    token: 'INVITE-DEMO-999',
    email: 'demo@testpharma.com',
    name: 'Demo User',
    role: 'client_user',
    tenantId: 'tenant-1',
    tenantName: 'NovaBio Pharma',
    invitedBy: 'ops@polaraxis.com',
    createdAt: '2026-03-01T00:00:00Z',
    expiresAt: '2027-01-01T00:00:00Z',
    status: 'pending'
  }
];

export const addInvite = (invite) => {
  invites.push(invite);
};

export const consumeInvite = (token) => {
  const idx = invites.findIndex(i => i.token === token);
  if (idx !== -1) {
    invites[idx] = { ...invites[idx], status: 'accepted' };
    return invites[idx];
  }
  return null;
};

export { invites }