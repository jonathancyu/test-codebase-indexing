import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function ToastReference() {
  const [toastCount, setToastCount] = useState(0);

  const handleErrorToast = () => {
    setToastCount(prev => prev + 1);
    toast.error('Demo Error Toast', {
      description: `This is a standard error toast demonstration. Toast #${toastCount + 1}`,
      action: {
        label: 'Retry',
        onClick: () => toast.info('Retry clicked!'),
      },
    });
  };

  const handleSuccessToast = () => {
    toast.success('Success!', {
      description: 'This is a success toast example.',
    });
  };

  const handleInfoToast = () => {
    toast.info('Information', {
      description: 'This is an informational toast.',
    });
  };

  const handleWarningToast = () => {
    toast.warning('Warning', {
      description: 'This is a warning toast.',
    });
  };

  const handleAlertDemo = () => {
    toast.info('Alert Notification', {
      description: 'This is an alert toast positioned at the top middle of the screen.',
      position: 'top-center',
      duration: 2000,
    });
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!');
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Promise is pending...',
      success: 'Promise resolved successfully!',
      error: 'Promise was rejected.',
    });
  };

  const handleActionToast = () => {
    toast('Action Required', {
      description: 'Please confirm this action to continue with the process.',
      action: {
        label: 'Confirm',
        onClick: () => toast.success('Action confirmed successfully!'),
      },
      duration: 5000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Our application uses Sonner for beautiful, accessible toast notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleErrorToast} variant="destructive" size="sm">
            Error Toast
          </Button>
          <Button onClick={handleSuccessToast} size="sm">
            Success Toast
          </Button>
          <Button onClick={handleInfoToast} variant="secondary" size="sm">
            Info Toast
          </Button>
          <Button onClick={handleWarningToast} variant="outline" size="sm">
            Warning Toast
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Button onClick={handleActionToast} variant="outline" size="sm">
            Action Toast (with Button)
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Button onClick={handleAlertDemo} variant="outline">
            Alert Toast Demo (Top Center)
          </Button>
          <Button onClick={handlePromiseToast} variant="outline">
            Promise Toast Demo
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">Toast count: {toastCount}</div>
      </CardContent>
    </Card>
  );
}
