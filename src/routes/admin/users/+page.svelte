<script lang="ts">
  import { enhance } from '$app/forms';
  
  export let data: { users: any[] };
  
  let selectedUsers: number[] = [];
  let searchTerm = '';
  let statusFilter = 'all';
  let roleFilter = 'all';
  
  // Filter users based on search and filters
  $: filteredUsers = data.users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  function formatDate(date: string | Date | null) {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'disabled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  }
  
  function getRoleColor(role: string) {
    switch (role) {
      case 'admin': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'user': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  }
  
  function toggleUserSelection(userId: number) {
    if (selectedUsers.includes(userId)) {
      selectedUsers = selectedUsers.filter(id => id !== userId);
    } else {
      selectedUsers = [...selectedUsers, userId];
    }
  }
  
  function selectAllUsers() {
    selectedUsers = filteredUsers.map(u => u.id);
  }
  
  function clearSelection() {
    selectedUsers = [];
  }
</script>

<div class="p-8">
  <!-- Page header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-white mb-2">User Management</h1>
    <p class="text-gray-400">Manage all registered users and their permissions</p>
  </div>
  
  <!-- Filters and search -->
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <label for="search" class="block text-sm font-medium text-gray-300 mb-2">Search Users</label>
        <input 
          id="search"
          type="text" 
          bind:value={searchTerm}
          placeholder="Search by name or email..."
          class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <!-- Status filter -->
      <div>
        <label for="status-filter" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <select 
          id="status-filter"
          bind:value={statusFilter}
          class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
      
      <!-- Role filter -->
      <div>
        <label for="role-filter" class="block text-sm font-medium text-gray-300 mb-2">Role</label>
        <select 
          id="role-filter"
          bind:value={roleFilter}
          class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>
    </div>
    
    <!-- Bulk actions -->
    {#if selectedUsers.length > 0}
      <div class="mt-4 pt-4 border-t border-gray-800">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-400">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
          </p>
          <div class="flex gap-2">
            <button 
              type="button"
              on:click={clearSelection}
              class="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear Selection
            </button>
            <form method="post" action="?/bulkDisable" use:enhance class="inline">
              {#each selectedUsers as userId}
                <input type="hidden" name="userIds" value={userId} />
              {/each}
              <button 
                type="submit"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Disable Selected
              </button>
            </form>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Users table -->
  <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-white">All Users</h2>
          <p class="text-sm text-gray-400">Showing {filteredUsers.length} of {data.users.length} users</p>
        </div>
        <div class="flex gap-2">
          <button 
            type="button"
            on:click={selectAllUsers}
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Select All
          </button>
        </div>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-800/50">
          <tr class="text-left">
            <th class="px-6 py-4 text-sm font-medium text-gray-300">
              <input 
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                on:change={() => selectedUsers.length === filteredUsers.length ? clearSelection() : selectAllUsers()}
                class="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
              />
            </th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">User</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Email</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Role</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Status</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Verification</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Joined</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Last Login</th>
            <th class="px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          {#each filteredUsers as user}
            <tr class="hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4">
                <input 
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  on:change={() => toggleUserSelection(user.id)}
                  class="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border border-gray-600">
                    {#if user.profileImageUrl}
                      <img src={user.profileImageUrl} alt="Profile" class="w-full h-full object-cover" />
                    {:else}
                      <div class="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        {user.firstName?.[0] || user.email[0]?.toUpperCase()}
                      </div>
                    {/if}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'No name'}
                    </p>
                    <p class="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-300">{user.email}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getRoleColor(user.role)}">
                  {user.role}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusColor(user.status)}">
                  {user.status}
                </span>
              </td>
              <td class="px-6 py-4">
                {#if user.emailVerifiedAt}
                  <span class="text-green-400 text-sm">✓ Verified</span>
                {:else}
                  <span class="text-yellow-400 text-sm">⚠ Unverified</span>
                {/if}
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-400">{formatDate(user.createdAt)}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-400">{formatDate(user.lastLoginAt)}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <!-- Role toggle form -->
                  <form method="post" action="?/toggleRole" use:enhance class="inline">
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="currentRole" value={user.role} />
                    <button 
                      type="submit"
                      class="px-3 py-1 text-xs font-medium rounded-lg transition-colors
                        {user.role === 'admin' 
                          ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' 
                          : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'}"
                    >
                      Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </form>
                  
                  <!-- Status toggle form -->
                  <form method="post" action="?/toggleStatus" use:enhance class="inline">
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="currentStatus" value={user.status} />
                    <button 
                      type="submit"
                      class="px-3 py-1 text-xs font-medium rounded-lg transition-colors
                        {user.status === 'disabled' 
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                          : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'}"
                    >
                      {user.status === 'disabled' ? 'Enable' : 'Disable'}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
