import { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { isApiError } from '@/api/errors';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

export function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const auth = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setError(null);
    try {
      await auth.logout();
    } catch (caught) {
      setError(
        isApiError(caught)
          ? 'Unable to log out right now. Please try again.'
          : 'Unable to log out right now.'
      );
      setIsLoggingOut(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('w-full justify-start', compact && 'min-h-11')}>
          <User aria-hidden="true" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className={compact ? 'w-64' : 'w-[var(--radix-dropdown-menu-trigger-width)]'}
      >
        <DropdownMenuLabel className="flex items-center gap-2 font-normal text-muted-foreground">
          <User aria-hidden="true" />
          <span className="truncate">{auth.session?.user.email ?? 'Authenticated user'}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoggingOut} onSelect={() => void handleLogout()}>
          <LogOut aria-hidden="true" />
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </DropdownMenuItem>
        {error ? (
          <p role="alert" className="px-2 py-1.5 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
