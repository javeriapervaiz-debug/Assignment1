<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  export let form: any;
  
  let email = '';
  let isSubmitting = false;
  
  onMount(() => {
    // Simple initialization - don't interfere with user input
    console.log('Component mounted, form data:', form);
    isSubmitting = false;
  });
  
  function handleSubmit() {
    console.log('Form submit started, email:', email);
    isSubmitting = true;
  }
  
  // Only handle successful redirects
  $: if (browser && form?.success && form?.email) {
    console.log('Form success, redirecting with email:', form.email);
    setTimeout(() => {
      goto(`/auth/reset?email=${encodeURIComponent(form.email)}`);
    }, 2000);
  }
  
  // Reset submission state on form update
  $: if (form && isSubmitting) {
    console.log('Form response received:', form);
    isSubmitting = false;
  }
</script>

<svelte:head>
  <title>Forgot Password - Reset Your Account</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7 6h-7a6 6 0 017-6 6 6 0 000 12H9a6 6 0 01-6-6v-1H2l3-3 3 3H7v1z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
      <p class="text-gray-400">No worries! Enter your email and we'll send you a reset code.</p>
    </div>

    <!-- Success Message -->
    {#if form?.success}
      <div class="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-green-400 font-medium">Email Sent!</p>
            <p class="text-green-300 text-sm">{form.message}</p>
            <p class="text-green-200 text-xs mt-1">Redirecting to verification page...</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Form -->
      <form method="post" on:submit={handleSubmit} class="space-y-6">
        <!-- Error Message -->
        {#if form?.error}
          <div class="p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-400">{form.error}</p>
            </div>
          </div>
        {/if}

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            bind:value={email}
            required
            disabled={isSubmitting}
            placeholder="Enter your email address"
            autocomplete="email"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            on:input={() => console.log('Email input changed:', email)}
          />
          <p class="text-xs text-gray-500 mt-1">Current email value: "{email}"</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting || !email?.trim()}
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {#if isSubmitting}
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Sending Reset Code...
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Send Reset Code
          {/if}
        </button>
      </form>
    {/if}

    <!-- Footer Links -->
    <div class="mt-8 pt-6 border-t border-gray-800 text-center space-y-3">
      <div class="text-sm text-gray-400">
        Remember your password?
        <a href="/auth/login" class="text-purple-400 hover:text-purple-300 font-medium">
          Sign in
        </a>
      </div>
      
      <div class="text-sm text-gray-400">
        Don't have an account?
        <a href="/auth/register" class="text-purple-400 hover:text-purple-300 font-medium">
          Sign up
        </a>
      </div>
    </div>
  </div>
</div>