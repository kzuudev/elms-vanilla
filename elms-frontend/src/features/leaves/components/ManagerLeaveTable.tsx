'use client'

import {useState } from "react";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import PersonalLeavesTable from "@/features/leaves/components/PersonalLeavesTable.tsx";
import ReviewerLeaveTable from "@/features/leaves/components/ReviewerLeaveTable.tsx";


export default function ManagerLeaveTable() {

    const [activeTab, setActiveTab] = useState('assigned_leaves');


    return (
        <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
                <TabsList>
                    <TabsTrigger value="assigned_leaves">Assigned Leaves</TabsTrigger>
                    <TabsTrigger value="personal_leaves">Personal Leaves</TabsTrigger>
                </TabsList>

                <TabsContent value="assigned_leaves">
                    {activeTab === 'assigned_leaves' && (
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
    )
}