"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation";
import { useAuth } from "@/provider/auth.provider";

export default function Navbar() {
    const { state, dispatch } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (state.token) {
            // 如果 token 存在，用户已经登录
            console.log("用户已登录");
        } else {
            // 用户未登录
            console.log("用户未登录");
        }
    }, [state.token]);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        router.push("/login");
    };

    return (
        <NavigationMenu className="bg-gray-800 p-4">
            <NavigationMenuList>
                {/* 网站名称，左对齐 */}
                <NavigationMenuItem>
          <span className="text-white text-lg font-bold">
            电网探针
          </span>
                </NavigationMenuItem>

                {/* 中间的首页导航 */}
                <NavigationMenuItem>
                    <Link href="/" className="text-white text-lg ml-6">
                        首页
                    </Link>
                </NavigationMenuItem>

                <div className="flex-grow"></div>

                {/* 用户部分，右对齐 */}
                <NavigationMenuItem>
                    {state.token ? (
                        <span
                            onClick={handleLogout}
                            className="text-white text-lg ml-6 cursor-pointer"
                        >
              退出
            </span>
                    ) : (
                        <span
                            onClick={() => router.push("/login")}
                            className="text-white text-lg ml-6 cursor-pointer"
                        >
              登录
            </span>
                    )}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
