"use client";

import { useContext, useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts"; // <-- The correct React import!

import { DashboardAnalyticsContext } from "@/features/context/analytics/DashboardAnalyticsContext.tsx";
import type { LeaveOverlap } from "@/types/dashboard.ts";
import {Card} from "@/components/ui/card.tsx";

export default function LeaveOverlapTimeline() {

    const dashboardAnalytics = useContext(DashboardAnalyticsContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const overlapData: LeaveOverlap[] = dashboardAnalytics?.overlap || [];

    const series = useMemo(() => {
        const dataPoints = overlapData.map((item) => {
            const overlapCount = item.overlap?.length || 0;

            let fillColor = "#B8CBE0";
            if (overlapCount > 2) {
                fillColor = "#C05655";
            } else if (overlapCount > 0) {
                fillColor = "#717E93";
            }

            return {
                x: item.department || "Unassigned",
                y: [
                    new Date(item.start_date).getTime(),
                    new Date(item.end_date).getTime()
                ],
                fillColor: fillColor
            };
        });

        return [
            {
                name: "Leave Duration",
                data: dataPoints
            }
        ];
    }, [overlapData]);

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "rangeBar",
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "45%",
                borderRadius: 4,
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: { colors: "#64748B", fontSize: "12px", fontWeight: 500 },
                datetimeUTC: false,
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: "#0F172A", fontWeight: 600, fontSize: "14px" }
            }
        },
        grid: {
            show: true,
            borderColor: "#F1F5F9",
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
        },
        tooltip: {
            theme: "light",
            x: { format: "MMM dd, yyyy" }
        }
    }), []);

    return (
        <>
            <Card>
                <div className="w-full bg-white px-3">

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Leave Overlap</h3>
                            <p className="text-sm text-gray-500 mt-1">Upcoming critical periods</p>
                        </div>
                        {/*<button className="text-sm font-semibold text-[#0a3977] hover:text-blue-800 transition-colors">*/}
                        {/*    Full Timeline*/}
                        {/*</button>*/}
                    </div>

                    <div className="w-full min-h-[220px]">
                        {overlapData.length > 0 ? (
                            <Chart
                                options={options}
                                series={series}
                                type="rangeBar"
                                height={260}
                            />
                        ) : (
                            <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                No upcoming overlapping leaves found.
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 items-center mt-6 text-sm font-medium text-gray-900 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-[#C05655] block"></span> High Overlap
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-[#717E93] block"></span> Moderate
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-[#B8CBE0] block"></span> Low
                        </div>
                    </div>

                </div>
            </Card>
        </>
    );
}