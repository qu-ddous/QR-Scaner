import * as React from 'react';
import { cn } from '@/lib/utils';

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;

const FormField = ({ render, name, control }) =>
  render({ field: { name, value: '', onChange: () => {}, onBlur: () => {} } });

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium text-foreground', className)} {...props} />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} {...props} />
));
FormControl.displayName = 'FormControl';

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) return null;
  return (
    <p ref={ref} className={cn('text-xs font-medium text-destructive', className)} {...props}>
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-muted-foreground', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription };
