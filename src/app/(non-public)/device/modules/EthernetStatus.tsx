import React from "react";
import { Badge } from "@/components/ui/badge";

interface EthernetStatusProps {
    ethernet: number | null | undefined;
}

const EthernetStatus: React.FC<EthernetStatusProps> = ({ ethernet }) => {
    let badgeColor = "bg-yellow-500";
    let badgeText = "未知";

    if (ethernet === -1) {
        badgeColor = "bg-green-500";
        badgeText = "正常";
    } else if (ethernet) {
        badgeColor = "bg-red-500";
        badgeText = "异常";
    }

    return <Badge className={badgeColor}>{badgeText}</Badge>;
};

export default EthernetStatus;
