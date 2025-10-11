import {
  ToastReference,
  ButtonReference,
  BadgeReference,
  CardReference,
  DialogReference,
  TableReference,
  InputReference,
  DropdownReference,
} from '../components/reference';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function Frontend() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Frontend Components</h1>
          <p className="text-lg text-muted-foreground">
            Interactive demonstrations of our frontend component library and user interface patterns.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ToastReference />
          <ButtonReference />
          <BadgeReference />
          <CardReference />
          <DialogReference />
          <DropdownReference />
          <TableReference />
        </div>

        <div className="mt-6">
          <InputReference />
        </div>

        <div className="mt-6">
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
        </div>
      </div>
    </div>
  );
}
