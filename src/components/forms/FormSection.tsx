import { ReactNode } from 'react&apos;;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card&apos;;
import { cn } from '@/lib/utils&apos;;

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className,
  collapsible = false,
  defaultCollapsed = false
}: FormSectionProps) {
  return (
    <Card className={cn('w-full&apos;, className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
