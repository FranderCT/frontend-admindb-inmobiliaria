
export const fmtCRC = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(n)
    : "—";
