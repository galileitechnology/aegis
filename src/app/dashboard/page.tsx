"use client";

import { Button } from "@/components/ui/button";
import logoutAction from "@/utils/auth/logoutAction";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col gap-5 justify-center items-center">
      <h2 className="text-2xl">Dashboard</h2>
      <Button
        onClick={logoutAction}
        variant={"destructive"}
        className="cursor-pointer"
      >
        Sair
      </Button>
    </div>
  );
}
