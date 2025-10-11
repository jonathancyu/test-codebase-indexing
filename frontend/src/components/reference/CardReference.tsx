import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function CardReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Layout</CardTitle>
        <CardDescription>This is an example of our card component structure.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cards provide a flexible container for grouping related content and actions. They include header, content,
            and optional footer sections.
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="outline">Interactive</Badge>
            <Button onClick={() => toast.info('Card action clicked!')}>Card Action</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
