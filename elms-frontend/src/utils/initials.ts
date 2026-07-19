
export const initials = (name: string) => name.split('').map(c => c.toUpperCase()).join('').substring(0, 2);