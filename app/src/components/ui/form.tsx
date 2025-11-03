import { Form as FormPrimitive, type FormProps } from "react-aria-components";

export function Form({ ...props }: FormProps) {
	return <FormPrimitive {...props} />;
}
