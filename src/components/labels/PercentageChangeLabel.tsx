"use client";

import React from "react";

interface IPercentageChangeLabel {
  label: number;
  color?: string;
}

export default function PercentageChangeLabel({ label }: IPercentageChangeLabel) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          background: label > 0 ? "var(--gray-100)" : "var(--gray-500)",
          padding: "2px 10px",
          borderRadius: 20,
          color: label > 0 ? "red" : "white",
        }}
      >
        {label > 0 && "+"}
        {label}%
      </span>
    </div>
  );
}
