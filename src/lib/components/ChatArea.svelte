<script lang="ts">
  export let user: any;
  
  let message = '';
  let messages = [
    {
      id: 1,
      type: 'assistant',
      content: `Hello ${user.firstName || 'there'}! Welcome to your dashboard. I'm here to help you navigate and manage your account. What would you like to know about?`,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'user',
      content: 'What features are available on this platform?',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'assistant',
      content: 'Great question! This platform includes:\n\n• **Authentication System** - Secure login with email verification\n• **OAuth Integration** - Sign in with Google or GitHub\n• **Profile Management** - Update your information and avatar\n• **Role-Based Access** - User and admin roles\n• **Admin Dashboard** - For administrators to manage users\n\nYou can access your profile settings from the navbar above, or if you\'re an admin, you can access the admin panel.',
      timestamp: new Date(Date.now() - 180000)
    }
  ];
  
  function sendMessage() {
    if (message.trim()) {
      // Add user message
      messages = [...messages, {
        id: Date.now(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date()
      }];
      
      const userMessage = message.trim();
      message = '';
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        let response = getAIResponse(userMessage);
        messages = [...messages, {
          id: Date.now() + 1,
          type: 'assistant',
          content: response,
          timestamp: new Date()
        }];
      }, 1000);
    }
  }
  
  function getAIResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      return 'You can manage your profile by clicking on your avatar in the top-right corner of the navbar. There you can update your personal information, change your avatar, and manage your account settings.';
    } else if (lowerMessage.includes('admin') && user.role === 'admin') {
      return 'As an administrator, you have access to the Admin Panel! Click on "Admin Panel" in your profile dropdown to manage users, view analytics, and control system settings.';
    } else if (lowerMessage.includes('admin') && user.role !== 'admin') {
      return 'Admin features are only available to users with administrator privileges. Your current role is "' + user.role + '".';
    } else if (lowerMessage.includes('logout') || lowerMessage.includes('sign out')) {
      return 'To log out, click on your profile avatar in the top-right corner and select "Logout" from the dropdown menu.';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'m here to help! You can ask me about:\n\n• Managing your profile\n• Understanding your account features\n• Navigating the dashboard\n• Admin functions (if you\'re an admin)\n• Logging out\n\nWhat specific topic would you like help with?';
    } else {
      return 'I understand you\'re asking about "' + userMessage + '". While I\'m still learning, I can help you with profile management, account features, and navigation. Is there something specific you\'d like to know about the platform?';
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  function formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
</script>

<div class="flex flex-col h-full">
  <!-- Chat Header -->
  <div class="p-6 border-b border-gray-800">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard Assistant</h1>
        <p class="text-gray-400">Your AI-powered dashboard helper</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <span class="text-green-400 text-sm font-medium">Online</span>
      </div>
    </div>
  </div>
  
  <!-- Messages Area -->
  <div class="flex-1 overflow-y-auto p-6 space-y-6">
    {#each messages as msg}
      <div class="flex {msg.type === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="flex gap-3 max-w-3xl {msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}">
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            {#if msg.type === 'user'}
              {#if user.profileImageUrl}
                <img src={user.profileImageUrl} alt="You" class="w-full h-full object-cover" />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  {user.firstName?.[0] || user.email[0]?.toUpperCase()}
                </div>
              {/if}
            {:else}
              <div class="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            {/if}
          </div>
          
          <!-- Message Bubble -->
          <div class="flex flex-col {msg.type === 'user' ? 'items-end' : 'items-start'}">
            <div class="px-4 py-3 rounded-2xl {msg.type === 'user' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-100 border border-gray-700'} 
              max-w-full break-words">
              
              {#if msg.content.includes('\n')}
                <!-- Multi-line content with formatting -->
                <div class="whitespace-pre-line">
                  {#each msg.content.split('\n') as line}
                    {#if line.startsWith('• **')}
                      <div class="flex items-start gap-2 mb-1">
                        <span class="text-purple-400 mt-1">•</span>
                        <div>
                          {#if line.includes('**')}
                            {@html line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>').slice(2)}
                          {:else}
                            {line.slice(2)}
                          {/if}
                        </div>
                      </div>
                    {:else if line.trim()}
                      <div class="mb-1">{line}</div>
                    {:else}
                      <div class="h-2"></div>
                    {/if}
                  {/each}
                </div>
              {:else}
                {msg.content}
              {/if}
            </div>
            
            <div class="text-xs text-gray-500 mt-1 {msg.type === 'user' ? 'text-right' : 'text-left'}">
              {formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Message Input -->
  <div class="p-6 border-t border-gray-800">
    <div class="flex gap-4">
      <div class="flex-1 relative">
        <textarea
          bind:value={message}
          on:keydown={handleKeydown}
          placeholder="Ask me anything about your dashboard..."
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="1"
        ></textarea>
      </div>
      
      <button
        on:click={sendMessage}
        disabled={!message.trim()}
        class="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        Send
      </button>
    </div>
    
    <div class="mt-2 text-xs text-gray-500">
      Press Enter to send, Shift+Enter for new line
    </div>
  </div>
</div>
