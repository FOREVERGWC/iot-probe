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
            console.log("用户已登录");
        } else {
            // 用户未登录
            console.log("用户未登录");
        }
    }, [state.token]);

    const isAdmin = state.roleIdList.includes(1)

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        router.push('/login');
    };

    return (
        <NavigationMenu className="bg-gray-800 p-4">
            <NavigationMenuList>
                <NavigationMenuItem>
                  <span className="text-white text-lg font-bold">
                    九溪云服务
                  </span>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/" className="text-white text-lg ml-6">
                        首页
                    </Link>
                    {
                        isAdmin && (
                            <>
                                <Link href="/admin/device" className="text-white text-lg ml-6">
                                    设备管理
                                </Link>
                                <Link href="/admin/server" className="text-white text-lg ml-6">
                                    服务器资源
                                </Link>
                                <Link href="/admin/device" className="text-white text-lg ml-6">
                                    服务协议
                                </Link>
                            </>
                        )
                    }
                </NavigationMenuItem>

                <div className="flex-grow"></div>

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
