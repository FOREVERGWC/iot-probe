import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const timeZone = 'UTC';

/**
 * 时间格式转换
 * @param date 时间
 */
export const formattedDate = (date: any) => {
    if (!date) {
        return ''
    }
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN });
};

/**
 * base64字符串解码
 * @param value 字符串
 */
export const base64Decode = (value: string | null| undefined) => {
    if (!value) {
        return ""
    }
    try {
        const decodedValue = atob(value);
        const textDecoder = new TextDecoder("utf-8");
        const decodedArray = new Uint8Array(
            Array.from(decodedValue).map(char => char.charCodeAt(0))
        );
        return textDecoder.decode(decodedArray);
    } catch (e) {
        return "";
    }
};

/**
 * base64字符串编码
 * @param value 字符串
 */
export const base64Encode = (value: string): string => {
    if (!value) {
        return '';
    }
    try {
        const utf8Value = encodeURIComponent(value)
            .replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
        return btoa(utf8Value);
    } catch (e) {
        return '';
    }
};
