import type { BusinessProfileCategory } from '@/features/business-profile/api/businessProfileApi';
import { BusinessProfileEntry } from '@/features/business-profile/components/BusinessProfileEntry';

interface BusinessProfileEntryListProps {
  entries: BusinessProfileCategory['entries'];
}

export function BusinessProfileEntryList({ entries }: BusinessProfileEntryListProps) {
  if (entries.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">No entries in this category.</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <BusinessProfileEntry key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}
