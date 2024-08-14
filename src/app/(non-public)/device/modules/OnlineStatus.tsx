import React from "react";
import { Badge } from "@/components/ui/badge";

interface OnlineStatusProps {
    isOnline: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline }) => {
    const badgeColor = isOnline ? "bg-green-500" : "bg-red-500";
    const statusText = isOnline ? "在线" : "离线" ;

    return <Badge className={badgeColor}>{statusText}</Badge>;
};

export default OnlineStatus;
