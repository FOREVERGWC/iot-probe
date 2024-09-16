"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/provider/auth.provider"; // 引入 useAuth

export const authSchema = z.object({
    username: z.string().min(1, { message: "用户名不能为空" }),
    password: z.string().min(1, { message: "密码不能为空" }),
    rememberMe: z.boolean().optional(),
});

function LoginForm() {
    const { trigger: loginTrigger } = api.login.useSWRMutation();
    const { toast } = useToast();
    const router = useRouter();
    const { dispatch } = useAuth(); // 使用 useAuth 获取 dispatch

    const form = useForm<z.infer<typeof authSchema>>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (values: z.infer<typeof authSchema>) => {
        try {
            const result = await loginTrigger(values);

            if (result?.token) {
                dispatch({
                    type: "LOGIN",
                    payload: {
                        id: result.user.id,
                        username: values.username,
                        token: result.token
                    },
                });

                // 处理 Remember Me 逻辑
                if (values.rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("rememberMe");
                }

                toast({
                    title: "登录成功",
                    description: "您已成功登录。",
                });

                router.replace("/");
            } else {
                toast({
                    title: "登录失败",
                    description: "请检查您的用户名或密码。",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "登录失败",
                description: error?.message || "请重试或联系管理员。",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="用户名" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative space-y-2">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="密码"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        className="absolute bottom-1 right-1 h-7 w-7"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                    <span
                        className={`${
                            showPassword
                                ? "icon-[ph--eye-slash-bold]"
                                : "icon-[ph--eye-bold]"
                        }`}
                    />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between items-center">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem>
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <span className="text-sm text-gray-700">记住密码</span>
                                </label>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                        style={{ textDecoration: "none" }}
                    >
                        找回密码
                    </a>
                </div>
                <Button className="w-full" type="submit">
                    登录
                </Button>
            </form>
        </Form>
    );
}

export default LoginForm;
