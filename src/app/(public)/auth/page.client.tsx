"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

function LoginForm() {
  return <div>LoginForm</div>;
  // const router = useRouter();
  // const form = useForm<z.infer<typeof authSchema>>({
  //   resolver: zodResolver(authSchema),
  // });
  //
  // const [showPassword, setShowPassword] = useState(false);
  //
  // const { data, trigger, error } = api.user.login.useSWRMutation();
  // const {
  //   data: oauthData,
  //   trigger: oauthTrigger,
  //   isMutating: isOAuthMutating,
  // } = api.user.oauth.useSWRMutation();

  // const login = async (values: z.infer<typeof authSchema>) => {
  //   await trigger(values);
  //   if (data) {
  //     localStorage.setItem("token", data);
  //     router.push("/");
  //   }
  // };
  // const oauthLogin = async (provider: OAuthProvider) => {
  //   const oauthUrl = await oauthTrigger({ provider });
  //   router.replace(oauthUrl as any);
  // };

  // if (isOAuthMutating) {
  //   // return <LoadingIcon />;
  // }

  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(login)} className="space-y-4">
  //       <FormField
  //         control={form.control}
  //         name="email"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Email</FormLabel>
  //             <FormControl>
  //               <Input type="text" placeholder="hi@genessay.com" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />
  //       <FormField
  //         control={form.control}
  //         name="password"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormLabel>Password</FormLabel>
  //             <FormControl>
  //               <div className="relative space-y-2">
  //                 <Input
  //                   type={showPassword ? "text" : "password"}
  //                   placeholder=""
  //                   {...field}
  //                 />
  //                 <Button
  //                   type="button"
  //                   className="absolute bottom-1 right-1 h-7 w-7"
  //                   size="icon"
  //                   variant="ghost"
  //                   onClick={() => setShowPassword(!showPassword)}
  //                 >
  //                   <span
  //                     className={`${
  //                       showPassword
  //                         ? "icon-[ph--eye-slash-bold]"
  //                         : "icon-[ph--eye-bold]"
  //                     }`}
  //                   />
  //                 </Button>
  //               </div>
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />
  //       <Button className="w-full" type="submit">
  //         Login
  //       </Button>
  //       <Button
  //         className="w-full"
  //         variant="outline"
  //         type="button"
  //         disabled={isOAuthMutating}
  //         // onClick={() => oauthLogin("google" as OAuthProvider)}
  //       >
  //         <span className="icon-[logos--google-icon]"></span>&nbsp;Continue with
  //         Google
  //       </Button>
  //       <Button
  //         className="w-full"
  //         variant="outline"
  //         type="button"
  //         disabled={isOAuthMutating}
  //         // onClick={() => oauthLogin("github" as OAuthProvider)}
  //       >
  //         <span className="icon-[logos--github-icon]"></span>&nbsp;Continue with
  //         Github
  //       </Button>
  //     </form>
  //   </Form>
  // );
}

export default LoginForm;
