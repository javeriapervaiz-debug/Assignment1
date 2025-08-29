import type { Actions, PageServerLoad } from './$types';
import { getAllUsers, updateUserRole, updateUserStatus } from '$lib/auth';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const users = await getAllUsers();
  
  return {
    users
  };
};

export const actions: Actions = {
  toggleRole: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
      throw error(403, 'Admin access required');
    }
    
    const data = await request.formData();
    const userId = parseInt(data.get('userId') as string);
    const currentRole = data.get('currentRole') as string;
    
    // Prevent self-demotion
    if (userId === locals.user.id && currentRole === 'admin') {
      throw error(400, 'Cannot demote yourself from admin');
    }
    
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(userId, newRole);
    
    return { success: true, message: `User role updated to ${newRole}` };
  },
  
  toggleStatus: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
      throw error(403, 'Admin access required');
    }
    
    const data = await request.formData();
    const userId = parseInt(data.get('userId') as string);
    const currentStatus = data.get('currentStatus') as string;
    
    // Prevent self-disabling
    if (userId === locals.user.id) {
      throw error(400, 'Cannot disable your own account');
    }
    
    const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
    await updateUserStatus(userId, newStatus);
    
    return { success: true, message: `User ${newStatus === 'disabled' ? 'disabled' : 'enabled'}` };
  },
  
  bulkDisable: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
      throw error(403, 'Admin access required');
    }
    
    const data = await request.formData();
    const userIds = data.getAll('userIds').map(id => parseInt(id as string));
    
    // Prevent self-disabling
    if (userIds.includes(locals.user.id)) {
      throw error(400, 'Cannot disable your own account');
    }
    
    // Disable all selected users
    for (const userId of userIds) {
      await updateUserStatus(userId, 'disabled');
    }
    
    return { success: true, message: `${userIds.length} user(s) disabled` };
  }
};
