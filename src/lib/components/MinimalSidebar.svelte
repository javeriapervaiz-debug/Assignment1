<script>
  export let isOpen = false;
  export let onClose = () => {};
  export let onNewChat = () => {};
</script>

<!-- Mobile backdrop -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    on:click={onClose}
    on:keydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
    aria-label="Close sidebar"
  ></div>
{/if}

<!-- Sidebar -->
<div class="
  fixed lg:static inset-y-0 left-0 z-40
  w-80 bg-gray-900 border-r border-gray-800
  transform transition-transform duration-300 ease-in-out
  {isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  flex flex-col h-full
">
  <!-- Header -->
  <div class="p-4 border-b border-gray-800">
    <button 
      on:click={onNewChat}
      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      New Chat
    </button>
  </div>
  
  <!-- Chat History -->
  <div class="flex-1 overflow-y-auto p-4">
    <h3 class="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
    
    <div class="space-y-2">
      <div class="p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <p class="text-sm text-white">What is machine learning?</p>
        <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
      </div>
      
      <div class="p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <p class="text-sm text-white">Explain quantum computing</p>
        <p class="text-xs text-gray-500 mt-1">Yesterday</p>
      </div>
      
      <div class="p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <p class="text-sm text-white">Help with React components</p>
        <p class="text-xs text-gray-500 mt-1">2 days ago</p>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="p-4 border-t border-gray-800">
    <div class="space-y-2">
      <a 
        href="/settings" 
        class="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        Settings
      </a>
      
      <a 
        href="/help" 
        class="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        Help
      </a>
    </div>
  </div>
</div>
