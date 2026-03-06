"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Theme Park Tycoon</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <GameCanvas />;
}
