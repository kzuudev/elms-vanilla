
export type AuditModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    header: string;
    actor: string;
    owner: string;
    subject: string;
    action: string;
    occurred_at: string;
    changes: string;
    details: string;
}