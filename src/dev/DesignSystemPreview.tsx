import { AlertCircle, Info, LoaderCircle, MoreHorizontal } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const swatches = [
  ['Primary', 'bg-primary'],
  ['Success', 'bg-success'],
  ['Warning', 'bg-warning'],
  ['Destructive', 'bg-destructive'],
  ['Info', 'bg-info'],
] as const;

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-surface p-4 shadow-sm sm:p-6">
      <h2 className="text-section-title">{title}</h2>
      <Separator className="my-4" />
      {children}
    </section>
  );
}

export function DesignSystemPreview() {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#preview-content">
        Skip to preview content
      </a>
      <main
        id="preview-content"
        className="mx-auto min-h-screen w-full max-w-7xl p-4 sm:p-6 lg:p-8"
      >
        <header className="mb-8 max-w-3xl">
          <Badge variant="secondary">Development preview</Badge>
          <h1 className="mt-3 text-page-title">Design System Foundation</h1>
          <p className="mt-2 text-supporting text-muted-foreground">
            A temporary, non-product preview of the approved tokens, primitives, and interaction
            states.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewSection title="Color and type tokens">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {swatches.map(([label, color]) => (
                <div key={label} className="min-w-0">
                  <div className={`h-12 rounded-md ${color}`} />
                  <p className="mt-2 truncate text-caption text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-1">
              <p className="text-card-title">Card title</p>
              <p className="text-supporting">Supporting text remains readable at small sizes.</p>
              <p className="text-caption text-muted-foreground">Caption and metadata text</p>
            </div>
          </PreviewSection>

          <PreviewSection title="Buttons and badges">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
              <Button disabled aria-label="Saving changes">
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Saving changes
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Neutral</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </PreviewSection>

          <PreviewSection title="Fields and selection">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preview-name">Label</Label>
                <Input id="preview-name" placeholder="Enter a value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview-invalid">Invalid field</Label>
                <Input
                  id="preview-invalid"
                  defaultValue="Invalid value"
                  aria-invalid="true"
                  aria-describedby="preview-invalid-error"
                />
                <p
                  id="preview-invalid-error"
                  className="flex items-center gap-1 text-caption text-destructive"
                >
                  <AlertCircle className="size-3.5" aria-hidden="true" />
                  Review this value.
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="preview-notes">Textarea</Label>
                <Textarea id="preview-notes" placeholder="Add supporting notes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview-select">Select</Label>
                <Select>
                  <SelectTrigger id="preview-select">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First option</SelectItem>
                    <SelectItem value="second">Second option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 self-end pb-2">
                <Checkbox id="preview-checkbox" defaultChecked />
                <Label htmlFor="preview-checkbox">Selected checkbox</Label>
              </div>
            </div>
          </PreviewSection>

          <PreviewSection title="Tabs and menus">
            <Tabs defaultValue="first">
              <TabsList className="max-w-full">
                <TabsTrigger value="first">First tab</TabsTrigger>
                <TabsTrigger value="second">Second tab</TabsTrigger>
              </TabsList>
              <TabsContent
                value="first"
                className="rounded-md bg-surface-muted p-4 text-supporting"
              >
                Tab panels expose active and keyboard focus states.
              </TabsContent>
              <TabsContent
                value="second"
                className="rounded-md bg-surface-muted p-4 text-supporting"
              >
                A second neutral preview panel.
              </TabsContent>
            </Tabs>
            <div className="mt-4 flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open preview menu">
                    <MoreHorizontal aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Preview actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Enabled action</DropdownMenuItem>
                  <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="About this preview">
                    <Info aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keyboard-accessible supporting context</TooltipContent>
              </Tooltip>
            </div>
          </PreviewSection>

          <PreviewSection title="Dialogs">
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>Responsive dialog</DialogTitle>
                    <DialogDescription>
                      Dialog content remains readable and reachable on narrow viewports.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Open alert dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[calc(100%-2rem)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm destructive action</AlertDialogTitle>
                    <AlertDialogDescription>
                      The alert explains the consequence before an action is confirmed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PreviewSection>

          <PreviewSection title="Loading and status presentation">
            <div className="space-y-3" aria-label="Loading placeholder preview">
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="status-message mt-5 border-info/40" role="status">
              <p className="font-medium text-info">Status presentation</p>
              <p className="live-region-text mt-1">
                Status and error messages can include readable text instead of relying on color.
              </p>
            </div>
          </PreviewSection>
        </div>
      </main>
    </TooltipProvider>
  );
}
