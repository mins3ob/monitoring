"use client";

import React, { useMemo } from "react";

import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import SideNav from "@components/SideNav";
import ContentHeader from "@components/ContentHeader";
import Dashboard from "@components/contents/Dashboard";
import Project from "@components/contents/Project";
import Process from "@components/contents/Process";
import Lot from "@components/contents/Lot";
import Statistics from "@components/contents/Statistics";
import Users from "@components/contents/Users";
import Inventory from "@components/contents/Inventory";

export default function Wrapper() {
  const { selectedMenu } = useSelector((state: RootState) => state.sideNav);

  const menus = useMemo(() => {
    return {
      dashboard: <Dashboard />,
      project: <Project />,
      process: <Process />,
      lot: <Lot />,
      statistics: <Statistics />,
      users: <Users />,
      inventory: <Inventory />,
    };
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
      <SideNav />

      <div style={{ background: "var(--gray-50)" }}>
        <ContentHeader />

        {menus[selectedMenu]}
      </div>
    </div>
  );
}
