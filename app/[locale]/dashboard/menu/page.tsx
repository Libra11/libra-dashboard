/**
 * Author: Libra
 * Date: 2024-12-05 18:22:54
 * LastEditors: Libra
 * Description:
 */
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  return <div>TestPage</div>;
}
