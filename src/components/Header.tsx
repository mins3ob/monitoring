"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

export default function Header() {
  const router = useRouter();

  const { isAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuth) router.push("/");
  }, [isAuth, router]);

  return <div></div>;
}
