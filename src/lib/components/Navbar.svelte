<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '$lib/actions/clickOutside';
  
  export let user: any;
  
  const dispatch = createEventDispatcher();
  
  let showProfileMenu = false;
  
  function toggleSidebar() {
    dispatch('toggle-sidebar');
  }
  
  function toggleProfileMenu() {
    showProfileMenu = !showProfileMenu;
  }
  
  function closeProfileMenu() {
    showProfileMenu = false;
  }
  
  // Get user initials for avatar fallback
  function getUserInitials(user: any): string {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  }
</script>

<nav class="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
  <!-- Left side - Menu toggle and Logo -->
  <div class="flex items-center gap-4">
    <button 
      on:click={toggleSidebar}
      class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
      aria-label="Toggle sidebar"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
    
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-white hidden sm:block">AI Assistant</h1>
    </div>
  </div>
  
  <!-- Right side - Profile dropdown -->
  <div class="relative">
    <button 
      on:click={toggleProfileMenu}
      class="flex items-center gap-3 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      <!-- Avatar -->
      <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-700 border border-gray-600">
        {#if user?.profileImageUrl}
          <img src={user.profileImageUrl} alt="Profile" class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-white text-sm font-medium">
            {getUserInitials(user)}
          </div>
        {/if}
      </div>
      
      <!-- User name and chevron -->
      <div class="hidden sm:flex items-center gap-2">
        <span class="text-sm font-medium">
          {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User'}
        </span>
        <svg 
          class="w-4 h-4 transition-transform duration-200 {showProfileMenu ? 'rotate-180' : ''}" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </button>
    
    <!-- Profile dropdown menu -->
    {#if showProfileMenu}
      <div 
        class="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
        use:clickOutside={closeProfileMenu}
      >
        <!-- User info header -->
        <div class="px-4 py-3 border-b border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border border-gray-600">
              {#if user?.profileImageUrl}
                <img src={user.profileImageUrl} alt="Profile" class="w-full h-full object-cover" />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-white font-medium">
                  {getUserInitials(user)}
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
              </p>
              <p class="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <!-- Menu items -->
        <div class="py-2">
          <a 
            href="/profile" 
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            on:click={closeProfileMenu}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Profile Settings
          </a>
          
          {#if user && user.role === 'admin'}
            <a 
              href="/admin" 
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              on:click={closeProfileMenu}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Admin Panel
            </a>
          {/if}
          
          <a 
            href="/settings" 
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            on:click={closeProfileMenu}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Settings
          </a>
          
          <div class="border-t border-gray-700 my-2"></div>
          
          <form method="post" action="/logout" class="m-0">
            <button 
              type="submit"
              class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-left"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</nav>
