
export function formatDate(iso?: string) {
    if (!iso) return '—'
    const d = new Date(iso)
    // dd/mm/yyyy
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}