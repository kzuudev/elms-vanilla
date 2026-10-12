"use client";


import { type AuditModalProps } from "@/types/audit-modal.ts";

import { Button } from "@/components/ui/button.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.tsx";


export default function AuditReportModal({auditModalProps}: {auditModalProps: AuditModalProps}) {

    const { open, setOpen, header, actor, owner, subject, action, occurred_at, changes, details } = auditModalProps;


    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    View the details of the audit report
                </DialogDescription>
                <div className="space-y-1 mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Actor:
                        </h2>
                        <p className="text-sm">{actor}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Owner:
                        </h2>
                        <p className="text-sm">{owner}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Subject:
                        </h2>
                        <p className="text-sm">{subject}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Action:
                        </h2>
                        <p className="text-sm">{action}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Occurred At:
                        </h2>
                        <p className="text-sm">{occurred_at}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Changes:
                        </h2>
                        <p className="text-sm">{changes}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-muted-foreground">
                            Details:
                        </h2>
                        <p className="text-sm">{details}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => auditModalProps.setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}