import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpandCollapseAllButtonProps {
  isAllExpanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ExpandCollapseAllButton({
  isAllExpanded,
  onToggle,
  disabled = false,
}: ExpandCollapseAllButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onToggle} disabled={disabled}>
      {isAllExpanded ? (
        <ChevronsDownUp aria-hidden="true" />
      ) : (
        <ChevronsUpDown aria-hidden="true" />
      )}
      {isAllExpanded ? 'Collapse All' : 'Expand All'}
    </Button>
  );
}
