'use client'

import { useState } from "react";
import {useContext} from "react";
import {LeaveBalanceContext} from "@/features/context/LeaveBalanceContext.tsx";


import { Card } from '@/components/ui/card.tsx'
import {
    Activity,
    Leaf,
    Users,
    Flower,
    CalendarHeart,
    Scale,
    Clock,
    Compass,
    Stethoscope,
    CalendarDays
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";


// helper function for look up the icon for each leave type
const getLeaveIcon = (leaveType: string) => {
    const leaveIcon: Record<string, React.ReactNode> = {
        "Sick Leave": <Activity className="text-orange-500 w-5 h-5" />,
        "Annual Leave": <Leaf className="text-orange-500 w-5 h-5" />,
        "Maternity Leave": <Users className="text-orange-500 w-5 h-5" />,
        "Paternity Leave": <Users className="text-orange-500 w-5 h-5" />,

        "Bereavement Leave": <Flower className="text-gray-500 w-5 h-5" />,
        "Public Holidays": <CalendarHeart className="text-gray-500 w-5 h-5" />,
        "Court Leave": <Scale className="text-gray-500 w-5 h-5" />,
        "Compensatory Off Leave": <Clock className="text-gray-500 w-5 h-5" />,
        "Sabbatical Leave": <Compass className="text-gray-500 w-5 h-5" />,
        "Extended Medical Leave": <Stethoscope className="text-gray-500 w-5 h-5" />
    }

    return leaveIcon[leaveType] || <CalendarDays className="text-gray-400 w-5 h-5" />;
}

export default function LeaveBalanceSection() {

    const {leaveBalance} = useContext(LeaveBalanceContext);

    const [shownLeaveTypes, setShownLeaveTypes] = useState<boolean>(false)

    const filteredLeaveTypes = shownLeaveTypes ? leaveBalance : leaveBalance.slice(0, 4);

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <span className="text-sm text-gray-500">
                    <Button onClick={() => setShownLeaveTypes(!shownLeaveTypes)} variant="outline" className="p-2">
                                    {shownLeaveTypes ? 'Show Less' : 'Show All'}
                    </Button>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredLeaveTypes.map((balance, index) => (
                    <Card key={index} className="px-4">
                        <div className="flex flex-col justify-between mb-4">
                            <div className="flex items-center justify-between">
                                <div className="mb-5">
                                    <h3 className="text-sm mb-1">{balance.leave_type}</h3>
                                    <h4 className="text-gray-500 text-[12px]">{balance.remaining_balance} remaining</h4>
                                </div>

                                <div className="p-2 bg-gray-50 rounded-lg">
                                    {getLeaveIcon(balance.leave_type)}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500"><span className="text-black">{balance.used_days}/{balance.total_days}</span> Days Used</span>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}
