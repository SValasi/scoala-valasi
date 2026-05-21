"use client";

import dynamic from "next/dynamic";

const HartaFortelor = dynamic(() => import("../components/harta-fortelor"), {
  ssr: false,
});

export default function Page() {
  return <HartaFortelor />;
}