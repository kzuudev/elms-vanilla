"use client";

import { useContext } from "react";
import { EmployeeAnalyticsContext } from "@/features/context/analytics/EmployeeAnalyticsContext.tsx";
import { ManagerAnalyticsContext} from "@/features/context/analytics/ManagerAnalyticsContext.tsx";
import {AdminAnalyticsContext} from "@/features/context/analytics/AdminAnalyticsContext.tsx";
import {AuthContext} from "@/features/context/auth/AuthContext.tsx";

import { Card } from '@/components/ui/card.tsx';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function MonthlyLeavesConsumption() {

    const { user } = useContext(AuthContext);

    const managerAnalytics = useContext(ManagerAnalyticsContext);
    const adminAnalytics = useContext(AdminAnalyticsContext);
    const employeeAnalytics = useContext(EmployeeAnalyticsContext);

    const role = user.role || null;

    const isManager  = role === 'manager';
    const isAdmin = role === 'admin';




    // Array blueprint to ensure all 12 months render beautifully even with sparse DB data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Map and pad the database results against the full calendar year
    const chartData = months.map(month => {
        if (isManager) {
            const matchMonth = managerAnalytics?.monthlyLeaveConsumption?.filter(
                (item: any) => item.month_name?.substring(0, 3).toLowerCase() === month.toLowerCase()
            );

            const totalDaysUsed = matchMonth?.reduce((acc: number, item: any) =>
                acc + Number(item.total_used_days), 0) || 0;

            return {
                month: month,
                "Days Used": matchMonth ? Number(totalDaysUsed) : 0
            };
        }else if (isAdmin) {
            const matchMonth = adminAnalytics?.monthlyLeaveConsumption?.filter(
                (item: any) => item.month_name?.substring(0, 3).toLowerCase() === month.toLowerCase()
            );

            const totalDaysUsed = matchMonth?.reduce((acc: number, item: any) =>
                acc + Number(item.total_used_days), 0) || 0;

            return {
                month: month,
                "Days Used": matchMonth ? Number(totalDaysUsed) : 0
            };
        }

        const matchMonth = employeeAnalytics.monthlyLeaveConsumption?.find(
            (item: any) => item.month_name?.substring(0, 3).toLowerCase() === month.toLowerCase()
        );

        return {
            month: month,
            "Days Used": matchMonth ? Number(matchMonth.total_used_days) : 0
        };
    });



    return (
        <Card className="w-full p-5 border-gray-200 shadow-sm rounded-xl bg-white flex flex-col gap-4">
            {/* Header matches your dashboard mockup pattern */}
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-gray-900">Utilization Trend</h3>
                <p className="text-xs text-gray-400">Monthly breakdown of leave days consumed</p>
            </div>

            {/* Chart Container */}
            <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        barSize={16} // Keeps bars elegantly slim like high-end dashboards
                    >
                        {/* Soft, light horizontal grid lines only */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                        {/* X-Axis styling matches enterprise guidelines */}
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                        />

                        {/* Y-Axis hiding structural lines for a floating look */}
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            allowDecimals={false}
                        />

                        {/* Custom modern tooltip wrapper */}
                        <Tooltip
                            cursor={{ fill: '#f8fafc', radius: 4 }}
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                borderRadius: '8px',
                                border: 'none',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}
                        />

                        {/* The actual Bar matched to your primary dark blue palette theme */}
                        <Bar
                            dataKey="Days Used"
                            fill="#0a3977"
                            radius={[4, 4, 0, 0]} // Distinctly rounds only the top corners
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}