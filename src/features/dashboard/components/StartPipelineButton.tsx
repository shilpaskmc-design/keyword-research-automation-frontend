import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StartPipelineButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick}>
      <Play aria-hidden="true" />
      Start Pipeline
    </Button>
  );
}
