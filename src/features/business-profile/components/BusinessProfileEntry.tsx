import { LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BusinessProfileCategory } from '@/features/business-profile/api/businessProfileApi';
import { useDeleteEntry } from '@/features/business-profile/hooks/useBusinessProfile';
import { getBusinessProfileErrorMessage } from '@/features/business-profile/utils/getBusinessProfileErrorMessage';

type BusinessProfileEntryData = BusinessProfileCategory['entries'][number];

interface BusinessProfileEntryProps {
  entry: BusinessProfileEntryData;
}

export function BusinessProfileEntry({ entry }: BusinessProfileEntryProps) {
  const mutation = useDeleteEntry();
  const errorMessage = mutation.error
    ? getBusinessProfileErrorMessage(mutation.error, 'The entry could not be deleted.')
    : undefined;

  return (
    <li className="border-t py-3 first:border-t-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <p className="min-w-0 break-words text-sm leading-6 text-foreground">{entry.value}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => mutation.mutate(entry.id)}
          disabled={mutation.isPending}
          aria-label={`Delete entry: ${entry.value}`}
          className="shrink-0 text-destructive hover:text-destructive"
        >
          {mutation.isPending ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Trash2 aria-hidden="true" />
          )}
        </Button>
      </div>
      {errorMessage ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </li>
  );
}
