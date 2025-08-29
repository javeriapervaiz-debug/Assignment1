<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  
  export let user: any;
  
  let messageInput = '';
  let chatContainer: HTMLElement;
  let isTyping = false;
  
  // Mock conversation data (will be replaced with real data later)
  let messages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 2,
      role: 'user',
      content: "Can you help me understand machine learning?",
      timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    },
    {
      id: 3,
      role: 'assistant',
      content: "Absolutely! Machine learning is a subset of artificial intelligence (AI) that enables computers to learn and improve from experience without being explicitly programmed. Instead of following pre-programmed instructions, machine learning algorithms build mathematical models based on training data to make predictions or decisions.\n\nHere are the main types:\n\n**1. Supervised Learning**: Uses labeled data to train models\n**2. Unsupervised Learning**: Finds patterns in data without labels\n**3. Reinforcement Learning**: Learns through trial and error with rewards\n\nWould you like me to dive deeper into any of these areas?",
      timestamp: new Date(Date.now() - 180000) // 3 minutes ago
    }
  ];
  
  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  afterUpdate(() => {
    scrollToBottom();
  });
  
  async function sendMessage() {
    if (!messageInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: messageInput.trim(),
      timestamp: new Date()
    };
    
    messages = [...messages, userMessage];
    messageInput = '';
    isTyping = true;
    
    // Simulate AI response (will be replaced with real AI integration later)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: "I understand your question. This is a simulated response - the actual AI integration will be implemented later. For now, this demonstrates the chat interface functionality.",
        timestamp: new Date()
      };
      
      messages = [...messages, aiResponse];
      isTyping = false;
    }, 1500);
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  
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

<div class="flex flex-col h-full">
  <!-- Chat header -->
  <div class="border-b border-gray-800 p-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-white">AI Assistant</h2>
        <p class="text-sm text-gray-400">Ready to help with your questions</p>
      </div>
    </div>
  </div>
  
  <!-- Chat messages -->
  <div 
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto p-4 space-y-6"
  >
    {#each messages as message}
      <div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if message.role === 'assistant'}
          <!-- AI Avatar -->
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        {/if}
        
        <div class="max-w-2xl {message.role === 'user' ? 'order-first' : ''}">
          <div class="
            {message.role === 'user' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto' 
              : 'bg-gray-800 text-gray-100'
            } 
            rounded-2xl px-4 py-3 shadow-lg
            {message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}
          ">
            <div class="prose prose-invert max-w-none text-sm leading-relaxed">
              {#each message.content.split('\n') as line}
                {#if line.trim() === ''}
                  <br />
                {:else if line.startsWith('**') && line.endsWith('**')}
                  <strong>{line.slice(2, -2)}</strong>
                {:else}
                  <p class="mb-2 last:mb-0">{line}</p>
                {/if}
              {/each}
            </div>
          </div>
          
          <div class="flex items-center gap-2 mt-2 {message.role === 'user' ? 'justify-end' : ''}">
            <span class="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
        </div>
        
        {#if message.role === 'user'}
          <!-- User Avatar -->
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-700 border border-gray-600 flex-shrink-0">
            {#if user?.profileImageUrl}
              <img src={user.profileImageUrl} alt="You" class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                {getUserInitials(user)}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
    
    <!-- Typing indicator -->
    {#if isTyping}
      <div class="flex gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Message input -->
  <div class="border-t border-gray-800 p-4">
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <textarea
          bind:value={messageInput}
          on:keydown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="1"
          disabled={isTyping}
        ></textarea>
      </div>
      
      <button
        on:click={sendMessage}
        disabled={!messageInput.trim() || isTyping}
        class="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {#if isTyping}
          <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        {/if}
      </button>
    </div>
    
    <div class="mt-2 text-xs text-gray-500 text-center">
      AI responses are simulated. Full AI integration coming soon.
    </div>
  </div>
</div>
