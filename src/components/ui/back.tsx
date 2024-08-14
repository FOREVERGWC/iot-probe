"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Back: React.FC = () => {
    const router = useRouter();
    return (
        <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
        </Button>
    );
};

export default Back;
