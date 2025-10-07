export const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: currency === "CRC" ? "CRC" : "USD",
        minimumFractionDigits: 0,
    }).format(price)
}