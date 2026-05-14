export interface ButtonProps {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
  className?: string;
}
