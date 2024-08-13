"use client";

import { useEffect } from "react";
import { api } from "@/utils/trpc";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "@/components/loading";
import DeviceFormDialog from "@/app/(non-public)/device/modules/DeviceFormDialog";
import { Button } from "@/components/ui/button";

const Row: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => {
    return (
        <div className="flex flex-row justify-between">
            <span className="pr-2 font-medium">{label}</span>
            {children}
        </div>
    );
};

export default function Home() {
    const { data, mutate } = api.devices.useSWR();
    const { trigger: deleteTrigger } = api.deleteDevice.useSWRMutation();

    useEffect(() => {
        const interval = setInterval(() => {
            mutate();
        }, 60000);

        return () => clearInterval(interval);
    }, [mutate]);

    if (!data) {
        return <Loading />;
    }

    const handleDelete = async (deviceId: string) => {
        await deleteTrigger({device_id: deviceId})
        await mutate();
    };

    return (
        <main
            className="grid min-h-screen grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-12 mx-auto">
            <div className="col-span-full">
                <DeviceFormDialog triggerText="添加设备" onSuccess={mutate} />
            </div>
            {data.map((device: any) => (
                <Card key={device.device_id} className="w-full max-w-sm mx-auto">
                    <Link href={`/device/${device.device_id}`}>
                        <CardHeader>
                            <CardTitle className="truncate">{device.device_id}</CardTitle>
                            <CardDescription className="text-center">{device.alias_name || device.device_id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Row label="状态">
                                <Badge
                                    className={device.is_online ? "bg-green-500" : "bg-red-500"}
                                >
                                    {device.is_online ? "在线" : "离线"}
                                </Badge>
                            </Row>
                            <Row label="电源状态">
                                <Badge
                                    className={
                                        device.is_online
                                            ? device.device_log?.electric === "correct"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            : "bg-gray-500"
                                    }
                                >
                                    {device.is_online
                                        ? device.device_log?.electric === "correct"
                                            ? "正常"
                                            : "断电"
                                        : "未知"}
                                </Badge>
                            </Row>
                            <Row label="信号强度">
                                {device.device_log?.signal_quality_rssi}
                            </Row>
                            <Row label="固件版本">
                                {device.device_log?.firmware_version}
                            </Row>
                            <Row label="最后日志 ID">{device.latest_device_log_id}</Row>
                        </CardContent>
                    </Link>
                    <div className="flex justify-between p-4">
                        <DeviceFormDialog deviceId={device.device_id} triggerText="编辑" onSuccess={mutate} />
                        <Button variant="destructive" onClick={() => handleDelete(device.device_id)}>
                            删除
                        </Button>
                    </div>
                </Card>
            ))}
        </main>
    );
}
