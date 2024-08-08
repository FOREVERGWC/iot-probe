import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const timeZone = 'UTC';

export const formattedDate = (date: any) => {
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN });
};
