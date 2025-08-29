<script lang="ts">
  export let data: { user: any, stats: any };
</script>

<div class="min-h-screen bg-gray-950 text-white p-8">
  <h1 class="text-3xl font-bold mb-6">Admin Dashboard (Simple)</h1>
  
  <div class="bg-gray-900 rounded-lg p-6 mb-6">
    <h2 class="text-xl mb-4">Welcome, {data.user.email}!</h2>
    <p>Role: <span class="text-purple-400 font-semibold">{data.user.role}</span></p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-gray-900 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-2">Total Users</h3>
      <p class="text-3xl font-bold text-blue-400">{data.stats.total}</p>
    </div>
    
    <div class="bg-gray-900 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-2">Active Users</h3>
      <p class="text-3xl font-bold text-green-400">{data.stats.active}</p>
    </div>
    
    <div class="bg-gray-900 rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-2">Admin Users</h3>
      <p class="text-3xl font-bold text-purple-400">{data.stats.admins}</p>
    </div>
  </div>
  
  <div class="mt-8">
    <a href="/dashboard" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
      Back to Dashboard
    </a>
  </div>
</div>
