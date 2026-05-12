'use client'

import { Card } from '@/components/ui/card'
import { Activity, Plane, Leaf, Users } from 'lucide-react'

import type {LeaveBalance } from "@/types/leave.ts";

const leaveBalances: LeaveBalance[]   = [
    {
        type: 'Sick Leave',
        icon: <Activity className="w-6 h-6 text-orange-500" />,
        balance: 2,
        used:3,
        total: 5,
    },
    {
        type: 'Annual Leave',
        icon: <Leaf className="w-6 h-6 text-orange-500" />,
        balance: 2,
        used:3,
        total: 5,
    },
    {
        type: 'Paternity Leave',
        icon: <Users className="w-6 h-6 text-orange-500" />,
        balance: 2,
        used:3,
        total: 5,
    },
    {
        type: 'Maternity Leave',
        icon: <Users className="w-6 h-6 text-orange-500" />,
        balance: 2,
        used:3,
        total: 5,
    }

]
export default function LeaveBalanceSection() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveBalances.map((leaveBalance, index) => (
                <Card key={index} className="px-4">
                    <div className="flex flex-col justify-between mb-4">
                        <div className="flex items-center justify-between">
                            <div className="mb-5">
                                <h3 className="text-sm mb-1">{leaveBalance.type}</h3>
                                <h4 className="text-gray-500 text-[12px]">{leaveBalance.balance} remaining</h4>
                            </div>

                            {leaveBalance.icon}
                        </div>
                        <span className="text-sm text-gray-500"><span className="text-black">{leaveBalance.used}/{leaveBalance.total}</span> Days Used</span>
                    </div>
                </Card>
            ))}
        </div>
    )
}
