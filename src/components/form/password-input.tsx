"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function PassowordInputs() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor="password" className="mb-1">
        Senha:
      </Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="********"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} className="opacity-60" />
          ) : (
            <AiOutlineEye size={20} className="opacity-60" />
          )}
        </button>
      </div>
    </div>
  );
}
