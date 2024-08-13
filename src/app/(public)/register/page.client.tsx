"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast"; // 引入 Toast 的 hook

export const registerSchema = z.object({
    username: z.string().min(1, { message: "用户名不能为空" }),
    password: z.string().min(6, { message: "密码至少需要 6 个字符" }),
    phone: z
        .string()
        .min(10, { message: "电话号码至少需要 10 个字符" })
        .regex(/^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}?\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/, {
            message: "无效的电话号码格式",
        }),
});

function RegisterForm() {
    const router = useRouter();
    const { trigger: registerTrigger } = api.register.useSWRMutation();
    const { toast } = useToast();  // 使用 Toast 的 hook

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            phone: ''
        }
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (values: z.infer<typeof registerSchema>) => {
        try {
            const result = await registerTrigger(values);
            if (result?.user) {
                toast({
                    title: "注册成功",
                    description: result.msg || "注册成功！",
                    variant: "default", // 可选：使用不同的颜色样式
                });
                router.push("/login");
            } else {
                toast({
                    title: "注册失败",
                    description: "注册失败，请重试。",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("注册失败:", error);
            toast({
                title: "注册失败",
                description: "注册失败，请重试。",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
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
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="手机" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">
                    注册
                </Button>
            </form>
        </Form>
    );
}

export default RegisterForm;
