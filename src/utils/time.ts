import {format} from "date-fns";
import {zhCN} from "date-fns/locale";
import {toZonedTime} from "date-fns-tz";

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

/**
 * 提取消息
 * @param value
 */
export const extractText = (value: string | null | undefined) => {
    if (!value) return '';
    return value.replace(/\$.*?\$/g, '');
}

/**
 * 提取数据字符串
 * @param value 字符串
 */
export const extractContent = (value: string) => {
    const regex = /\$(.*?)\$/;
    const match = regex.exec(value);
    return match ? match[1] : '';
}

/**
 * 提取电源电压
 * @param serial_rx 字符串
 */
export const getPowerVoltage = (serial_rx: string) => {
    const value = base64Decode(serial_rx)
    const data = extractContent(value);
    if (!data) return '';
    const content = data.split(';');
    const result = content.find(item => item.startsWith('A3:'));
    return `${result ? (+result.split(':')[1] * 11).toFixed(2) : ''} V`;
}

/**
 * 提取超级电容电压
 * @param serial_rx 字符串
 */
export const getSuperCapVoltage = (serial_rx: string) => {
    const value = base64Decode(serial_rx)
    const data = extractContent(value);
    if (!data) return '';
    const content = data.split(';');
    const result = content.find(item => item.startsWith('A2:'));
    return `${result ? (+result.split(':')[1] * 11).toFixed(2) : ''} V`;
}

/**
 * 获取IO状态
 * @param serial_rx 字符串
 */
export const getIO = (serial_rx: string) => {
    const value = base64Decode(serial_rx)
    const data = extractContent(value);
    if (!data) return '';
    const content = data.split(';');
    const result = content.find(item => item.startsWith('IO:'));
    if (!result) return '';
    const arr = result.split(':')[1].split('')
    let res = ''
    for (let i = 0; i < arr.length; i++) {
        res += `D${i}:${arr[i]}${i !== arr.length - 1 ? ' ' : ''}`
    }
    return res;
}

/**
 * 获取模拟量状态
 * @param serial_rx 字符串
 */
export const getAnalogInput = (serial_rx: string) => {
    const value = base64Decode(serial_rx)
    const data = extractContent(value);
    if (!data) return '';
    const content = data.split(';');
    const a0 = content.find(item => item.startsWith('A0:'));
    const s0 = `A0: ${a0 ? a0.split(':')[1] : ''} V `;
    const a1 = content.find(item => item.startsWith('A1:'));
    const s1 = `A1: ${a1 ? a1.split(':')[1] : ''} V`;
    return s0 + s1;
}