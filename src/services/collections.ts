/** Nomes das coleções — equivalem às tabelas de um futuro banco PostgreSQL. */
export const COLLECTIONS = {
  transactions: 'transactions',
  accounts: 'accounts',
  cards: 'cards',
  subscriptions: 'subscriptions',
  goals: 'goals',
  tasks: 'tasks',
  routine: 'routine_events',
  habits: 'habits',
  habitLogs: 'habit_logs',
  documents: 'documents',
  digital: 'digital_items',
  checklists: 'checklists',
  challenge: 'challenge',
  notifications: 'notifications',
  gamification: 'gamification',
} as const
