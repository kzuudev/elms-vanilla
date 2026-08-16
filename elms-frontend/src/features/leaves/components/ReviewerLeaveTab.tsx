"use client"

import {useState} from "react";

import PersonalLeavesTable from "@/features/leaves/components/PersonalLeavesTable.tsx";
import ReviewerLeaveTable from "@/features/leaves/components/ReviewerLeaveTable.tsx";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function AdminLeaveTable() {

    const [activeTab, setActiveTab] = useState('employee_leaves');

    return (
        <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
                <TabsList>
                    <TabsTrigger value="employee_leaves">Employee Leaves</TabsTrigger>
                    <TabsTrigger value="personal_leaves">Personal Leaves</TabsTrigger>
                </TabsList>
                
            
                <TabsContent value="employee_leaves">
                    {activeTab === 'employee_leaves' && (
                        <ReviewerLeaveTable />
                    )}
                </TabsContent>

                <TabsContent value="personal_leaves">
                    {activeTab === 'personal_leaves' && (
                        <PersonalLeavesTable />
                    )}
                </TabsContent>
            </Tabs>
        </>

    );
}
