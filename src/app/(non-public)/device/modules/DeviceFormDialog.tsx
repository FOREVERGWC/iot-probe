"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useSWR from 'swr';
import { api } from "@/utils/trpc";

type DeviceFormDialogProps = {
    deviceId?: string;
    triggerText: string;
    onSuccess?: () => void;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DeviceFormDialog({ deviceId, triggerText, onSuccess }: DeviceFormDialogProps) {
    const [deviceData, setDeviceData] = useState({
        device_id: "",
        intranet_array: "",
        extranet_array: "",
        heartbeat: "",
        is_online: false,
        serial_tx: "",
        alias_name: "",
    });
    const [open, setOpen] = useState(false);

    const { data: existingDevice } = useSWR(
        open && deviceId ? `/api/trpc/device?input=${encodeURIComponent(JSON.stringify({ id: deviceId }))}` : null,
        fetcher
    );

    useEffect(() => {
        if (existingDevice?.result?.data) {
            const device = existingDevice.result.data.device;
            setDeviceData({
                device_id: device.device_id,
                intranet_array: device.intranet_array,
                extranet_array: device.extranet_array,
                heartbeat: device.heartbeat,
                is_online: device.is_online,
                serial_tx: device.serial_tx,
                alias_name: device.alias_name,
            });
        }
    }, [existingDevice]);

    const { trigger: createTrigger } = api.createDevice.useSWRMutation();
    const { trigger: updateTrigger } = api.updateDevice.useSWRMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (deviceId) {
            await updateTrigger(deviceData);
        } else {
            await createTrigger(deviceData);
        }

        if (onSuccess) {
            onSuccess();
        }

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">{triggerText}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{deviceId ? "编辑设备" : "添加设备"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={deviceData.device_id}
                        onChange={(e) => setDeviceData({ ...deviceData, device_id: e.target.value })}
                        placeholder="设备 ID"
                        disabled={!!deviceId}
                    />
                    <Input
                        value={deviceData.intranet_array}
                        onChange={(e) => setDeviceData({ ...deviceData, intranet_array: e.target.value })}
                        placeholder="内网地址"
                    />
                    <Input
                        value={deviceData.extranet_array}
                        onChange={(e) => setDeviceData({ ...deviceData, extranet_array: e.target.value })}
                        placeholder="外网地址"
                    />
                    <Input
                        value={deviceData.heartbeat}
                        onChange={(e) => setDeviceData({ ...deviceData, heartbeat: e.target.value })}
                        placeholder="心跳"
                    />
                    <Input
                        value={deviceData.serial_tx}
                        onChange={(e) => setDeviceData({ ...deviceData, serial_tx: e.target.value })}
                        placeholder="串行传输"
                    />
                    <Input
                        value={deviceData.alias_name}
                        onChange={(e) => setDeviceData({ ...deviceData, alias_name: e.target.value })}
                        placeholder="别名"
                    />
                    <div>
                        <label>
                            在线状态:
                            <input
                                type="checkbox"
                                checked={deviceData.is_online}
                                onChange={() => setDeviceData({ ...deviceData, is_online: !deviceData.is_online })}
                            />
                        </label>
                    </div>
                    <Button type="submit">{deviceId ? "更新设备" : "添加设备"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
