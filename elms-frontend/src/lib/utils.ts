import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {parsePhoneNumberFromString} from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatE164(number: string) {

  const phoneNumber = parsePhoneNumberFromString(number, 'PH');
  return phoneNumber && phoneNumber.isValid() ? phoneNumber.number : null;
}

