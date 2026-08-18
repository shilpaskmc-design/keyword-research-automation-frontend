import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { LoaderCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ExcelUploadResult } from '@/features/manual-inputs/api/manualInputsApi';
import { UploadResultSummary } from '@/features/manual-inputs/components/UploadResultSummary';
import { useUploadManualInputs } from '@/features/manual-inputs/hooks/useManualInputs';
import { getManualInputErrorMessage } from '@/features/manual-inputs/utils/getManualInputErrorMessage';

export function UploadExcelDialog() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState<string>();
  const [result, setResult] = useState<ExcelUploadResult>();
  const mutation = useUploadManualInputs();
  const requestError = mutation.error
    ? getManualInputErrorMessage(mutation.error, 'The file could not be uploaded.')
    : undefined;

  function resetDialog() {
    setFile(undefined);
    setFileError(undefined);
    setResult(undefined);
    mutation.reset();
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) resetDialog();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    setFileError(undefined);
    setResult(undefined);
    mutation.reset();

    if (!selectedFile) {
      setFile(undefined);
      return;
    }

    const lowerName = selectedFile.name.toLowerCase();
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.csv')) {
      setFile(undefined);
      setFileError('Choose a file with the .csv or .xlsx extension.');
      event.target.value = '';
      return;
    }

    setFile(selectedFile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setFileError('Choose a CSV or XLSX file before uploading.');
      return;
    }

    mutation.mutate(file, {
      onSuccess: (uploadResult) => {
        setResult(uploadResult);
        setFile(undefined);
        if (inputRef.current) inputRef.current.value = '';
      },
    });
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Upload aria-hidden="true" />
        Upload CSV / Excel
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Manual Inputs</DialogTitle>
            <DialogDescription>
              Supported formats: CSV and XLSX. Input Text is required. Summary / Gist is optional.
              All other columns are saved as Additional Details.
            </DialogDescription>
          </DialogHeader>
          {result ? (
            <div className="space-y-5">
              <UploadResultSummary result={result} />
              <DialogFooter>
                <Button type="button" onClick={() => handleOpenChange(false)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="manual-input-upload">File</Label>
                <Input
                  ref={inputRef}
                  id="manual-input-upload"
                  type="file"
                  accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                  disabled={mutation.isPending}
                  aria-invalid={Boolean(fileError || requestError)}
                />
                {file ? (
                  <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
                ) : null}
                {fileError || requestError ? (
                  <p role="alert" className="text-sm text-destructive">
                    {fileError ?? requestError}
                  </p>
                ) : null}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                  ) : null}
                  {mutation.isPending ? 'Uploading…' : 'Upload'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
