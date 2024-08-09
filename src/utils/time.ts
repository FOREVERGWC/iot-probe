import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const timeZone = 'UTC';

export const formattedDate = (date: any) => {
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN });
};

/**
 * base64字符串解码
 * @param value 字符串
 */
export const base64Encoded = (value: string | null) => {
    if (value === null) {
        return "暂无信息"
    }
    return atob(value);
};
