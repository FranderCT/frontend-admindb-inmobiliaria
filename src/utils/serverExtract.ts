// utils/extractServerErrors.ts
type ServerErrorShape =
  | { message?: string; errors?: Array<{ field?: string; message: string }>; fieldErrors?: Record<string, string> }
  | Record<string, any>;

export function extractServerErrors(err: unknown): {
  formError?: string;
  fieldErrors: Record<string, string>;
} {
  const axiosData = (err as any)?.response?.data as ServerErrorShape | undefined;

  // Fallback a mensaje general coherente
  const fallback = {
    formError: "Ocurrió un error al procesar la solicitud.",
    fieldErrors: {} as Record<string, string>,
  };

  if (!axiosData) return fallback;

  // 1) Si viene como fieldErrors plano
  if (typeof axiosData === "object" && "fieldErrors" in axiosData && axiosData.fieldErrors) {
    return {
      formError: axiosData.message,
      fieldErrors: axiosData.fieldErrors!,
    };
  }

  // 2) Lista de errores con { field, message }
  if (typeof axiosData === "object" && "errors" in axiosData && Array.isArray(axiosData.errors)) {
    const fieldErrors: Record<string, string> = {};
    for (const e of axiosData.errors!) {
      if (e.field) fieldErrors[e.field] = e.message;
    }
    return {
      formError: axiosData.message,
      fieldErrors,
    };
  }

  // 3) message simple (error general)
  if (typeof axiosData === "object" && "message" in axiosData && typeof axiosData.message === "string") {
    return { formError: axiosData.message, fieldErrors: {} };
  }

  // 4) Errores SQL u otros
  if ((axiosData as any)?.code || (axiosData as any)?.number) {
    return {
      formError: (axiosData as any)?.message ?? fallback.formError,
      fieldErrors: {},
    };
  }

  return fallback;
}
