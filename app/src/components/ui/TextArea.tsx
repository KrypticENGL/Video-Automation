import { TextField, type TextFieldProps } from './TextField';

/** Multi-line TextField. Pass maxLength + counter for a character counter. */
export function TextArea(props: Omit<TextFieldProps, 'multiline'>) {
  return <TextField {...props} multiline />;
}
