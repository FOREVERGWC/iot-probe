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
import {
  base64Decode,
  formattedDate,
  base64Encode,
  getPowerVoltage,
  getSuperCapVoltage,
  getIO,
  getAnalogInput
} from "@/utils/time";
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
import EthernetStatus from "@/app/(non-public)/device/modules/EthernetStatus";
import LongText from "@/app/(non-public)/device/modules/LongText";
import Supplier from "@/app/(non-public)/device/[id]/modules/Supplier";
import { saveAs } from "file-saver";
import {useToast} from "@/components/ui/use-toast";
import {Checkbox} from "@/components/ui/checkbox";

export default function Page({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { data, mutate } = api.device.useSWR({ id: params.id });
  const { trigger: updateDeviceTrigger } = api.updateDevice.useSWRMutation();
  const { trigger: clearDeviceLogs } = api.clearDeviceLogs.useSWRMutation();
  const { trigger: downloadDeviceLogs } = api.downloadDeviceLogs.useSWRMutation();
  const { data: onlineData, isLoading: isOnlineLoading } = api.deviceChangeLog.useSWR({
    device_id: params.id,
    filter: "online"
  });
  const { data: electricData, isLoading: isElectricLoading } = api.deviceChangeLog.useSWR({
    device_id: params.id,
    filter: "electric"
  });
  const { data: ethernetData, isLoading: isEthernetLoading } = api.deviceChangeLog.useSWR({
    device_id: params.id
  });
  const [isFocused, setIsFocused] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    io1: false,
    io2: false,
    io3: false,
    io4: false
  });

  const [serialTx, setSerialTx] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 60000);

    return () => clearInterval(interval);
  }, [mutate]);

  const handleCheckboxChange = (name: 'io1' | 'io2' | 'io3' | 'io4') => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleBlur = async () => {
    setIsFocused(false)
    if (!serialTx.trim()) return;

    const ioStatus = `${checkboxState.io1 ? '1' : '0'}${checkboxState.io2 ? '1' : '0'}${checkboxState.io3 ? '1' : '0'}`;
    const controlString = checkboxState.io4 ? `$O:${ioStatus};$` : '';

    const msg = controlString + serialTx;

    await updateDeviceTrigger({
      device_id: params.id,
      serial_tx: base64Encode(msg),
    });

    await mutate();

    toast({
      title: "发送成功",
      description: "您已成功发送信息！",
    });

    setSerialTx('')
    checkboxState.io1 = false
    checkboxState.io2 = false
    checkboxState.io3 = false
    checkboxState.io4 = false
  };

  const handleClear = async () => {
    await clearDeviceLogs({ device_id: params.id })
    await mutate();
    toast({
      title: "清除成功",
      description: "您已成功清除数据！",
    });
  }

  const handleDownload = async () => {
    const version = data?.lastLog?.firmware_version || "";
    const csvData = await downloadDeviceLogs({ device_id: params.id, version });
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${params.id}_device.csv`);
    toast({
      title: "下载成功",
      description: "您已成功下载数据！",
    });
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
              <CardDescription className="text-center">
                {data?.device?.device_id}【{data?.device?.alias_name || data?.device?.device_id}】
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Row label="状态">
                <OnlineStatus isOnline={data?.device?.is_online}/>
              </Row>
              <Row label="电源状态">
                <PowerStatus isOnline={data?.device?.is_online} electric={data?.lastLog?.electric}/>
              </Row>
              <Row label="信号强度">{data?.lastLog?.signal_quality_rssi}</Row>
              <Row label="固件版本">{data?.lastLog?.firmware_version}</Row>
              <Row label="最后日志 ID">{data?.device?.latest_device_log_id}</Row>
              <Row label="最后上线于">{formattedDate(data.lastLog?.update_time)}</Row>
              <Row label="注册时间">{formattedDate(data.firstLog?.update_time)}</Row>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={scrollToHistory}>历史日志</Button>
              <div className="flex gap-1">
                <Button variant="destructive" onClick={handleClear}>清除数据</Button>
                <Button variant="outline" onClick={handleDownload}>下载数据</Button>
              </div>
            </CardFooter>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>有线网络</CardTitle>
              <Row label="设备 IP">{data?.device?.intranet_array.split(",")[0]}</Row>
              <Row label="网关 IP">{data?.device?.intranet_array.split(",")[1]}</Row>
              <Row label="以太网状态">
                <EthernetStatus ethernet={data?.lastChangeLog?.ethernet}/>
              </Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>电源状态</CardTitle>
              <Row label="电源状态">
                <PowerStatus isOnline={data?.device?.is_online} electric={data?.lastLog?.electric}/>
              </Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>SIM 卡状态</CardTitle>
              <Row label="ICCID">{data.lastLog?.iccid}</Row>
              <Row label="供应商">
                <Supplier iccid={data?.lastLog?.iccid}/>
              </Row>
            </CardHeader>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>附加信息</CardTitle>
              <Row label="电源电压">{getPowerVoltage(data?.lastLog?.serial_rx || '')}</Row>
              <Row label="超级电容电压">{getSuperCapVoltage(data?.lastLog?.serial_rx || '')}</Row>
              <Row label="IO状态">{getIO(data?.lastLog?.serial_rx || '')}</Row>
              <Row label="模拟量状态">{getAnalogInput(data?.lastLog?.serial_rx || '')}</Row>
            </CardHeader>
          </Card>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>最新消息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Row label="接收数据">
                  <LongText text={base64Decode(data?.lastLog?.serial_rx || '')}/>
                </Row>
                <Row label="发送数据">
                  <div className="relative w-full">
                    <input
                        className="w-full p-2 border rounded pr-16"
                        type="text"
                        placeholder="输入数据"
                        value={serialTx}
                        onChange={(e) => setSerialTx(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                    />
                    <button
                        className="absolute right-0 top-0 bottom-0 px-4 py-2"
                        onClick={handleBlur}
                    >
                      发送
                    </button>
                  </div>
                </Row>
                {isFocused && (
                    <Row label="数字控制">
                      <div className="flex gap-x-24">
                        <div className="flex items-center gap-x-0.5">
                          <label>IO1</label>
                          <Checkbox
                              checked={checkboxState.io1}
                              onCheckedChange={() => handleCheckboxChange('io1')}
                          />
                        </div>
                        <div className="flex items-center gap-x-0.5">
                          <label>IO2</label>
                          <Checkbox
                              checked={checkboxState.io2}
                              onCheckedChange={() => handleCheckboxChange('io2')}
                          />
                        </div>
                        <div className="flex items-center gap-x-0.5">
                          <label>IO3</label>
                          <Checkbox
                              checked={checkboxState.io3}
                              onCheckedChange={() => handleCheckboxChange('io3')}
                          />
                        </div>
                        <div className="flex items-center gap-x-0.5">
                          <label>发送控制字符串</label>
                          <Checkbox
                              checked={checkboxState.io4}
                              onCheckedChange={() => handleCheckboxChange('io4')}
                          />
                        </div>
                      </div>
                    </Row>
                )}
              </CardContent>
            </Card>
          </div>
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
          {/* TODO 父组件查询日志传递给子组件，防止重复查询 */}
          <div ref={historyRef}
               className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecordChangeTable
                title="设备状态"
                columns={columns}
                data={onlineData as Array<any>}
                isLoading={isOnlineLoading}
            />
            <RecordChangeTable
                title="电源状态"
                columns={columns2}
                data={electricData as Array<any>}
                isLoading={isElectricLoading}
            />
            <RecordChangeTable
                title="以太网状态"
                columns={columns3}
                data={ethernetData as Array<any>}
                isLoading={isEthernetLoading}
            />
          </div>
          <div className="col-span-1 lg:col-span-4 space-y-4">
            <DataTable title="接收数据记录" device_id={params.id} columns={columns4}/>
            <DataTable title="发送数据记录" device_id={params.id} columns={columns5}/>
          </div>
        </div>
      </div>
  );
}
