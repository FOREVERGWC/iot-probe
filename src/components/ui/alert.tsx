import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";

const alertVariants = cva(
    "flex items-center justify-between rounded-md p-4",
    {
        variants: {
            variant: {
                success: "bg-green-100 text-green-800",
                error: "bg-red-100 text-red-800",
                info: "bg-blue-100 text-blue-800",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "info",
            size: "default",
        },
    }
);

interface AlertCustomProps {
    icon?: React.ReactNode;
    title?: React.ReactNode;
    content?: React.ReactNode;
}

export interface AlertProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'>,
        AlertCustomProps,
        VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, size, icon, title, content, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(alertVariants({ variant, size }), className)}
                {...props}
            >
                {icon && <Slot className={alertVariants({ size: "icon" })}>{icon}</Slot>}
                <div className="flex flex-col space-y-1">
                    {title && <div className="font-semibold">{title}</div>}
                    {content && <div className="text-sm">{content}</div>}
                </div>
            </div>
        );
    }
);

Alert.displayName = "Alert";

export { Alert };
