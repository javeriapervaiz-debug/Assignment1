<script lang="ts">
  import { page } from '$app/stores';
  
  export let data: { user: any };
  
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'User Management' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/test-simple', label: 'Test Simple' }
  ];
</script>

{#if data.user && data.user.role === 'admin'}
  <div class="min-h-screen bg-gray-950 text-white flex">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <!-- Admin header -->
      <div class="p-6 border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">A</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Admin Panel</h1>
            <p class="text-sm text-gray-400">Management Console</p>
          </div>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          {#each adminNavItems as item}
            <li>
              <a 
                href={item.href}
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors {$page.url.pathname === item.href ? 'bg-gray-800 text-white' : ''}"
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
      
      <!-- Back to main app -->
      <div class="p-4 border-t border-gray-800">
        <a 
          href="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>
    </aside>
    
    <!-- Main content area -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
{:else}
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-white mb-2">Access Denied</h1>
      <p class="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
      <a 
        href="/dashboard"
        class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Return to Dashboard
      </a>
    </div>
  </div>
{/if}