import { Metadata } from "next";
import Link from "next/link";

import LoginForm from "./page.client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import routes from "@/routes";

export const metadata: Metadata = {
  title: "Sign in",
};

function page() {
  return (
    <Card className="mx-auto w-96 max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Login to Repotive</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-4 text-center text-sm">
          <span>Don't have an account? </span>
          {/*<Link className="underline" href={routes.auth.register}>*/}
          Sign up
          {/*</Link>*/}
        </p>
      </CardContent>
    </Card>
  );
}

export default page;
