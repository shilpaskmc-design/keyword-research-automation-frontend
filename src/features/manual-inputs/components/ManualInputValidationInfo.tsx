import type { ManualInputRecord } from '@/features/manual-inputs/api/manualInputsApi';

interface ManualInputValidationInfoProps {
  record: ManualInputRecord;
}

export function ManualInputValidationInfo({ record }: ManualInputValidationInfoProps) {
  const errors = record.validation_errors?.filter((error) => error.trim()) ?? [];

  if (errors.length > 0) {
    return (
      <ul className="min-w-48 list-disc space-y-1 pl-4 text-sm text-destructive">
        {errors.map((error, index) => (
          <li key={`${error}-${index}`}>{error}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className="min-w-48 text-sm text-destructive">
      {record.validation_message?.trim() || 'Validation details are not available.'}
    </p>
  );
}
