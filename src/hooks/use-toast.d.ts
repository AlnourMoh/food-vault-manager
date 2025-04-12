
export interface Toast {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

export interface ToastAPI {
  (props: { title?: string; description?: React.ReactNode; action?: ToastActionElement; variant?: "default" | "destructive" }): void;
  dismiss(toastId: string): void;
}

export interface ToastProps extends React.ComponentPropsWithoutRef<"div"> {
  toast: Toast;
  className?: string;
}
