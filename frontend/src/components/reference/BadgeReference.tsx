import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BadgeReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Components</CardTitle>
        <CardDescription>Status indicators and labels for categorization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Active</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="outline">In Progress</Badge>
          <Badge variant="destructive">Completed</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
