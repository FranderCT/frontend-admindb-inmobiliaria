/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/extractServerErrors.ts
type ServerErrorShape =
  | {
    message?: string | string[];
    error?: string;
    statusCode?: number;
    errors?: Array<{ field?: string; message: string }>;
    fieldErrors?: Record<string, string>;
    [k: string]: any;
  }
  | Record<string, any>;

export function extractServerErrors(err: unknown): {
  formError?: string;
  fieldErrors: Record<string, string>;
} {
  const axiosData = (err as any)?.response?.data as ServerErrorShape | undefined;

  const fallback = {
    formError: "Ocurrió un error al procesar la solicitud.",
    fieldErrors: {} as Record<string, string>,
  };

  if (!axiosData) return fallback;

  // 1) { fieldErrors: {...} } plano
  if (axiosData && typeof axiosData === "object" && "fieldErrors" in axiosData && axiosData.fieldErrors) {
    return {
      formError: Array.isArray(axiosData.message) ? axiosData.message.join(" | ") : (axiosData.message as string),
      fieldErrors: axiosData.fieldErrors!,
    };
  }

  // 2) Lista de errores [{ field, message }]
  if (axiosData && Array.isArray(axiosData.errors)) {
    const fieldErrors: Record<string, string> = {};
    for (const e of axiosData.errors) {
      if (e?.field) fieldErrors[e.field] = e.message;
    }
    return {
      formError: Array.isArray(axiosData.message) ? axiosData.message.join(" | ") : (axiosData.message as string),
      fieldErrors,
    };
  }

  // 3) Nest ValidationPipe: message es string[] o string
  if (axiosData && "message" in axiosData) {
    const msg = axiosData.message;
    // Heurística: si viene "nombre should not be empty", intenta mapear a 'nombre'
    const fieldErrors: Record<string, string> = {};
    const toText = Array.isArray(msg) ? msg.join(" | ") : (msg as string);

    if (Array.isArray(msg)) {
      for (const m of msg) {
        if (typeof m === "string") {
          const match = m.match(/^(\w+)\s+/); // toma la primera palabra
          if (match && match[1]) {
            const key = match[1];
            if (!fieldErrors[key]) fieldErrors[key] = m;
          }
        }
      }
    }

    return {
      formError: toText,
      fieldErrors,
    };
  }

  // 4) Errores SQL u otros drivers
  if ((axiosData as any)?.code || (axiosData as any)?.number) {
    return {
      formError: (axiosData as any)?.message ?? fallback.formError,
      fieldErrors: {},
    };
  }

  return fallback;
}
