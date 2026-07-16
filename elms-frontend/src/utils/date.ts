
import { format } from "date-fns";

export function formatDate(dateStr: string): string {
    return format(new Date(dateStr), "MMMM dd, yyyy");
}

export function formatDateRange(start: string, end: string): string {
    if (start === end) {
        return format(new Date(start), "MMM dd");
    }
    return `${format(new Date(start), "MMM dd")} - ${format(new Date(end), "MMM dd")}`;
}