import { ReactNode } from 'react&apos;;
import { cn } from '@/lib/utils&apos;;

interface FormLayoutProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm&apos; | 'md&apos; | 'lg';
}

export function FormLayout({ 
  children, 
  className, 
  columns = 1, 
  gap = 'md&apos; 
}: FormLayoutProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      'grid&apos;,
      gridCols[columns],
      gapClass[gap],
      className
    )}>
      {children}
    </div>
  );
}
