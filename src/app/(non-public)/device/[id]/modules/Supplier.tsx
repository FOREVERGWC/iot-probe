import React from 'react'

interface SupplierProps {
	iccid?: string | null
}

const getSupplierName = (iccid: string | undefined | null): string => {
	if (!iccid) return '未知'

	if (iccid.startsWith('898600') || iccid.startsWith('898602')) {
		return '中国移动'
	} else if (iccid.startsWith('898601') || iccid.startsWith('898609')) {
		return '中国联通'
	} else if (iccid.startsWith('898603') || iccid.startsWith('898606')) {
		return '中国电信'
	} else {
		return '其他'
	}
}

const Supplier: React.FC<SupplierProps> = ({ iccid }) => {
	const supplierName = getSupplierName(iccid)

	return <span>{supplierName}</span>
}

export default Supplier
