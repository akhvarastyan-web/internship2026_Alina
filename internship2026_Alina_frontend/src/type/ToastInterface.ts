export type ToastType = 'success' | 'warning' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
}
