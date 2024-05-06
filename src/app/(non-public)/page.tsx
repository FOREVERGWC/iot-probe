"use client";

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
  const { data } = api.devices.useSWR();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 base:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-24 mx-auto">
      {data.map((device) => (
        <Link key={device.device_id} href={`/device/${device.device_id}`}>
          <Card className="w-72">
            <CardHeader>
              <CardTitle className="truncate">{device.device_id}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Row label="Status">
                <Badge
                  className={device.is_online ? "bg-green-500" : "bg-red-500"}
                >
                  {device.is_online ? "在线" : "离线"}
                </Badge>
              </Row>
              <Row label="心跳">{device.heartbeat}</Row>
              <Row label="最后日志 ID">{device.latest_device_log_id}</Row>
            </CardContent>
          </Card>
        </Link>
      ))}
    </main>
  );
}
