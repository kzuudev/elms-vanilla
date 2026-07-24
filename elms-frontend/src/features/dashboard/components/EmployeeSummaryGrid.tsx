"use client";

import {useContext} from "react";


import { Card } from "@/components/ui/card.tsx";
import { Users, UserCheck, Calendar, UserRoundX } from "lucide-react";
import {SummaryEmployeeContext} from "@/features/context/employees/SummaryEmployeesContext.tsx";


export default function EmployeeSummaryGrid() {

    const { employeeSummary } = useContext(SummaryEmployeeContext);


    const summaryCards = [
        {
            title: "Total Employees",
            value: employeeSummary?.total_employees ?? 0,
            change: "+15% from last month",
            isPositive: true,
            icon: Users,
            iconBg: "bg-blue-50 border-blue-100",
            iconColor: "text-blue-500",
        },
        {
            title: "Active Employees",
            value: employeeSummary?.total_active_employees ?? 0,
            change: "+12% from last month",
            isPositive: true,
            icon: UserCheck,
            iconBg: "bg-emerald-50 border-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            title: "On Leave",
            value: employeeSummary?.total_on_leave_employees ?? 0,
            change: "+2 from last month",
            isPositive: true,
            icon: Calendar,
            iconBg: "bg-amber-50 border-amber-100",
            iconColor: "text-amber-500",
        },
        {
            title: "Inactive Employees",
            value: employeeSummary?.total_inactive_employees ?? 0,
            change: "+3% from last month",
            isPositive: false,
            icon: UserRoundX,
            iconBg: "bg-rose-50 border-rose-100",
            iconColor: "text-rose-500",
        },
    ];

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => {
                const IconComponent = card.icon;

                return (
                    <Card
                        key={index}
                        className="w-full p-5 border-slate-100 bg-white shadow-sm rounded-2xl flex flex-col justify-between gap-3"
                    >
                        {/* Header: Title & Circular Badge */}
                        <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-500">
                                {card.title}
                              </span>
                            <div
                                className={`w-10 h-10 rounded-full border flex items-center justify-center ${card.iconBg}`}
                            >
                                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>

                        {/* Content: Value & Subtext */}
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {card.value}
                            </h3>
                            <p
                                className={`text-xs font-medium mt-2 ${
                                    card.isPositive ? "text-emerald-600" : "text-rose-600"
                                }`}
                            >
                                {card.change}
                            </p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}