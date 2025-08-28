<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  $: email = $page.url.searchParams.get('email');
  
  let verificationCode = '';
  let isVerifying = false;
  let errorMessage = '';
  let successMessage = '';
  
  async function verifyCode() {
    if (!verificationCode.trim()) {
      errorMessage = 'Please enter the verification code';
      return;
    }
    
    isVerifying = true;
    errorMessage = '';
    
    try {
      const response = await fetch('/auth/verify/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        successMessage = 'Email verified successfully! You can now sign in.';
        setTimeout(() => {
          goto('/auth/login?verified=1');
        }, 2000);
      } else {
        errorMessage = result.message || 'Verification failed';
      }
    } catch (error) {
      errorMessage = 'An error occurred. Please try again.';
    } finally {
      isVerifying = false;
    }
  }
  
  function goToLogin() {
    goto('/auth/login');
  }
  
  function goToRegister() {
    goto('/auth/register');
  }
</script>

<svelte:head>
  <title>Enter Verification Code - CelesteAI</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
  <div class="w-full max-w-md text-center">
    <div class="mb-8">
      <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      </div>
      
      <h1 class="text-2xl font-bold mb-2">Enter Verification Code</h1>
      
      {#if email}
        <p class="text-gray-300 mb-6">
          Enter the 6-digit verification code for <span class="text-purple-400">{email}</span>
        </p>
      {:else}
        <p class="text-gray-300 mb-6">
          Enter the 6-digit verification code from your registration
        </p>
      {/if}
      
      {#if successMessage}
        <div class="mb-4 rounded-lg bg-green-500/10 border border-green-500 text-green-200 px-3 py-2 text-sm">
          {successMessage}
        </div>
      {/if}
      
      {#if errorMessage}
        <div class="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-200 px-3 py-2 text-sm">
          {errorMessage}
        </div>
      {/if}
      
      <!-- Verification Code Input -->
      <div class="mb-6">
        <input
          type="text"
          bind:value={verificationCode}
          placeholder="Enter 6-digit code"
          maxlength="6"
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-center text-2xl font-mono tracking-widest"
          on:input={(e) => {
            // Only allow numbers
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^0-9]/g, '');
            verificationCode = target.value;
          }}
        />
      </div>
      
      <!-- Verify Button -->
      <button
        on:click={verifyCode}
        disabled={isVerifying || !verificationCode.trim()}
        class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>
      
      <!-- Navigation -->
      <div class="space-y-3">
        <button
          on:click={goToLogin}
          class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Back to Login
        </button>
        
        <button
          on:click={goToRegister}
          class="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Create New Account
        </button>
      </div>
    </div>
  </div>
</div>
