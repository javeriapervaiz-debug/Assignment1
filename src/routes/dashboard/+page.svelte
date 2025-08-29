<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import ChatSidebar from '$lib/components/ChatSidebar.svelte';
  import ChatArea from '$lib/components/ChatArea.svelte';
  
  export let data: { user: any };
  
  let showOAuthWelcome = false;
  let oauthProvider = '';
  let sidebarOpen = true;
  
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === '1' && urlParams.get('oauth')) {
      showOAuthWelcome = true;
      oauthProvider = urlParams.get('oauth') || '';
      
      // Remove URL parameters after showing welcome
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('oauth');
        url.searchParams.delete('welcome');
        window.history.replaceState({}, '', url.toString());
        showOAuthWelcome = false;
      }, 5000);
    }
  });
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<svelte:head>
  <title>Dashboard - AI Assistant</title>
</svelte:head>

<!-- OAuth Welcome Toast -->
{#if showOAuthWelcome}
  <div class="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg border border-green-500">
    <div class="flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div>
        <h3 class="font-semibold">Welcome!</h3>
        <p class="text-sm">Successfully signed in with {oauthProvider}</p>
      </div>
    </div>
  </div>
{/if}

<div class="min-h-screen bg-gray-950 text-white flex flex-col">
  <!-- Top Navigation -->
  <Navbar 
    user={data.user} 
    on:toggle-sidebar={toggleSidebar} 
  />
  
  <!-- Main Content Area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Chat Sidebar -->
    <ChatSidebar 
      bind:isOpen={sidebarOpen}
      user={data.user}
    />
    
    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <ChatArea user={data.user} />
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: rgb(3, 7, 18);
  }
</style>