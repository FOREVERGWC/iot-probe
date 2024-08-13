"use client";

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// 定义 Auth 状态类型
interface AuthState {
  id: number | null;
  username: string | null;
  token: string | null;
}

// 定义 Action 类型
type AuthAction =
    | { type: "LOGIN"; payload: { id: number; username: string; token: string } }
    | { type: "LOGOUT" };

// 初始状态
const initialAuthState: AuthState = {
  id: null,
  username: null,
  token: null,
};

// 创建 AuthContext
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialAuthState,
  dispatch: () => null,
});

// 创建 reducer 函数
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        id: null,
        username: null,
        token: null,
      };
    default:
      return state;
  }
}

// 合并后的 AuthProvider 组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();
  const pathname = usePathname();

  // 从 localStorage 恢复状态
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedId = localStorage.getItem("id");
    const savedUsername = localStorage.getItem("username");

    if (savedToken && savedId && savedUsername) {
      dispatch({
        type: "LOGIN",
        payload: {
          id: parseInt(savedId),
          username: savedUsername,
          token: savedToken,
        },
      });
    }
  }, []);

  // 状态变化时同步到 localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("id", state.id!.toString());
      localStorage.setItem("username", state.username!);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
    }
  }, [state.token, state.id, state.username]);

  // 路由保护逻辑
  useEffect(() => {
    const isLoggedIn = state.token !== null;

    if (!isLoggedIn && pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
      router.push("/login");
    }

    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      router.push("/");
    }
  }, [router, pathname, state.token]);

  return (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
  );
}

// 自定义 Hook 用于访问 AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
