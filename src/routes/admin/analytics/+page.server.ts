import type { PageServerLoad } from './$types';
import { getUserStats } from '$lib/auth';

export const load: PageServerLoad = async () => {
  const stats = await getUserStats();
  
  // Mock recent activity data for demonstration
  const recentActivity = [
    { type: 'registration', user: 'user@example.com', timestamp: new Date() },
    { type: 'login', user: 'admin@example.com', timestamp: new Date(Date.now() - 3600000) },
    { type: 'verification', user: 'new@example.com', timestamp: new Date(Date.now() - 7200000) }
  ];
  
  return {
    stats,
    recentActivity
  };
};
