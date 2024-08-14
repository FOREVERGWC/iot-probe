"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/ui/empty";
import { api } from "@/utils/trpc";

interface IntranetStatusCardProps {
    deviceId: string;
    intranetArray: string | null | undefined;
    intranetPingArray: string | null | undefined;
    onSuccess?: () => void;
}

interface PingData {
    intranetIP: string;
    speed: string;
    speedLarge: string;
}

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export default function IntranetStatusCard({ deviceId, intranetArray, intranetPingArray, onSuccess }: IntranetStatusCardProps) {
    const existingIps = intranetArray ? intranetArray.split(",") : [];
    const pingData: PingData[] = intranetPingArray ? JSON.parse(intranetPingArray) : [];

    const [showInput, setShowInput] = useState(false);
    const [newIp, setNewIp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { trigger: updateDeviceTrigger } = api.updateDevice.useSWRMutation();

    const completePingData = existingIps.map(ip => {
        const existingPing = pingData.find(ping => ping.intranetIP === ip);
        return existingPing || { intranetIP: ip, speed: "未知", speedLarge: "未知" };
    });

    const handleAddIp = async () => {
        if (!newIp.trim() || existingIps.length >= 3) return;

        if (!ipv4Regex.test(newIp.trim())) {
            setError("无效的 IP 地址格式");
            return;
        }

        const updatedIps = [...existingIps, newIp.trim()];

        await updateDeviceTrigger({
            device_id: deviceId,
            intranet_array: updatedIps.join(","),
        });

        setShowInput(false);
        setNewIp("");
        setError(null);

        if (onSuccess) {
            onSuccess();
        }
    };

    const handleInputBlur = async () => {
        if (newIp.trim()) {
            await handleAddIp();
        }
    };

    return (
        <Card className="row-span-2">
            <CardHeader>
                <CardTitle>内网状态</CardTitle>
                <CardDescription>内网探针记录</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {completePingData.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>IP地址</TableHead>
                                <TableHead>延迟</TableHead>
                                <TableHead>延迟（打包）</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completePingData.map((ping, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{ping.intranetIP}</TableCell>
                                    <TableCell>{ping.speed}</TableCell>
                                    <TableCell>{ping.speedLarge}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyState title="暂无内网探针数据" description="当前无内网探针数据，请添加新的探针记录。" />
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {showInput ? (
                    <>
                        <input
                            className="w-full p-2 border rounded"
                            type="text"
                            placeholder="输入 IP 地址"
                            value={newIp}
                            onChange={(e) => setNewIp(e.target.value)}
                            onBlur={handleInputBlur}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </>
                ) : (
                    existingIps.length < 3 && (
                        <Button onClick={() => setShowInput(true)}>
                            添加内网探针
                        </Button>
                    )
                )}
            </CardFooter>
        </Card>
    );
}
