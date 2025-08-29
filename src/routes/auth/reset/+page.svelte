<script lang="ts">
  import { onMount } from 'svelte';
  
  export let data: { email: string | null };
  export let form: any;
  
  let email = '';
  let code = '';
  let password = '';
  let confirmPassword = '';
  let isSubmitting = false;
  let step = 1; // 1: enter code, 2: enter new password
  
  onMount(() => {
    // Set email from URL parameter
    if (data.email) {
      email = data.email;
    }
    
    // Check if we're already verified
    if (form?.verified) {
      step = 2;
      if (form.email) email = form.email;
      if (form.code) code = form.code;
    }
  });
  
  // Restore form values on error
  $: if (form && !form.verified) {
    console.log('Reactive update - form:', form);
    if (form.email !== undefined) {
      console.log('Restoring email:', form.email);
      email = form.email;
    }
    if (form.code !== undefined) {
      console.log('Restoring code:', form.code);
      code = form.code;
    }
    isSubmitting = false;
  }
  
  function handleVerifySubmit() {
    console.log('Form submit - email:', email);
    console.log('Form submit - code:', code);
    isSubmitting = true;
  }
  
  function handleResetSubmit() {
    isSubmitting = true;
  }
  
  // Show/hide password functionality
  let showPassword = false;
  let showConfirmPassword = false;
  
  // Handle code input - only allow numbers
  function handleCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit characters and limit to 6 digits
    const value = input.value.replace(/\D/g, '').slice(0, 6);
    // Update the bound variable (this will update the input via binding)
    code = value;
  }
</script>

<svelte:head>
  <title>Reset Password - Verify & Create New Password</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">
        {step === 1 ? 'Enter Verification Code' : 'Create New Password'}
      </h1>
      <p class="text-gray-400">
        {step === 1 
          ? 'Enter the 6-digit code sent to your email' 
          : 'Choose a strong password for your account'}
      </p>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center justify-center mb-8">
      <div class="flex items-center gap-2">
        <!-- Step 1 -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center {step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}">
            {#if step > 1}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            {:else}
              1
            {/if}
          </div>
          <span class="text-sm {step >= 1 ? 'text-white' : 'text-gray-400'}">Verify Code</span>
        </div>
        
        <!-- Connector -->
        <div class="w-8 h-0.5 {step > 1 ? 'bg-purple-600' : 'bg-gray-700'}"></div>
        
        <!-- Step 2 -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center {step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}">
            2
          </div>
          <span class="text-sm {step >= 2 ? 'text-white' : 'text-gray-400'}">New Password</span>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    {#if form?.error}
      <div class="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-400">{form.error}</p>
        </div>
      </div>
    {/if}

    {#if step === 1}
      <!-- Step 1: Verification Code -->
      <form method="post" action="?/verify" on:submit={handleVerifySubmit} class="space-y-6">
        <!-- Email Display -->
        <div>
          <label for="email-display" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input
            id="email-display"
            name="email"
            type="email"
            bind:value={email}
            readonly
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          />
        </div>

        <!-- Verification Code Input -->
        <div>
          <label for="code" class="block text-sm font-medium text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            bind:value={code}
            maxlength="6"
            required
            disabled={isSubmitting}
            placeholder="Enter 6-digit code"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-center text-lg font-mono tracking-widest"
          />
          <!-- Hidden input to ensure code value is submitted -->
          <input type="hidden" name="verification_code" value={code} />
          <p class="text-xs text-gray-500 mt-2">Check your email for the 6-digit verification code</p>
        </div>

        <!-- Verify Button -->
        <button
          type="submit"
          disabled={isSubmitting || code.length !== 6}
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {#if isSubmitting}
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Verifying...
          {:else}
            Verify Code
          {/if}
        </button>
      </form>
    {:else}
      <!-- Step 2: New Password -->
      <form method="post" action="?/reset" on:submit={handleResetSubmit} class="space-y-6">
        <!-- Hidden fields -->
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="code" value={code} />
        <!-- Backup password fields -->
        <input type="hidden" name="backup_password" value={password} />
        <input type="hidden" name="backup_confirmPassword" value={confirmPassword} />

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              required
              disabled={isSubmitting}
              placeholder="Enter your new password"
              class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="button"
              on:click={() => showPassword = !showPassword}
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {#if showPassword}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                {:else}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                {/if}
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              bind:value={confirmPassword}
              required
              disabled={isSubmitting}
              placeholder="Confirm your new password"
              class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="button"
              on:click={() => showConfirmPassword = !showConfirmPassword}
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {#if showConfirmPassword}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                {:else}
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                {/if}
              </svg>
            </button>
          </div>
        </div>

        <!-- Password Match Indicator -->
        {#if password && confirmPassword}
          <div class="text-sm {password === confirmPassword ? 'text-green-400' : 'text-red-400'}">
            {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
          </div>
        {/if}



        <!-- Reset Button -->
        <button
          type="submit"
          disabled={isSubmitting || !password || !confirmPassword || password !== confirmPassword || password.length < 8}
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {#if isSubmitting}
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Resetting Password...
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Reset Password
          {/if}
        </button>
      </form>
    {/if}

    <!-- Footer Links -->
    <div class="mt-8 pt-6 border-t border-gray-800 text-center">
      <div class="text-sm text-gray-400">
        Remember your password?
        <a href="/auth/login" class="text-purple-400 hover:text-purple-300 font-medium">
          Sign in
        </a>
      </div>
    </div>
  </div>
</div>