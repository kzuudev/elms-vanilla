"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    hint?: string;
}


export default function StatCard({ icon, title, value, hint }: StatCardProps) {

    return (
        <>
         <Card>
            <CardHeader>    
                <CardTitle className="text-sm font-medium text-gray-500 mb-6"> {title} </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-xl font-bold">{value}</div>
                        {hint ? (
                            <div className="text-sm font-medium text-gray-500">{hint}</div>
                        ) : null}
                    </div>
                    <div className="text-xl">{icon}</div>
                </div>
            </CardContent>
        </Card>
        </>
    );
}
