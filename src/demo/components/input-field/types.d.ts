interface InputFieldOptions {
  title?: string;
  value?: number;
  type?: string;
  handleInputChange?: (value: number) => void;
}

interface InputUpdate {
  value?: number,
  step?: number,
  min?: number,
}
