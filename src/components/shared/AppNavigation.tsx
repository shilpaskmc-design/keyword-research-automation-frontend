import { useState } from 'react';
import { Building2, ClipboardList, FileText, LayoutDashboard, Menu, Network } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProfileMenu } from '@/features/auth/components/ProfileMenu';

const navigationItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Final Results', to: '/final-results', icon: FileText, end: false },
  { label: 'Manual Inputs', to: '/manual-inputs', icon: ClipboardList, end: false },
  { label: 'Business Profile', to: '/business-profile', icon: Building2, end: false },
  { label: 'Service Taxonomy', to: '/service-taxonomy', icon: Network, end: false },
] as const;

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {navigationItems.map(({ label, to, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
              )
            }
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function AppNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b bg-surface px-4 lg:hidden">
        <span className="text-sm font-semibold text-foreground">Keyword Research Automation</span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open primary navigation"
              aria-expanded={isOpen}
            >
              <Menu aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bottom-0 left-0 top-0 flex h-dvh w-[min(22rem,calc(100%-2rem))] max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-l-0 p-0 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full sm:rounded-none">
            <DialogHeader className="border-b px-6 py-5 text-left">
              <DialogTitle>Keyword Research Automation</DialogTitle>
              <DialogDescription>Primary navigation</DialogDescription>
            </DialogHeader>
            <nav aria-label="Primary" className="flex-1 overflow-y-auto p-4">
              <NavigationLinks onNavigate={() => setIsOpen(false)} />
            </nav>
            <div className="border-t p-4">
              <ProfileMenu compact />
            </div>
            <DialogClose className="sr-only">Close primary navigation</DialogClose>
          </DialogContent>
        </Dialog>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-surface lg:flex lg:flex-col">
        <div className="border-b px-6 py-6">
          <p className="text-base font-semibold text-foreground">Keyword Research Automation</p>
          <p className="mt-1 text-caption text-muted-foreground">Marketing operations</p>
        </div>
        <nav aria-label="Primary" className="flex-1 overflow-y-auto p-4">
          <NavigationLinks />
        </nav>
        <div className="border-t p-4">
          <ProfileMenu />
        </div>
      </aside>
    </>
  );
}
