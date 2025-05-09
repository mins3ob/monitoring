"use client";

import React from "react";

import Image from "next/image";

// import { useSelector } from "react-redux";
// import { RootState } from "@redux/store";

import IconSetting from "@public/svgs/common/icon_gear.svg";

import ImgDefaultProfile from "@public/imgs/img_default_profile.png";

export default function ContentHeader() {
  // const auth = useSelector((state: RootState) => state.auth);

  // const {isProfileOpen, setIsProfileOpen} = useState>

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", columnGap: 10, padding: 10 }}>
      <div style={{ height: 40 }}>
        <button type="button" style={{ background: "none", padding: 0 }}>
          <Image
            src={ImgDefaultProfile}
            alt="기본 프로필 이미지"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        </button>

        <div style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}></div>
      </div>

      <button type="button" style={{ background: "none", padding: 0 }}>
        <IconSetting width={40} height={40} fill="black" />
      </button>
    </div>
  );
}
