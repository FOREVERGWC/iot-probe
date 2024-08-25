import Link from "next/link";

import LoginForm from "./page.client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginPage() {
  return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="mx-auto w-96 max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">登录</CardTitle>
              <CardDescription className="text-center">
                登录系统
              </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm/>
            <p className="mt-4 text-center text-sm">
              <span>还没有账号？</span>
              <Link className="hover:text-gray-600" href="/register">
                注册
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
  );
}

export default LoginPage;
