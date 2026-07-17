

export const isOnLeave = ({start_date: startDay, end_date: endDay, leave_status: status}) => {


    const start = new Date(startDay);
    const end = new Date(endDay);

    if(isNaN(start.getTime()) || isNaN(end.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);


    const isApproved = status === "approved";
    const isTodayWithinLeave = today >= start && today <= end;

    return isApproved && isTodayWithinLeave;

}

export const validateDate = ({start_date: startDay, end_date: endDay}) => {

     return !(isNaN(startDay.getTime()) || isNaN(endDay.getTime()));
}
