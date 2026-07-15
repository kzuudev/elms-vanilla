"use client";


"use client";

import { useContext } from "react";
import { format } from "date-fns";
import { LeaveSummaryContext } from "@/features/context/analytics/LeaveSummaryContext.tsx";
import {DashboardAnalyticsContext} from "@/features/context/analytics/DashboardAnalyticsContext.tsx";
import {UserContext} from "@/features/context/UserContext.tsx";
import type {EmployeeRecentActivityData} from "@/types/dashboard.ts";

import { Card } from "@/components/ui/card.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";


export default function RecentActivityTable() {

    // const { recentActivity } = useContext(LeaveSummaryContext);
    const {user} = useContext(UserContext);

    const employeeAnalytics = useContext(LeaveSummaryContext);
    const managementAnalytics = useContext(DashboardAnalyticsContext);

    const role = user.role || null;

    const tableHeaders = ["Date", "Type", "Duration", "Status"];
    const ManagerTableHeaders = ["Date", "Team Member", "Recent Activity"];


    function formatActivityData(data: EmployeeRecentActivityData[]) {
        return data?.map((activity) => {

            let activityText = "";
            if (activity.leave_status === "approved") {
                activityText = `${activity.employee_name} ${activity.leave_type} was approved.`;
            } else if (activity.leave_status === "pending") {
                activityText = `${activity.employee_name} Requested ${activity.leave_type}.`;
            } else if (activity.leave_status === "rejected") {
                activityText = `${activity.employee_name} ${activity.leave_type} request was denied.`;
            }

            return {
                id: activity.id,
                date: activity.created_at ? format(new Date(activity.created_at), "MMMM dd, yyyy") : "",
                member_name: activity.employee_name,
                recent_activity: activityText,
            };
        });
    }

    const recentActivityData = formatActivityData(managementAnalytics?.recentActivity)

    return (
      <>
          {role !== 'manager' && role !== 'admin' ? (
              <Card className="w-full flex flex-col shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center px-3 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                      <button className="text-sm font-semibold text-blue-800 hover:text-blue-900">
                          View All
                      </button>
                  </div>

                  <Table>
                      <TableHeader className="bg-gray-50/50">
                          <TableRow className="border-b border-border hover:bg-transparent">
                              {tableHeaders.map((header, index) => (
                                  <TableHead key={index} className="text-gray-600 font-semibold py-3 h-auto">
                                      {header}
                                  </TableHead>
                              ))}
                          </TableRow>
                      </TableHeader>

                      <TableBody>
                          {/* Guard against null with a ternary operator or loading check */}
                          {!employeeAnalytics?.recentActivity ? (
                              <TableRow>
                                  <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                      Loading recent activity...
                                  </TableCell>
                              </TableRow>
                          ) : employeeAnalytics?.recentActivity.length === 0 ? (
                              <TableRow>
                                  <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                      No recent leave requests found.
                                  </TableCell>
                              </TableRow>
                          ) : (
                              employeeAnalytics?.recentActivity.slice(0, 5).map((leave) => ( // .slice(0,5) limits it to 5 rows so the card doesn't get too long!
                                  <TableRow key={leave.id} className="border-b border-gray-100">

                                      {/* Date formatting matching "Oct 15 - Oct 20" */}
                                      <TableCell className="text-gray-900">
                                          {leave.request_date === leave.return_date
                                              ? format(new Date(leave.request_date), 'MMM dd')
                                              : `${format(new Date(leave.request_date), 'MMM dd')} - ${format(new Date(leave.return_date), 'MMM dd')}`
                                          }
                                      </TableCell>

                                      <TableCell className="text-gray-900">{leave.leave_type_name}</TableCell>

                                      <TableCell className="text-gray-900">
                                          {leave.total_days} {leave.total_days > 1 ? 'Days' : 'Day'}
                                      </TableCell>

                                      {leave.request_status === "pending" ? (
                                          <TableCell><span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                      ) : leave.request_status === "approved" ? (
                                          <TableCell><span className="bg-green-50 text-green-700 border border-green-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                      ) : (
                                          <TableCell><span className="bg-red-50 text-red-700 border border-red-200/60 px-2 py-1 rounded-full text-xs font-medium capitalize">{leave.request_status}</span></TableCell>
                                      )}
                                  </TableRow>
                              ))
                          )}
                      </TableBody>
                  </Table>
              </Card>
          ): role === 'manager' ? (
              <Card className="w-full flex flex-col shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center px-3 border-b border-gray-100">
                      <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h2>
                  </div>

                  {/* The Table Format */}
                 <ScrollArea className="h-[300px] w-full">
                     <Table>
                         <TableHeader className="bg-gray-50/50">
                             <TableRow className="border-b border-border hover:bg-transparent">
                                 {ManagerTableHeaders.map((header, index) => (
                                     <TableHead key={index} className="text-gray-600 font-semibold py-3 h-auto">
                                         {header}
                                     </TableHead>
                                 ))}
                             </TableRow>
                         </TableHeader>

                         <TableBody>
                             {/* Guard against null with a ternary operator or loading check */}
                             {!managementAnalytics?.recentActivity || !managementAnalytics?.recentActivity ? (
                                 <TableRow>
                                     <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                         Loading recent activity...
                                     </TableCell>
                                 </TableRow>
                             ) : managementAnalytics?.recentActivity.length === 0 ? (
                                 <TableRow>
                                     <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
                                         No recent activity found.
                                     </TableCell>
                                 </TableRow>
                             ) : (
                                 recentActivityData?.slice(0, 7).map((activity) => (
                                     <TableRow key={activity.id} className="border-b border-gray-100">

                                         <TableCell className="py-4 px-4 text-gray-900 whitespace-nowrap">
                                             {activity.date}
                                         </TableCell>

                                         <TableCell className="py-4 px-4 text-gray-900 font-medium">
                                             {activity.member_name}
                                         </TableCell>

                                         <TableCell className="py-4 px-4 text-gray-600">
                                             {activity.recent_activity}
                                         </TableCell>
                                     </TableRow>
                                 ))
                             )}
                         </TableBody>
                     </Table>
                 </ScrollArea>
              </Card>
          ) : null}
      </>
    );
}