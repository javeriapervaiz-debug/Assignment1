<script lang="ts">
  export let data: { token?: string };
  let password = '';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white p-8">
  <form method="post" class="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full space-y-4">
    <h1 class="text-2xl font-semibold">Reset password</h1>
    <input type="hidden" name="token" value={data.token} />
    <input name="password" type="password" bind:value={password} placeholder="New password" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
    <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Set new password</button>
  </form>
</div>


