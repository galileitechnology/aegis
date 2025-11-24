"use client";

import { useState } from "react";
import { Shield, Zap, Lock, Ban, Cpu, Terminal, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OffnsrDemo() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        <img src="/images/offnsr_png.png" className="h-20 w-20" />
        <p className="text-2xl font-semibold">OFFNSR — Counter-attack operations</p>
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Fully-operational interface designed to attack major threats.
      </p>

      <Separator className="my-6 bg-[transparent]" />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* DDoS Module */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-[#5200ff]" /> DDoS Attack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("Simulated DDoS attack initiated (no real traffic).")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-[transparent]"
            >
              Launch DDoS
            </Button>
          </CardContent>
        </Card>

        {/* Brute Force */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="text-[#5200ff]" /> Brute Force
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("Simulated brute-force cycle running (UI only).")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-[transparent]"
            >
              Run Brute Force
            </Button>
          </CardContent>
        </Card>

        {/* Port Scanner */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="text-[#5200ff]" /> Port Scan Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("Simulated port scan visualization started.")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-[transparent]"
            >
              Run Port Scan
            </Button>
          </CardContent>
        </Card>

        {/* Payload Launcher */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="text-[#5200ff]" /> Payload Sandbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("Payload simulated in sandbox VM environment.")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-[transparent]"
            >
              Payload Execution
            </Button>
          </CardContent>
        </Card>

        {/* IP Blocker */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="text-[#5200ff]" /> IP Blocking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("IP 192.168.0.24 marked as blocked (demo only).")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-red-600"
            >
              Block IP
            </Button>
          </CardContent>
        </Card>

        {/* Terminal */}
        <Card className="bg-[#111111] p-5 border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="text-[#5200ff]" /> Attack Terminal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addLog("Terminal command executed in simulation mode.")}
              className="w-full border-[1px] border-[#303030] text-[#fff] bg-[transparent]"
            >
              Run Mock Command
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* LOGS */}
      <div className="mt-10 bg-[#0a0a0a] p-5 border">
        <h2 className="text-xl font-semibold mb-3">Machine: PREDATOR-UDT</h2>
        <p className="mb-3">Live from terminal</p>
        <div className="h-64 overflow-y-scroll text-sm font-mono bg-black p-4 border border-gray-800">
          {logs.length === 0 && <p className="text-gray-500">No events yet.</p>}
          {logs.map((log, index) => (
            <p key={index} className="text-[#d41c1c]">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}