import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TechnologyStackReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frontend Technology Stack</CardTitle>
        <CardDescription>Technologies and libraries powering our frontend application.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">⚛️</div>
            <div className="font-medium">React</div>
            <div className="text-xs text-muted-foreground">UI Framework</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-medium">Tailwind CSS</div>
            <div className="text-xs text-muted-foreground">Styling</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">Sonner</div>
            <div className="text-xs text-muted-foreground">Toast Notifications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🗂️</div>
            <div className="font-medium">shadcn/ui</div>
            <div className="text-xs text-muted-foreground">Component Library</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium">Dialog</div>
            <div className="text-xs text-muted-foreground">Modal Components</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
