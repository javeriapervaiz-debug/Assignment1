<script lang="ts">
  export let data: { stats: any, recentActivity: any[] };
  
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
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'disabled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  }
  
  // Calculate percentages
  $: activePercentage = data.stats.total > 0 ? Math.round((data.stats.active / data.stats.total) * 100) : 0;
  $: verifiedPercentage = data.stats.total > 0 ? Math.round((data.stats.verified / data.stats.total) * 100) : 0;
</script>

<div class="p-8">
  <!-- Page header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p class="text-gray-400">Detailed insights into user behavior and system metrics</p>
      </div>
      <div class="flex gap-3">
        <a 
          href="/admin" 
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </a>
        <button 
          on:click={() => window.location.reload()}
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  </div>
  
  <!-- Key Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">Total Users</p>
          <p class="text-3xl font-bold text-white">{data.stats.total}</p>
          <p class="text-xs text-gray-500 mt-1">All registered accounts</p>
        </div>
        <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">Active Users</p>
          <p class="text-3xl font-bold text-green-400">{data.stats.active}</p>
          <p class="text-xs text-gray-500 mt-1">{activePercentage}% of total users</p>
        </div>
        <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">New This Month</p>
          <p class="text-3xl font-bold text-purple-400">{data.stats.recentRegistrations}</p>
          <p class="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>
        <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">Email Verified</p>
          <p class="text-3xl font-bold text-orange-400">{data.stats.verified}</p>
          <p class="text-xs text-gray-500 mt-1">{verifiedPercentage}% verification rate</p>
        </div>
        <div class="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Secondary Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-4">User Status Breakdown</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Active</span>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-white font-medium">{data.stats.active}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Pending</span>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span class="text-white font-medium">{data.stats.pending}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Disabled</span>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-white font-medium">{data.stats.disabled}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Role Distribution</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Users</span>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-white font-medium">{data.stats.total - data.stats.admins}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Administrators</span>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span class="text-white font-medium">{data.stats.admins}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Activity Summary</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-300">Recent Logins</span>
          <span class="text-white font-medium">{data.stats.recentLogins}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-300">This Week</span>
          <span class="text-gray-400 text-sm">Last 7 days</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- System Health -->
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <h3 class="text-xl font-semibold text-white mb-6">System Health & Features</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="flex items-center p-4 bg-gray-800 rounded-lg">
        <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-white font-medium">Email System</p>
          <p class="text-green-400 text-sm">SMTP Active</p>
        </div>
      </div>
      
      <div class="flex items-center p-4 bg-gray-800 rounded-lg">
        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-white font-medium">OAuth</p>
          <p class="text-blue-400 text-sm">Google & GitHub</p>
        </div>
      </div>
      
      <div class="flex items-center p-4 bg-gray-800 rounded-lg">
        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-white font-medium">Database</p>
          <p class="text-purple-400 text-sm">PostgreSQL</p>
        </div>
      </div>
      
      <div class="flex items-center p-4 bg-gray-800 rounded-lg">
        <div class="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-white font-medium">Package Manager</p>
          <p class="text-orange-400 text-sm">pnpm</p>
        </div>
      </div>
    </div>
  </div>
</div>
