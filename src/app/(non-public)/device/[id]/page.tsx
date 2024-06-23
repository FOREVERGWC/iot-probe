"use client";

import { api } from "@/utils/trpc";
import { DataTable, columns } from "./table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { formattedDate } from "@/utils/time";
import RecordChangeTable from "@/app/(non-public)/device/[id]/modules/RecordChangeTable";

const Row: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <div className="flex flex-row justify-between">
      <span className="pr-2 font-medium">{label}</span>
      <span>{children}</span>
    </div>
  );
};

const MsSpeed = ({ speed }: { speed: string }) => (
  <>
    {speed}
    {parseInt(speed.slice(0, -2)) > 9000 && (
      <Badge variant="destructive" className="mx-2">
        离线
      </Badge>
    )}
  </>
);

export default function Page({ params }: { params: { id: string } }) {
  const { data } = api.device.useSWR({ id: params.id });

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10">
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>探针</CardTitle>
          <CardDescription>{data.device.device_id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Row label="Status">
            <Badge
              className={data.device.is_online ? "bg-green-500" : "bg-red-500"}
            >
              {data.device.is_online ? "在线" : "离线"}
            </Badge>
          </Row>
          <Row label="心跳">{data.device.heartbeat}</Row>
          <Row label="最后日志 ID">{data.device.latest_device_log_id}</Row>
          <Row label="最后上线于">
            {formattedDate(data.lastLog.update_time)}
          </Row>
        </CardContent>
        <CardFooter>
          <Button>查看历史日志</Button>
        </CardFooter>
      </Card>
      <Card className="col-span-1 row-span-1">
        <CardHeader>
          <CardTitle>有线网络</CardTitle>
          <Row label="设备 IP">{data.device.intranet_array.split(",")[0]}</Row>
          <Row label="网关 IP">{data.device.intranet_array.split(",")[1]}</Row>
        </CardHeader>
      </Card>
      <Card className="col-span-1 row-span-1">
        <CardHeader>
          <CardTitle>电源状态</CardTitle>
          <CardDescription>暂无数据</CardDescription>
        </CardHeader>
      </Card>
      <Card className="col-span-1 row-span-1">
        <CardHeader>
          <CardTitle>SIM 卡状态</CardTitle>
          <CardDescription>暂无数据</CardDescription>
        </CardHeader>
      </Card>
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>内网状态</CardTitle>
          <CardDescription>内网探针记录</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP地址</TableHead>
                <TableHead>延迟</TableHead>
                <TableHead>延迟（打包）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lastLog.intranet_ping_array &&
                (
                  JSON.parse(data.lastLog.intranet_ping_array) as unknown as {
                    intranetIP: string;
                    speed: string;
                    speedLarge: string;
                  }[]
                ).map((ping, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {ping.intranetIP}
                    </TableCell>
                    <TableCell>
                      <MsSpeed speed={ping.speed} />
                    </TableCell>
                    <TableCell>
                      <MsSpeed speed={ping.speedLarge} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button>添加内针探针</Button>
        </CardFooter>
      </Card>
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>外网状态</CardTitle>
          <CardDescription>外网探针记录</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Row label="外网 Ping">
            <MsSpeed speed={data.lastLog.extranet_ping!} />
          </Row>
          <Row label="外网 Ping Large">
            <MsSpeed speed={data.lastLog.extranet_ping_large!} />
          </Row>
        </CardContent>
        <CardFooter>
          <Button>添加外网探针</Button>
        </CardFooter>
      </Card>
      <div className="col-span-4 grid grid-cols-3 gap-4">
        <RecordChangeTable device_id={params.id} />
        <RecordChangeTable device_id={params.id} />
        <RecordChangeTable device_id={params.id} />
      </div>
    </div>
  );
}
