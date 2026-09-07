import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-semibold transition-colors focus:outline-none select-none',
  {
    variants: {
      variant: {
        default:
          'bg-coral-50 text-coral-700 border border-coral-200/80',
        coral:
          'bg-coral-50 text-coral-700 border border-coral-200/80',
        solidCoral:
          'bg-coral-500 text-white shadow-xs',
        success:
          'bg-success-50 text-success-700 border border-success-200',
        warning:
          'bg-warning-50 text-warning-700 border border-warning-200',
        danger:
          'bg-danger-50 text-danger-700 border border-danger-200',
        info:
          'bg-info-50 text-info-700 border border-info-200',
        neutral:
          'bg-surface-subtle text-navy-800 border border-border',
        outline:
          'bg-transparent text-content-secondary border border-border',
      },
      size: {
        default: 'px-2.5 py-0.5 text-[11px] rounded-full',
        sm: 'px-2 py-0.5 text-[10px] rounded-full',
        lg: 'px-3 py-1 text-xs rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
