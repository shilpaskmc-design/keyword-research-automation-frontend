import { Plus, Trash2 } from 'lucide-react';
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ManualInputFormValues } from '@/features/manual-inputs/utils/manualInputMapping';

interface AdditionalDetailsEditorProps {
  control: Control<ManualInputFormValues>;
  register: UseFormRegister<ManualInputFormValues>;
  errors: FieldErrors<ManualInputFormValues>;
  disabled?: boolean;
}

export function AdditionalDetailsEditor({
  control,
  register,
  errors,
  disabled = false,
}: AdditionalDetailsEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'additionalDetails' });

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-sm font-medium">Additional Details</legend>
      <p className="text-sm text-muted-foreground">Add optional field-name and value pairs.</p>
      <div className="space-y-3">
        {fields.map((field, index) => {
          const rowError = errors.additionalDetails?.[index];
          return (
            <div
              key={field.id}
              className="grid items-end gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <div className="space-y-2">
                <Label htmlFor={`additional-key-${field.id}`}>Field Name</Label>
                <Input
                  id={`additional-key-${field.id}`}
                  {...register(`additionalDetails.${index}.key`)}
                  aria-invalid={Boolean(rowError?.key)}
                />
                {rowError?.key?.message ? (
                  <p role="alert" className="text-sm text-destructive">
                    {rowError.key.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`additional-value-${field.id}`}>Value</Label>
                <Input
                  id={`additional-value-${field.id}`}
                  {...register(`additionalDetails.${index}.value`)}
                  aria-invalid={Boolean(rowError?.value)}
                />
                {rowError?.value?.message ? (
                  <p role="alert" className="text-sm text-destructive">
                    {rowError.value.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                aria-label={`Remove additional detail row ${index + 1}`}
              >
                <Trash2 aria-hidden="true" />
                Remove
              </Button>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ key: '', value: '' })}
      >
        <Plus aria-hidden="true" />
        Add Field
      </Button>
    </fieldset>
  );
}
