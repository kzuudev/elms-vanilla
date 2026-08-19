
import { format } from "date-fns";

export function formatDate(dateStr: string): string {
    return format(new Date(dateStr), "yyyy-MM-dd");
}

export function formatDateTime(dateStr: string): string {
    if (!dateStr) {
        return "";
    }

    const date = new Date(dateStr.replace(" ", "T"));

    return format(date, "MMM dd, yyyy");
}

export function formatDateRange(start: string, end: string): string {
    if (!start || !end) {
        return "";
    }

    const startDate = new Date(start.replace(" ", "T"));
    const endDate = new Date(end.replace(" ", "T"));

    if (start === end) {
        return format(startDate, "MMM dd");
    }

    return `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`;
}
