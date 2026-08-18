import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalDetailsEditor } from '@/features/manual-inputs/components/AdditionalDetailsEditor';
import { useCreateManualInput } from '@/features/manual-inputs/hooks/useManualInputs';
import { getManualInputErrorMessage } from '@/features/manual-inputs/utils/getManualInputErrorMessage';
import {
  mapManualInputForm,
  type ManualInputFormValues,
} from '@/features/manual-inputs/utils/manualInputMapping';

const manualInputSchema: z.ZodType<ManualInputFormValues> = z
  .object({
    inputText: z.string().refine((value) => value.trim().length > 0, 'Input Text is required.'),
    gist: z.string(),
    additionalDetails: z.array(z.object({ key: z.string(), value: z.string() })),
  })
  .superRefine((values, context) => {
    const seenKeys = new Set<string>();

    values.additionalDetails.forEach((detail, index) => {
      const key = detail.key.trim();
      const value = detail.value.trim();
      if (!key && !value) return;

      if (!key) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Field Name is required when a value is provided.',
          path: ['additionalDetails', index, 'key'],
        });
      }
      if (!value) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Value is required when a Field Name is provided.',
          path: ['additionalDetails', index, 'value'],
        });
      }
      if (key && seenKeys.has(key)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Field Names must be unique.',
          path: ['additionalDetails', index, 'key'],
        });
      }
      if (key) seenKeys.add(key);
    });
  });

interface AddManualInputFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function AddManualInputForm({ onCancel, onSuccess }: AddManualInputFormProps) {
  const mutation = useCreateManualInput();
  const form = useForm<ManualInputFormValues>({
    resolver: zodResolver(manualInputSchema),
    defaultValues: {
      inputText: '',
      gist: '',
      additionalDetails: [{ key: '', value: '' }],
    },
  });
  const errorMessage = mutation.error
    ? getManualInputErrorMessage(mutation.error, 'The Manual Input could not be added.')
    : undefined;

  function handleSubmit(values: ManualInputFormValues) {
    mutation.mutate(mapManualInputForm(values), {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="manual-input-text">Input Text</Label>
        <Textarea
          id="manual-input-text"
          {...form.register('inputText')}
          disabled={mutation.isPending}
          aria-invalid={Boolean(form.formState.errors.inputText)}
        />
        {form.formState.errors.inputText?.message ? (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.inputText.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="manual-input-gist">Summary / Gist</Label>
        <Textarea id="manual-input-gist" {...form.register('gist')} disabled={mutation.isPending} />
      </div>
      <AdditionalDetailsEditor
        control={form.control}
        register={form.register}
        errors={form.formState.errors}
        disabled={mutation.isPending}
      />
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {mutation.isPending ? 'Adding…' : 'Add Input'}
        </Button>
      </DialogFooter>
    </form>
  );
}
