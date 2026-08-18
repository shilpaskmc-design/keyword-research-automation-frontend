import type { BusinessProfileCategory } from '@/features/business-profile/api/businessProfileApi';
import { BusinessProfileCategoryCard } from '@/features/business-profile/components/BusinessProfileCategoryCard';

interface BusinessProfileCategoryListProps {
  categories: BusinessProfileCategory[];
  expandedCategoryIds: ReadonlySet<number>;
  onToggleCategory: (categoryId: number) => void;
}

export function BusinessProfileCategoryList({
  categories,
  expandedCategoryIds,
  onToggleCategory,
}: BusinessProfileCategoryListProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <BusinessProfileCategoryCard
          key={category.id}
          category={category}
          expanded={expandedCategoryIds.has(category.id)}
          onToggle={() => onToggleCategory(category.id)}
        />
      ))}
    </div>
  );
}
