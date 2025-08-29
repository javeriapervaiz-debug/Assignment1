<script lang="ts">
  export let isOpen = false;
  export let onClose = () => {};
  export let onNewChat = () => {};
  
  // Mock chat history data
  const chatHistory = [
    { id: 1, title: "What is machine learning?", timestamp: "2 hours ago" },
    { id: 2, title: "Explain quantum computing", timestamp: "Yesterday" },
    { id: 3, title: "Help with React components", timestamp: "2 days ago" },
    { id: 4, title: "Database optimization tips", timestamp: "1 week ago" },
    { id: 5, title: "API design best practices", timestamp: "1 week ago" }
  ];
  
  function handleNewChat() {
    onNewChat();
  }
  
  function handleChatClick(chatId) {
    console.log('Selected chat:', chatId);
  }
  
  function handleBackdropClick() {
    onClose();
  }
</script>

<!-- Mobile backdrop -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && handleBackdropClick()}
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
      on:click={handleNewChat}
      class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      New Chat
    </button>
  </div>
  
  <!-- Chat History -->
  <div class="flex-1 overflow-y-auto">
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
      
      <div class="space-y-2">
        {#each chatHistory as chat}
          <button 
            on:click={() => handleChatClick(chat.id)}
            class="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                {chat.title}
              </p>
              <p class="text-xs text-gray-500 mt-1">{chat.timestamp}</p>
            </div>
          </button>
        {/each}
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
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Settings
      </a>
      
      <a 
        href="/help" 
        class="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Help & FAQ
      </a>
    </div>
  </div>
</div>
