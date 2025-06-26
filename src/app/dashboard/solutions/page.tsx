"use client";

import DrawFlow from "@/components/drawflow";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-[90vh] relative overflow-y-hidden p-8">
      <Button className="absolute top-5 right-5">Novo</Button>
      <DrawFlow/>
    </div>
  );
}
