import { z } from "zod";

export const asNumber = (requiredMsg: string) =>
  z.preprocess(
    (v) => (v ?? ""), 
    z.union([z.string(), z.number()])
      .transform((v) => {
        if (typeof v === "number") return v;
        const t = v.trim();
        if (t === "") return NaN;
        const n = Number(t);
        return Number.isNaN(n) ? NaN : n;
      })
      .refine((n) => !Number.isNaN(n), requiredMsg)
  );

export const requiredInt = (msg: string) =>
  asNumber(msg)
    .refine((n) => Number.isInteger(n), "Debe ser un número entero")
    .refine((n) => n > 0, "Debe ser mayor a 0");

export const requiredMoneyGE1 = (msg: string) =>
  asNumber(msg).refine((n) => n >= 1, msg);

export const requiredPercent = (msg: string) =>
  asNumber(msg)
    .refine((n) => n >= 0, "No puede ser negativo")
    .refine((n) => n <= 100, "No puede ser mayor a 100");

export const asBoolean = z.preprocess(
  (v) => (v === 1 || v === "1" || v === true ? true : false),
  z.boolean()
);

export const emptyToUndef = z
  .string()
  .transform((s) => (s.trim() === "" ? undefined : s.trim()))
  .optional();
