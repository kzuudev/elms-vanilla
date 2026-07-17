"use client";

import {useContext} from "react";

import {EmployeeAnalyticsContext} from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";

import { Card } from '@/components/ui/card.tsx';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
export default function BalanceBreakDownChart() {

    const {totalRemainingBalance, totalPendingRequest, totalUsedDays} = useContext(EmployeeAnalyticsContext);

    const remaining = parseFloat(totalRemainingBalance?.[0].grand_total);
    const pending = parseFloat(totalPendingRequest?.[0].total_days);
    const used = parseFloat(totalUsedDays?.[0].total_used_days);

    const data = [
        { name: 'Remaining', value: remaining, color: '#1E3A8A' }, // Dark Blue
        { name: 'Pending', value: pending, color: '#DBEAFE' },     // Light Blue
        { name: 'Used', value: used, color: '#6B7280' },           // Gray
    ]

    // calculate the data
    const total = remaining + pending + used;

    // @ts-expect-error
    const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;

    return (
        <>
            <Card className="w-full p-4">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900 w-full text-left mb-4">Balance Breakdown</h3>

                    {/* Chart Container - Relative positioning allows us to center the text inside the donut */}
                    <div className="relative w-full h-48">

                        {/* The absolutely positioned center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
                            <span className="text-xs text-gray-500 font-medium mt-1">Remaining</span>
                        </div>

                        {/* The Recharts Donut */}
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend matching your design */}
                    <div className="flex justify-evenly  w-full mt-6 text-sm">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">{item.name}</span>
                                    <span className="font-semibold text-gray-900">({item.value})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    )
}
