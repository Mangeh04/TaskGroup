import { z } from "zod";

export type FormHandlerSuccess<T> = {
	success: true;
	data: T;
};

export type FormHandlerError = {
	success: false;
	errors: z.core.$ZodIssue[];
};

export type FormHandlerResult<T> = FormHandlerSuccess<T> | FormHandlerError;

/**
 * Validates a FormData object against a Zod schema.
 * @param {FormData} [data] - The data from the form.
 * @param {z.ZodTypeAny} [schema] - The Zod schema to validate against.
 * @returns An object indicating success with parsed data or failure with validation errors.
 */
export function handleFormValidation<T extends z.ZodTypeAny>(
	data: FormData,
	schema: T
): FormHandlerResult<z.infer<T>> {
	try {
		const parsed = schema.parse(Object.fromEntries(data.entries()));
		return { success: true, data: parsed };
	} catch (err) {
		if (err instanceof z.ZodError) {
			return { success: false, errors: err.issues };
		}

		const $ZodIssue: z.core.$ZodIssue = {
			code: "custom",
			message: "An unknown error occurred during form validation.",
			path: [],
		};

		return { success: false, errors: [$ZodIssue] };
	}
}
