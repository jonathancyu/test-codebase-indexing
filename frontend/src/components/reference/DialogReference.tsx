import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ReusableDialog } from './ReusableDialog';

export function DialogReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dialog Components</CardTitle>
        <CardDescription>Reusable dialog modals for various user interactions and confirmations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <ReusableDialog
            trigger={
              <Button variant="default" className="w-full">
                Open Basic Dialog
              </Button>
            }
            title="Basic Dialog"
            description="This is a basic dialog with standard confirm/cancel actions."
            onConfirm={() => toast.success('Dialog confirmed!')}
            onCancel={() => toast.info('Dialog cancelled')}
          >
            <p className="text-sm text-muted-foreground">
              This is the content area of the dialog. You can put any React components here.
            </p>
          </ReusableDialog>

          <ReusableDialog
            trigger={
              <Button variant="destructive" className="w-full">
                Open Destructive Dialog
              </Button>
            }
            title="Delete Confirmation"
            description="This action cannot be undone. Are you sure you want to proceed?"
            confirmText="Delete"
            cancelText="Keep"
            confirmVariant="destructive"
            onConfirm={() => toast.error('Item deleted!')}
            onCancel={() => toast.info('Deletion cancelled')}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This is a destructive dialog example with custom button text and styling.
              </p>
              <Badge variant="destructive">Destructive Action</Badge>
            </div>
          </ReusableDialog>

          <ReusableDialog
            trigger={
              <Button variant="outline" className="w-full">
                Open Custom Dialog
              </Button>
            }
            title="Custom Content Dialog"
            description="This dialog contains custom content without footer actions."
            showFooter={false}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => toast.info('Custom action 1')}>
                  Action 1
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast.info('Custom action 2')}>
                  Action 2
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This dialog has no footer and includes custom action buttons.
              </p>
            </div>
          </ReusableDialog>
        </div>
      </CardContent>
    </Card>
  );
}
