import * as React from "react";
import { cn } from "@/libs/utils";
import { cva, VariantProps } from "class-variance-authority";

const messageVariants = cva(
    "fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg text-white transition-opacity duration-300",
    {
        variants: {
            variant: {
                success: "bg-green-500",
                error: "bg-red-500",
                info: "bg-blue-500",
            },
            size: {
                default: "text-base",
                sm: "text-sm",
                lg: "text-lg",
            },
        },
        defaultVariants: {
            variant: "info",
            size: "default",
        },
    }
);

interface MessageProps extends VariantProps<typeof messageVariants> {
    title: string;
}

const Message: React.FC<MessageProps> = ({ title, variant, size }) => {
    return (
        <div className={cn(messageVariants({ variant, size }))}>
            {title}
        </div>
    );
};

export default Message;
