import React from "react";

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

export default Row;
