export type Notification = {
    id: number;
    title: string;
    type: string;
    message: string;
    created_at: string;
    read_at: string | null;
    data: Record<string, any>;
}