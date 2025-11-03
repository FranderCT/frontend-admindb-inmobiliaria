// utils/stats.ts
export const monthIndex: Record<string, number> = {
  enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,
  julio:6,agosto:7,setiembre:8,septiembre:8,octubre:9,noviembre:10,diciembre:11,
  january:0,february:1,march:2,april:3,may:4,june:5,
  july:6,august:7,september:8,october:9,november:10,december:11,
}
export const monthsLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export const crc = (v: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(v);
export const intFmt = (v: number) => new Intl.NumberFormat("es-CR").format(v);
export function groupBy<T, K extends string | number>(arr: T[], key: (x: T) => K) {
  return arr.reduce<Record<K, T[]>>((acc, item) => {
    const k = key(item); (acc[k] ||= []).push(item); return acc;
  }, {} as any);
}

export const currency = (v: number) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(v)


export const PALETTE =
    [  "#a8dc94",
      "#8dc179", "#71a55d", "#568a42",
      "#3a6e26", "#1e520a",];