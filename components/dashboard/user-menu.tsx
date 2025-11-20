'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  CreditCard,
  FileText,
  HelpCircle
} from 'lucide-react';

interface UserMenuProps {
  user: {
    email: string;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm text-gray-300">{user.email}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-gray-800">
              <p className="text-sm text-white font-medium">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {user.role === 'admin' ? 'Administrator' : 'Client Account'}
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  router.push('/dashboard/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              
              <button
                onClick={() => {
                  router.push('/dashboard/billing');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <CreditCard className="w-4 h-4" />
                Billing
              </button>
              
              <button
                onClick={() => {
                  router.push('/dashboard/documents');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <FileText className="w-4 h-4" />
                Documents
              </button>
              
              <button
                onClick={() => {
                  router.push('/dashboard/settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              
              <button
                onClick={() => {
                  (window as any).Intercom?.('show');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                <HelpCircle className="w-4 h-4" />
                Support
              </button>
            </div>

            <div className="p-2 border-t border-gray-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
