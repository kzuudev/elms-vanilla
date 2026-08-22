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
                <CardTitle> {title} </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold"> {value} </div>
                    <div className="text-sm text-gray-500"> {icon} </div>
                    <div className="text-sm text-gray-500"> {hint} </div>
                </div>
            </CardContent>
        </Card>
        </>
    );
}
