import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const formattedDate = (date: any) =>
  format(date, "yyyy年MM月dd日 HH:mm:ss", { locale: zhCN });
