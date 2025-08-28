<script lang="ts">
  export let form: any;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white p-8">
  <form method="post" class="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full space-y-4">
    <h1 class="text-2xl font-semibold">Forgot password</h1>
    {#if form?.message}
      <div class="text-sm text-purple-200 bg-purple-500/10 border border-purple-500 rounded px-3 py-2">{form.message}</div>
    {/if}
    <input name="email" type="email" placeholder="Your email" class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
    <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Send reset link</button>
  </form>
</div>


