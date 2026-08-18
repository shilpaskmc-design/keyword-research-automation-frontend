import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';

export function NotFoundPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Page not found"
        description="The page you requested does not exist or may have moved."
      />
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </section>
  );
}
