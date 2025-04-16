'use client'

import * as React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/libs/utils'
import Loading from '@/app/loading'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ChangeLog } from '@/app/(non-public)/device/[id]/modules/types'

const RecordChangeTable: React.FC<{
	title?: string
	className?: string
	columns: ColumnDef<ChangeLog>[]
	data: Array<any>
	isLoading: boolean
}> = ({ title, className, columns, data, isLoading }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	if (isLoading) {
		return <Loading />
	}

	return (
		<div className={cn('w-full rounded-md border', className)}>
			{title && (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			)}
			<div className="max-h-[240px] overflow-y-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									暂无数据
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default RecordChangeTable
