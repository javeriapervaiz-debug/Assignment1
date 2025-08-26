<script lang="ts">
  export let data: { user: any };
</script>

<div class="min-h-screen bg-gray-950 text-white p-12">
  <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <p class="mb-2">Signed in as:</p>
    <p class="text-xl font-semibold">{data.user?.firstName} {data.user?.lastName}</p>
    <p class="text-gray-400">{data.user?.email}</p>
  </div>

  <form method="post" action="/logout" class="mt-8">
    <button class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">Sign out</button>
  </form>
</div>
