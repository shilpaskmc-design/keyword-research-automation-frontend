import { useId, useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateEntry } from '@/features/business-profile/hooks/useBusinessProfile';
import { getBusinessProfileErrorMessage } from '@/features/business-profile/utils/getBusinessProfileErrorMessage';

interface AddEntryInputProps {
  categoryId: number;
  categoryName: string;
}

export function AddEntryInput({ categoryId, categoryName }: AddEntryInputProps) {
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState<string>();
  const mutation = useCreateEntry();
  const errorMessage = mutation.error
    ? getBusinessProfileErrorMessage(mutation.error, 'The entry could not be added.')
    : validationError;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setValidationError('Entry value is required.');
      return;
    }

    setValidationError(undefined);
    mutation.mutate(
      { categoryId, value: trimmedValue },
      {
        onSuccess: () => setValue(''),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor={inputId} className="sr-only">
        New entry for {categoryName}
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={inputId}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setValidationError(undefined);
            if (mutation.error) mutation.reset();
          }}
          placeholder="New entry…"
          disabled={mutation.isPending}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? errorId : undefined}
        />
        <Button type="submit" disabled={mutation.isPending} className="sm:shrink-0">
          {mutation.isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {mutation.isPending ? 'Adding…' : 'Add'}
        </Button>
      </div>
      {errorMessage ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
