import type { MouseEvent } from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavigation } from '@/components/shared/AppNavigation';

export function AppLayout() {
  function focusMainContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');

    mainContent?.focus();
    window.history.replaceState(null, '', '#main-content');
  }

  return (
    <div className="min-h-screen bg-background">
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        Skip to main content
      </a>
      <AppNavigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-[96rem] px-4 py-6 focus:outline-none sm:px-6 sm:py-8 lg:pl-72 lg:pr-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
