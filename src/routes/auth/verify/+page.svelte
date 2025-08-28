<script lang="ts">
  import { goto } from '$app/navigation';
  
  export let data: { code: string | null; email: string | null; sent: string | null };
  
  $: code = data.code;
  $: email = data.email;
  $: sent = data.sent;
  
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
  
  function goToHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Email Verification - CelesteAI</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
  <div class="w-full max-w-md text-center">
    {#if sent === '1' && email}
      <div class="mb-8">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Check Your Email!</h1>
        <p class="text-gray-300 mb-6">
          We've sent a verification code to <strong>{email}</strong>
        </p>
        
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <p class="text-sm text-gray-400 mb-2">What to do next:</p>
          <ol class="text-left text-gray-300 text-sm space-y-2">
            <li>1. Check your email inbox (and spam folder)</li>
            <li>2. Look for an email from CelesteAI</li>
            <li>3. Copy the 6-digit verification code</li>
            <li>4. Enter it below and click "Verify Code"</li>
          </ol>
        </div>
        
        <!-- Verification Code Input -->
        <div class="mb-6">
          <p class="text-sm text-gray-300 mb-3">Enter the verification code from your email:</p>
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
        
        <!-- Verify Button -->
        <button
          on:click={verifyCode}
          disabled={isVerifying || !verificationCode.trim()}
          class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
        >
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>
        
        <button
          on:click={goToLogin}
          class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Go to Login
        </button>
      </div>
    {:else if code && email}
      <!-- Fallback: Show code on screen if email failed -->
      <div class="mb-8">
        <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Email Sending Failed</h1>
        <p class="text-gray-300 mb-6">
          We couldn't send the verification email, but here's your verification code:
        </p>
        
        <!-- Verification Code Display -->
        <div class="bg-gray-800 border border-yellow-500 rounded-lg p-6 mb-6">
          <p class="text-sm text-gray-400 mb-2">Verification Code:</p>
          <div class="text-3xl font-mono font-bold text-yellow-400 tracking-wider bg-gray-900 px-4 py-3 rounded border-2 border-yellow-500">
            {code}
          </div>
          <p class="text-xs text-gray-500 mt-2">This code expires in 24 hours</p>
        </div>
        
        <!-- Verification Code Input -->
        <div class="mb-6">
          <p class="text-sm text-gray-300 mb-3">Enter the verification code above:</p>
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
        
        <!-- Verify Button -->
        <button
          on:click={verifyCode}
          disabled={isVerifying || !verificationCode.trim()}
          class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
        >
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>
        
        <button
          on:click={goToLogin}
          class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Go to Login
        </button>
      </div>
    {:else}
      <div class="mb-8">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Invalid Verification</h1>
        <p class="text-gray-300 mb-6">
          The verification link is invalid or has expired. Please try registering again.
        </p>
        <button
          on:click={goToHome}
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    {/if}
  </div>
</div>


