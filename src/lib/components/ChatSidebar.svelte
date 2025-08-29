<script lang="ts">
  export let isOpen = true;
  export let user: any;
  
  let chatHistory = [
    { id: 1, title: "Welcome to the platform", timestamp: "2 hours ago", active: true },
    { id: 2, title: "Profile setup complete", timestamp: "1 day ago", active: false },
    { id: 3, title: "Getting started guide", timestamp: "3 days ago", active: false }
  ];
  
  function toggleSidebar() {
    isOpen = !isOpen;
  }
  
  function selectChat(chatId: number) {
    chatHistory = chatHistory.map(chat => ({
      ...chat,
      active: chat.id === chatId
    }));
  }
</script>

<div class="flex h-full">
  <!-- Sidebar -->
  <aside class="bg-gray-900 border-r border-gray-800 transition-all duration-300 {isOpen ? 'w-80' : 'w-16'} flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-800">
      <div class="flex items-center justify-between">
        {#if isOpen}
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-white font-semibold">Chat History</h2>
              <p class="text-gray-400 text-sm">Your conversations</p>
            </div>
          </div>
        {/if}
        
        <button 
          on:click={toggleSidebar}
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
    
    {#if isOpen}
      <!-- New Chat Button -->
      <div class="p-4">
        <button class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Chat
        </button>
      </div>
      
      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        {#each chatHistory as chat}
          <button 
            on:click={() => selectChat(chat.id)}
            class="w-full text-left p-3 rounded-lg transition-colors {chat.active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
          >
            <div class="font-medium text-sm mb-1 truncate">{chat.title}</div>
            <div class="text-xs text-gray-500">{chat.timestamp}</div>
          </button>
        {/each}
      </div>
      
      <!-- User Info -->
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
            {#if user.profileImageUrl}
              <img src={user.profileImageUrl} alt="Profile" class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                {user.firstName?.[0] || user.email[0]?.toUpperCase()}
              </div>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">
              {user.firstName || 'User'}
            </p>
            <p class="text-gray-400 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Collapsed sidebar icons -->
      <div class="flex-1 p-2 space-y-2">
        <button 
          class="w-full p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="New chat"
        >
          <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
        
        {#each chatHistory.slice(0, 3) as chat}
          <button 
            on:click={() => selectChat(chat.id)}
            class="w-full p-3 rounded-lg transition-colors {chat.active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}"
            aria-label={chat.title}
            title={chat.title}
          >
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>
        {/each}
      </div>
    {/if}
  </aside>
</div>
