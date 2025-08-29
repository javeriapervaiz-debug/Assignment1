<script lang="ts">
  import { enhance } from '$app/forms';
  import Navbar from '$lib/components/Navbar.svelte';
  
  export let data: { user: any };

  let firstName = data.user?.firstName || '';
  let lastName = data.user?.lastName || '';
  let email = data.user?.email || '';
  let newPassword = '';
  let avatarPreview: string | null = data.user?.profileImageUrl || null;

  function onAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      avatarPreview = url;
    }
  }
</script>

<div class="min-h-screen bg-gray-950 text-white flex flex-col">
  <!-- Navbar -->
  <Navbar user={data.user} />
  
  <!-- Main content -->
  <div class="flex-1 p-6 md:p-12">
    <div class="max-w-4xl mx-auto">
      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Profile Settings</h1>
        <p class="text-gray-400">Manage your account information and preferences</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Avatar section -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
          <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
            {#if avatarPreview}
              <img src={avatarPreview} alt="Avatar" class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-gray-500">No photo</div>
            {/if}
          </div>
          <form method="post" use:enhance enctype="multipart/form-data">
            <input type="hidden" name="/profile" value="avatar" />
            <input name="avatar" type="file" accept="image/*" class="block text-sm text-gray-300 mb-3" on:change={onAvatarChange} />
            <button formaction="?/avatar" class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Upload Avatar
            </button>
          </form>
        </div>

        <!-- Profile form -->
        <div class="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <form method="post" use:enhance class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">First name</label>
                <input 
                  id="firstName"
                  name="firstName" 
                  bind:value={firstName} 
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">Last name</label>
                <input 
                  id="lastName"
                  name="lastName" 
                  bind:value={lastName} 
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input 
                id="email"
                name="email" 
                type="email" 
                bind:value={email} 
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">New password</label>
              <input 
                id="newPassword"
                name="newPassword" 
                type="password" 
                bind:value={newPassword} 
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                placeholder="Leave blank to keep current password"
              />
              <p class="text-xs text-gray-500 mt-1">Leave blank if you don't want to change your password</p>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button 
                formaction="?/update" 
                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <a 
                href="/dashboard" 
                class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Danger zone -->
      <div class="mt-12 bg-red-900/20 border border-red-700 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <p class="text-gray-300 mb-4">These actions cannot be undone. Please be careful.</p>
        
        <div class="space-y-3">
          <form method="post" action="/logout">
            <button class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Sign Out
            </button>
          </form>
          
          <form 
            method="post" 
            action="?/delete" 
            on:submit={(e) => {
              if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                e.preventDefault();
              }
            }}
          >
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Delete Account
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
