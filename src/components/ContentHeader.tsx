"use client";

import React, { useState } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@redux/store";

import { resetAuth } from "@redux/slices/authSlice";

import IconSetting from "@public/svgs/common/icon_gear.svg";

import ImgDefaultProfile from "@public/imgs/img_default_profile.png";

export default function ContentHeader() {
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        columnGap: 10,
        padding: 10,
      }}
    >
      <div style={{ height: 40 }}>
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          style={{ background: "none", padding: 0 }}
        >
          <Image
            src={ImgDefaultProfile}
            alt="기본 프로필 이미지"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        </button>

        {isProfileOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              padding: 20,
            }}
          >
            <h6 style={{ marginBottom: 20 }}>{auth.email ? auth.email.split("@")[0] : "정보없음"} 님</h6>

            <button type="button" onClick={() => dispatch(resetAuth())}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      <button type="button" style={{ background: "none", padding: 0 }}>
        <IconSetting width={40} height={40} fill="black" />
      </button>
    </div>
  );
}
