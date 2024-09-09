export function injector(str) {
    if (str.includes(";") || str.includes("=") ||
        str.includes("drop") || str.includes("DROP") || 
        str.includes("truncate") || str.includes("TRUNCATE") ||
        str.includes("table") || str.includes("TABLE") ||
        str.includes("alter") || str.includes("ALTER") ||
        str.includes("insert") || str.includes("INSERT") ||
        str.includes("delete") || str.includes("DELETE") ||
        str.includes("grant") || str.includes("GRANT") ||
        str.includes("update") || str.includes("UPDATE")) {
            return true
        }
    return false
}