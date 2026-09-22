import { Toaster as Sonner } from 'sonner';

const SonnerToaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-soft-lg group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:  'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toaster]:text-green-600',
          error:   'group-[.toaster]:text-red-600',
          warning: 'group-[.toaster]:text-amber-600',
          info:    'group-[.toaster]:text-blue-600',
        },
      }}
      {...props}
    />
  );
};

export { SonnerToaster };
