import { useId } from 'react';
import type { BusinessProfileCategory } from '@/features/business-profile/api/businessProfileApi';
import { AddEntryInput } from '@/features/business-profile/components/AddEntryInput';
import { BusinessProfileEntryList } from '@/features/business-profile/components/BusinessProfileEntryList';
import { CategoryEntriesToggle } from '@/features/business-profile/components/CategoryEntriesToggle';
import { DeleteCategoryDialog } from '@/features/business-profile/components/DeleteCategoryDialog';

interface BusinessProfileCategoryCardProps {
  category: BusinessProfileCategory;
  expanded: boolean;
  onToggle: () => void;
}

export function BusinessProfileCategoryCard({
  category,
  expanded,
  onToggle,
}: BusinessProfileCategoryCardProps) {
  const entriesId = useId();

  return (
    <article className="rounded-lg border bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-card-title text-foreground">{category.name}</h2>
        <DeleteCategoryDialog
          categoryId={category.id}
          categoryName={category.name}
          entryCount={category.entries.length}
        />
      </div>

      <div className="mt-3 border-y">
        <CategoryEntriesToggle
          categoryName={category.name}
          entryCount={category.entries.length}
          expanded={expanded}
          controlsId={entriesId}
          onToggle={onToggle}
        />
        {expanded ? (
          <div id={entriesId} className="border-t">
            <BusinessProfileEntryList entries={category.entries} />
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <AddEntryInput categoryId={category.id} categoryName={category.name} />
      </div>
    </article>
  );
}
