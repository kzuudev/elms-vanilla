import type {TeamAvailability} from "@/types/dashboard.ts";


export const dotColor = (team: boolean) => {

   return team ? "bg-green-500" : "bg-red-500"
}