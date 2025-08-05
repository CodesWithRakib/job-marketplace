import { format, addDays } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'MMM dd, yyyy');
export const nextWeek = () => addDays(new Date(), 7);