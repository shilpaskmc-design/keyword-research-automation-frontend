import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StartPipelineButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export function StartPipelineButton({ disabled, onClick }: StartPipelineButtonProps) {
  return (
    <Button type="button" disabled={disabled} onClick={onClick}>
      <Play aria-hidden="true" />
      Start Pipeline
    </Button>
  );
}
