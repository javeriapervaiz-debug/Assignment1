<script lang="ts">
  export let data: { stats: any };
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-2">Total Users</h3>
      <p class="text-3xl font-bold text-blue-400">{data.stats.total}</p>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-2">Active Users</h3>
      <p class="text-3xl font-bold text-green-400">{data.stats.active}</p>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-2">Admins</h3>
      <p class="text-3xl font-bold text-purple-400">{data.stats.admins}</p>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-2">Verified</h3>
      <p class="text-3xl font-bold text-orange-400">{data.stats.verified}</p>
    </div>
  </div>
  
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <h2 class="text-xl font-semibold text-white mb-4">Quick Actions</h2>
    <div class="flex gap-4">
      <a 
        href="/admin/users" 
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        Manage Users
      </a>
      <a 
        href="/admin/analytics" 
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        View Analytics
      </a>
      <button 
        on:click={() => window.location.reload()}
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
      >
        Refresh Data
      </button>
    </div>
  </div>
</div>