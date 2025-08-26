<script lang="ts">
  import { goto } from '$app/navigation';
  
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let showPassword = false;
  let agreeToTerms = false;
  
  const leftImageUrl = '/images/pic1.jpg';
  
  function goToLogin() {
    goto('/auth/login');
  }
  
  function goToWebsite() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Create Account - AMU</title>
</svelte:head>

<div class="min-h-screen flex">
  <!-- Left Panel - Promotional/Visual -->
  <div class="w-1/3 relative overflow-hidden">
    <!-- Background image -->
    <div class="absolute inset-0 bg-cover bg-center" style={`background-image: url('${leftImageUrl}')`}></div>
    
    <!-- Color overlay for readability -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-gray-900/60"></div>
    
    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between p-8">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <!-- Logo -->
        <div class="text-white text-3xl font-bold tracking-wider">AMU</div>
        
        <!-- Back to Website Button -->
        <button 
          on:click={goToWebsite}
          class="px-4 py-2 bg-gray-100/20 hover:bg-gray-100/30 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          Back to website
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <!-- Bottom Content -->
      <div class="text-center text-white">
        <h2 class="text-2xl font-light mb-4">Capturing Moments, Creating Memories</h2>
        
        <!-- Progress Indicator -->
        <div class="flex justify-center gap-2">
          <div class="w-2 h-2 bg-white/40 rounded-full"></div>
          <div class="w-2 h-2 bg-white/40 rounded-full"></div>
          <div class="w-3 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Right Panel - Registration Form -->
  <div class="w-2/3 bg-gray-900 flex items-center justify-center p-12">
    <div class="w-full max-w-md">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-white mb-2">Create an account</h1>
      
      <!-- Login Link -->
      <p class="text-gray-300 mb-8">
        Already have an account? 
        <button 
          on:click={goToLogin}
          class="text-purple-400 underline hover:text-purple-300 transition-colors"
        >
          Log in
        </button>
      </p>
      
      <!-- Registration Form -->
      <form method="post" class="space-y-6">
        <!-- Name Fields -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input
              name="firstName"
              type="text"
              bind:value={firstName}
              placeholder="First name"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
          <div>
            <input
              name="lastName"
              type="text"
              bind:value={lastName}
              placeholder="Last name"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
        </div>
        
        <!-- Email Field -->
        <div>
          <input
            name="email"
            type="email"
            bind:value={email}
            placeholder="Email"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>
        
        <!-- Password Field -->
        <div class="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            placeholder="Enter your password"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors pr-12"
          />
          <button
            type="button"
            on:click={() => showPassword = !showPassword}
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {#if showPassword}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            {:else}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            {/if}
          </button>
        </div>
        
        <!-- Terms and Conditions -->
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            bind:checked={agreeToTerms}
            id="terms"
            class="mt-1 w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label for="terms" class="text-sm text-gray-300">
            I agree to the 
            <button type="button" class="text-purple-400 underline hover:text-purple-300">Terms & Conditions</button>
          </label>
        </div>
        
        <!-- Create Account Button -->
        <button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Create account
        </button>
      </form>
      
      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-900 text-gray-400">Or register with</span>
        </div>
      </div>
      
      <!-- Social Login Buttons -->
      <div class="grid grid-cols-2 gap-4">
        <button class="flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        
        <button class="flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </button>
      </div>
    </div>
  </div>
</div>
