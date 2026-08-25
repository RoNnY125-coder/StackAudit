"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactLenis root>{children}</ReactLenis>;
}
