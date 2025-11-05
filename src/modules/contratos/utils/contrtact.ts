
export const toTextBlock = (arr?: { textoCondicion: string }[] | string[]) =>
  Array.isArray(arr)
    ? (typeof arr[0] === "string"
      ? (arr as string[]).join("\n")
      : (arr as { textoCondicion: string }[]).map(c => c.textoCondicion).join("\n"))
    : "";
