export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  SUPERVISOR: 'supervisor',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];