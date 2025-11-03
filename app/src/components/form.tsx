import {
	createFormHook,
	createFormHookContexts,
	useStore,
} from "@tanstack/react-form";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	Description,
	type DescriptionProps,
} from "~/components/ui/description";
import { FieldError, type FieldErrorProps } from "~/components/ui/field-error";
import { Input, type InputProps } from "~/components/ui/input";
import { Label, type LabelProps } from "~/components/ui/label";
import { Note, type NoteProps } from "~/components/ui/note";
import { Spinner } from "~/components/ui/spinner";
import { TextField, type TextFieldProps } from "~/components/ui/text-field";
import { TextArea, type TextAreaProps } from "~/components/ui/textarea";

const {
	fieldContext,
	formContext,
	useFieldContext: _useFieldContext,
	useFormContext,
} = createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		Description: ({ ...props }: DescriptionProps) => {
			const { descriptionId } = useFormField();

			return <Description id={descriptionId} {...props} />;
		},
		FieldError: ({ ...props }: FieldErrorProps) => {
			const { state, messageId } = useFormField();

			return (
				<FieldError id={messageId} {...props}>
					{state.meta.errors.join(", ")}
				</FieldError>
			);
		},
		Input: ({ ...props }: InputProps) => {
			const {
				id,
				descriptionId,
				labelId,
				name,
				handleBlur,
				handleChange,
				state,
			} = useFormField();

			return (
				<Input
					id={id}
					name={name}
					aria-describedby={descriptionId}
					aria-labelledby={labelId}
					onBlur={handleBlur}
					onChange={(e) => handleChange(e.target.value)}
					value={state.value}
					{...props}
				/>
			);
		},
		Label: ({ ...props }: LabelProps) => {
			const { id, isInvalid, labelId } = useFormField();

			return (
				<Label id={labelId} isInvalid={isInvalid} htmlFor={id} {...props} />
			);
		},
		TextArea: ({ ...props }: TextAreaProps) => {
			const {
				id,
				descriptionId,
				labelId,
				name,
				handleBlur,
				handleChange,
				state,
			} = useFormField();

			return (
				<TextArea
					id={id}
					aria-describedby={descriptionId}
					aria-labelledby={labelId}
					name={name}
					onBlur={handleBlur}
					onChange={(e) => handleChange(e.target.value)}
					value={state.value}
					{...props}
				/>
			);
		},
		TextField: ({ ...props }: TextFieldProps) => {
			const { id, name, handleBlur, handleChange, state } = useFormField();

			return (
				<TextField
					id={id}
					isInvalid={props.isInvalid || state.meta.errors.length > 0}
					name={name}
					onBlur={handleBlur}
					onChange={(value) => handleChange(value)}
					validationBehavior="aria"
					value={state.value}
					{...props}
				/>
			);
		},
	},
	formComponents: {
		Button: (props: ButtonProps) => {
			const form = useFormContext();

			return (
				<form.Subscribe
					selector={(state) => [
						state.canSubmit,
						state.isSubmitting,
						state.isFormValidating,
					]}
				>
					{([canSubmit, isSubmitting, isFormValidating]) => (
						<Button
							type="submit"
							isDisabled={!canSubmit}
							isPending={props.isPending || isSubmitting || isFormValidating}
							{...props}
						>
							{(values) => (
								<>
									{typeof props.children === "function" ? (
										props.children(values)
									) : (
										<>
											{values.isPending && <Spinner className="size-4" />}
											{props.children}
										</>
									)}
								</>
							)}
						</Button>
					)}
				</form.Subscribe>
			);
		},
		ErrorMessages: (props: NoteProps) => {
			const { store } = useFormContext();
			const formErrors = useStore(store, (formState) => formState.errors);

			const errors = formErrors
				.filter((error) => typeof error === "string" || Array.isArray(error))
				.flat();

			if (errors.length <= 0) {
				return null;
			}

			return (
				<Note intent="danger" {...props}>
					{errors.join("\n")}
				</Note>
			);
		},
	},
	fieldContext,
	formContext,
});

function useFormField<TValue = string>() {
	const { name, state, ...fieldContext } = _useFieldContext<TValue>();
	const { formId } = useFormContext();

	if (!fieldContext) {
		throw new Error("useFieldContext should be used within <FormItem>");
	}

	return {
		id: `${formId}-${name}`,
		name,
		descriptionId: `${formId}-${name}-description`,
		labelId: `${formId}-${name}-label`,
		messageId: `${formId}-${name}-message`,
		isInvalid: !state.meta.isValid,
		state,
		...fieldContext,
	};
}
