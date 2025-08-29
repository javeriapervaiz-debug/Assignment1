import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Simple stats without complex database queries for now
  return {
    stats: {
      total: 5,
      active: 4,
      pending: 1,
      disabled: 0,
      admins: 1,
      verified: 3
    }
  };
};