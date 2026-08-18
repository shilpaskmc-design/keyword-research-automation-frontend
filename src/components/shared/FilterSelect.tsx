import { useId } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T extends string> {
  label: string;
  value?: T;
  options: FilterOption<T>[];
  onValueChange: (value: T | undefined) => void;
  clearLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onValueChange,
  clearLabel = 'All',
  placeholder = 'Select an option',
  disabled = false,
  id,
  className,
}: FilterSelectProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const clearValue = `__filter_select_clear_${generatedId}`;

  function handleValueChange(nextValue: string) {
    onValueChange(nextValue === clearValue ? undefined : (nextValue as T));
  }

  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <Label htmlFor={triggerId}>{label}</Label>
      <Select value={value ?? clearValue} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger id={triggerId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={clearValue}>{clearLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
