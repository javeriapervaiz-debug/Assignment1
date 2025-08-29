<script lang="ts">
  export let data: { user: any };
</script>

<div class="p-8 bg-gray-950 min-h-screen text-white">
  <h1 class="text-3xl font-bold mb-4">Simple Admin Test</h1>
  <p class="text-gray-300 mb-4">If you can see this, the basic admin routing works.</p>
  
  <div class="bg-gray-900 p-4 rounded-lg">
    <h2 class="text-xl mb-2">User Info:</h2>
    <p>Email: {data.user.email}</p>
    <p>Role: {data.user.role}</p>
  </div>
  
  <div class="mt-4">
    <a href="/admin" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white">Back to Admin</a>
    <a href="/dashboard" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white ml-2">Dashboard</a>
  </div>
</div>
