// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { users } from '$lib/db/schema';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: typeof users.$inferSelect | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
