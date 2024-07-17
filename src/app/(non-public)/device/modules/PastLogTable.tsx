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
import useSWR from "swr";
import { api } from "@/utils/trpc";
import React, { useState } from "react";
import { atom, useAtom } from "jotai";
import { Button } from "@/components/ui/button";

const PastLogTable: React.FC<{
  device_id: string;
}> = ({ device_id }) => {
  return <></>;
  // const { data } = api.devicePastLogList.useSWR({ device_id });
  //
  // return (
  //   <Table>
  //     <TableCaption>A list of your recent invoices.</TableCaption>
  //     <TableHeader>
  //       <TableRow>
  //         <TableHead className="w-[100px]">Log ID</TableHead>
  //         <TableHead>Create Time</TableHead>
  //         <TableHead className="text-right">Action</TableHead>
  //       </TableRow>
  //     </TableHeader>
  //     <TableBody>
  //       {data?.map((log) => (
  //         <TableRow key={log.id}>
  //           <TableCell className="font-medium">{log.id}</TableCell>
  //           <TableCell>{log.update_time?.toLocaleDateString()}</TableCell>
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //     <TableFooter>
  //       <TableRow>
  //         <TableCell colSpan={3}>Total</TableCell>
  //         <TableCell className="text-right">$2,500.00</TableCell>
  //       </TableRow>
  //     </TableFooter>
  //   </Table>
  // );
};

export default PastLogTable;
