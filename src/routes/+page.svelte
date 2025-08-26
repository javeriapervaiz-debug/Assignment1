<script lang="ts">
  import { goto } from '$app/navigation';
  
  function goToLogin() {
    goto('/auth/login');
  }
  
  function goToRegister() {
    goto('/auth/register');
  }
</script>

<svelte:head>
  <title>AMU - Capturing Moments, Creating Memories</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 flex flex-col items-center justify-center p-8">
  <div class="text-center text-white mb-12">
    <h1 class="text-6xl font-bold tracking-wider mb-4">AMU</h1>
    <p class="text-2xl font-light">Capturing Moments, Creating Memories</p>
  </div>
  
  <div class="flex gap-6">
    <button
      on:click={goToLogin}
      class="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
    >
      Sign In
    </button>
    
    <button
      on:click={goToRegister}
      class="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200 text-lg"
    >
      Create Account
    </button>
  </div>
  
  <div class="mt-16 text-center text-gray-300">
    <p class="text-lg">Welcome to AMU - Your journey starts here</p>
  </div>
</div>
