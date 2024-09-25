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
import { Button } from "@/components/ui/button";
import UserDeviceFormDialog from "@/app/(non-public)/device/modules/UserDeviceFormDialog";
import EmptyState from "@/components/ui/empty";
import Row from "@/app/(non-public)/device/[id]/modules/Row";
import { Edit, Plus, Trash } from "lucide-react";
import PowerStatus from "@/app/(non-public)/device/modules/PowerStatus";
import OnlineStatus from "@/app/(non-public)/device/modules/OnlineStatus";
import {useToast} from "@/components/ui/use-toast";
import * as React from "react";

export default function Home() {
    const { toast } = useToast();
    const { data, mutate } = api.myDevices.useSWR();
    const { trigger: unbindDeviceTrigger } = api.unbindDevice.useSWRMutation();

    useEffect(() => {
        const interval = setInterval(() => {
            mutate();
        }, 60000);

        return () => clearInterval(interval);
    }, [mutate]);

    if (!data) return <Loading />

    const handleUnbind = async (deviceId: string) => {
        await unbindDeviceTrigger({ device_id: deviceId });

        await mutate();

        toast({
            title: '解绑成功',
            description: '您已成功解绑设备！',
        });
    };

    return (
        <main className="min-h-screen p-12">
            <div className="mb-8">
                <UserDeviceFormDialog onSuccess={mutate}>
                    <Button variant="ghost">
                        <Plus className="h-4 w-4" />
                        <span className="ml-2">添加设备</span>
                    </Button>
                </UserDeviceFormDialog>
            </div>

            {data.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <EmptyState title="没有设备" description="您还没有添加任何设备，请使用上方按钮添加新设备。" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.map((device: any) => (
                        <Card key={device.device_id} className="w-full max-w-sm mx-auto">
                            <Link href={`/device/${device.device_id}`}>
                                <CardHeader>
                                    <CardTitle className="truncate">{device.device_id}</CardTitle>
                                    <CardDescription className="text-center">{device.alias_name || device.device_id}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Row label="状态">
                                        <OnlineStatus isOnline={device.is_online} />
                                    </Row>
                                    <Row label="电源状态">
                                        <PowerStatus
                                            isOnline={device.is_online}
                                            electric={device.device_log?.electric}
                                        />
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
                                <UserDeviceFormDialog deviceId={device.device_id} onSuccess={mutate}>
                                    <Button variant="ghost">
                                        <Edit className="h-4 w-4" />
                                        <span className="ml-2">编辑</span>
                                    </Button>
                                </UserDeviceFormDialog>
                                <Button variant="destructive" onClick={() => handleUnbind(device.device_id)}>
                                    <Trash className="h-4 w-4" />
                                    <span className="ml-2">解绑</span>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
