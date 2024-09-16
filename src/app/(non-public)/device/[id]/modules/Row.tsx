import React from "react";

const Row: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => {
    return (
        <div className="flex flex-row justify-between items-center">
            <span className="pr-2 font-medium">{label}</span>
            <div className="flex-1 text-right max-w-full overflow-x-auto font-mono">{children}</div>
        </div>
    );
};

export default Row;
