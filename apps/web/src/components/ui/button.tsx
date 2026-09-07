import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-coral-500 text-white shadow-coral hover:bg-coral-600 hover:shadow-coral-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] active:bg-coral-700',
        primary:
          'bg-coral-500 text-white shadow-coral hover:bg-coral-600 hover:shadow-coral-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] active:bg-coral-700',
        secondary:
          'bg-white text-navy-950 border border-border shadow-xs hover:bg-surface-subtle hover:border-border-dark hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] active:bg-surface-muted',
        outline:
          'border border-border text-navy-950 hover:bg-surface-subtle hover:border-border-dark active:bg-surface-muted',
        ghost:
          'text-content-secondary hover:text-navy-950 hover:bg-surface-subtle active:bg-surface-muted',
        danger:
          'bg-danger-50 border border-danger-200 text-danger-600 hover:bg-danger-100 hover:border-danger-300 hover:text-danger-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]',
        success:
          'bg-success-600 text-white shadow-xs hover:bg-success-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]',
      },
      size: {
        default: 'h-10 px-5 py-2 text-xs sm:text-sm rounded-full',
        sm: 'h-8 px-3.5 text-xs rounded-full gap-1.5',
        lg: 'h-12 px-6 text-sm sm:text-base rounded-full gap-2',
        xl: 'h-14 px-8 text-base font-bold rounded-full gap-2.5',
        icon: 'h-9 w-9 p-0 rounded-full',
        'icon-sm': 'h-7 w-7 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0 mr-2" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
