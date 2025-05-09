"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import SignIn from "@components/auth/SignIn";

export default function Home() {
  const router = useRouter();

  const { isAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuth) router.push("/wrapper");
  }, [isAuth, router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-[var(--gray-100)]">
      <SignIn />
    </main>
  );
}
