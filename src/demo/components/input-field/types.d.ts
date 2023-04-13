interface InputFieldOptions {
  title?: string;
  value?: number;
  type?: string;
  handleChange?: (value: number) => void;
}

interface InputUpdate {
  value?: number;
  step?: number;
  min?: number;
}

export {
  InputFieldOptions,
  InputUpdate,
};
