"use client";

import { api } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "@/components/loading";

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
    return <Loading />;
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
              <Dialog>
                <DialogTrigger>
                  <Row label="最后日志 ID">{device.latest_device_log_id}</Row>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </Link>
      ))}
    </main>
  );
}
