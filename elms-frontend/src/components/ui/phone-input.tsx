import PhoneInput, { type Country, type Value } from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import en from "react-phone-number-input/locale/en.json"
import "react-phone-number-input/style.css"

import { cn } from "@/lib/utils"

type PhoneNumberInputProps = {
    id?: string
    name?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    placeholder?: string
    invalid?: boolean
    disabled?: boolean
    className?: string
    defaultCountry?: Country
}

function PhoneNumberInput({
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder = "917 123 4567",
    invalid = false,
    disabled = false,
    className,
    defaultCountry = "PH",
}: PhoneNumberInputProps) {
    return (
        <PhoneInput
            id={id}
            name={name}
            flags={flags}
            labels={en}
            international
            defaultCountry={defaultCountry}
            countryCallingCodeEditable={false}
            addInternationalOption={false}
            limitMaxLength
            disabled={disabled}
            placeholder={placeholder}
            value={(value || undefined) as Value | undefined}
            onChange={(nextValue) => onChange?.(nextValue ?? "")}
            onBlur={onBlur}
            numberInputProps={{
                autoComplete: "tel",
                "aria-invalid": invalid,
            }}
            countrySelectProps={{
                "aria-label": "Country calling code",
            }}
            className={cn(
                "phone-input flex h-8 w-full min-w-0 items-center rounded-lg border border-input bg-transparent transition-colors",
                "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
                invalid && "border-destructive ring-3 ring-destructive/20",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className
            )}
        />
    )
}

export { PhoneNumberInput }
