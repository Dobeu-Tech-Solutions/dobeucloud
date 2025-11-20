import { createServerSupabaseClient } from './supabase-server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type UserRole = 'client' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
}

// Cache the user for the duration of the request
export const getUser = cache(async () => {
  const supabase = createServerSupabaseClient();
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get additional user metadata from our MongoDB database
    // This will be implemented after we set up API routes
    return {
      id: user.id,
      email: user.email!,
      role: (user.user_metadata?.role as UserRole) || 'client',
      emailVerified: user.email_confirmed_at !== null,
      phoneVerified: user.phone_confirmed_at !== null,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
});

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}

export async function requireEmailVerified() {
  const user = await requireAuth();
  if (!user.emailVerified) {
    redirect('/verify-email');
  }
  return user;
}
