"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Back from "@/components/ui/back";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { base64Decode, formattedDate, base64Encode } from "@/utils/time";
import RecordChangeTable from "@/app/(non-public)/device/[id]/modules/RecordChangeTable";
import {
  columns,
  columns2,
  columns3,
  columns4,
  columns5,
} from "@/app/(non-public)/device/[id]/modules/types";
import DataTable from "@/app/(non-public)/device/[id]/modules/DataTable";
import IntranetStatusCard from "@/app/(non-public)/device/[id]/modules/IntranetStatusCard";
import ExtranetStatusCard from "@/app/(non-public)/device/[id]/modules/ExtranetStatusCard";
import Row from "@/app/(non-public)/device/[id]/modules/Row";
import PowerStatus from "@/app/(non-public)/device/modules/PowerStatus";
import OnlineStatus from "@/app/(non-public)/device/modules/OnlineStatus";

export default function Page({ params }: { params: { id: string } }) {
  const { data, mutate } = api.device.useSWR({ id: params.id });
  const { trigger: updateDeviceTrigger } = api.updateDevice.useSWRMutation();

  const [serialTx, setSerialTx] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 60000);

    return () => clearInterval(interval);
  }, [mutate]);

  useEffect(() => {
    if (data?.lastLog?.serial_tx) {
      setSerialTx(base64Encode(data.lastLog.serial_tx));
    }
  }, [data]);

  const handleBlur = async () => {
    if (!serialTx.trim()) return;

    await updateDeviceTrigger({
      device_id: params.id,
      serial_tx: base64Encode(serialTx),
    });

    await mutate();
  };

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!data) {
    return <Loading />;
  }

  return (
      <div className="relative p-4 md:p-10">
        <div className="absolute top-4 left-4 z-50">
          <Back />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-10">
          <Card className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
            <CardHeader>
              <CardTitle>探针</CardTitle>
              <CardDescription>
                {data?.device?.device_id}【{data?.device?.alias_name || data?.device?.device_id}】
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Row label="状态">
                <OnlineStatus isOnline={data?.device?.is_online} />
              </Row>
              <Row label="电源状态">
                <PowerStatus isOnline={data?.device?.is_online} electric={data?.lastLog?.electric} />
              </Row>
              <Row label="信号强度">{data?.lastLog?.signal_quality_rssi}</Row>
              <Row label="固件版本">{data?.lastLog?.firmware_version}</Row>
              <Row label="最后日志 ID">{data?.device?.latest_device_log_id}</Row>
              <Row label="最后上线于">{formattedDate(data.lastLog?.update_time)}</Row>
            </CardContent>
            <CardFooter>
              <Button onClick={scrollToHistory}>查看历史日志</Button>
            </CardFooter>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>有线网络</CardTitle>
              <Row label="设备 IP">{data?.device?.intranet_array.split(",")[0]}</Row>
              <Row label="网关 IP">{data?.device?.intranet_array.split(",")[1]}</Row>
              <Row label="以太网状态">
                {data.lastChangeLog?.ethernet === -1
                    ? "正常"
                    : data.lastChangeLog?.ethernet
                        ? "异常"
                        : "未知"}
              </Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>电源状态</CardTitle>
              <Row label="电源状态">
                <PowerStatus isOnline={data?.device?.is_online} electric={data?.lastLog?.electric} />
              </Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>SIM 卡状态</CardTitle>
              <Row label="ICCID">{data.lastLog?.iccid}</Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>最新消息</CardTitle>
              <Row label="接收数据">{base64Decode(data?.lastLog?.serial_rx)}</Row>
              <Row label="发送数据">
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="输入数据"
                    value={serialTx}
                    onChange={(e) => setSerialTx(e.target.value)}
                    onBlur={handleBlur}
                />
              </Row>
            </CardHeader>
          </Card>
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <IntranetStatusCard
                deviceId={params.id}
                intranetArray={data?.device?.intranet_array}
                intranetPingArray={data.lastLog?.intranet_ping_array}
                onSuccess={mutate}
            />
            <ExtranetStatusCard
                deviceId={params.id}
                extranetArray={data?.device?.extranet_array}
                extranetPing={data.lastLog?.extranet_ping!}
                extranetPingLarge={data.lastLog?.extranet_ping_large!}
                onSuccess={mutate}
            />
          </div>
          <div ref={historyRef} className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecordChangeTable title="设备状态" device_id={params.id} columns={columns} />
            <RecordChangeTable title="电源状态" device_id={params.id} columns={columns2} />
            <RecordChangeTable title="以太网状态" device_id={params.id} columns={columns3} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataTable title="接收数据" device_id={params.id} columns={columns5} />
            <DataTable title="发送数据" device_id={params.id} columns={columns4} />
          </div>
        </div>
      </div>
  );
}
