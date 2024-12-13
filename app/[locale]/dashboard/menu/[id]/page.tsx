/**
 * Author: Libra
 * Date: 2024-12-06 13:47:13
 * LastEditors: Libra
 * Description:
 */
"use client";
import { useParams } from "next/navigation";

export default function IdPage() {
  const params = useParams();
  return <div>{params.id}</div>;
}
