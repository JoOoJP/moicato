"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Pago → esvazia a sacola. Pendente → recarrega o status a cada 5 s.
export default function OrderStatusClient({ status }) {
  const router = useRouter();
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready && ["paid", "shipped", "delivered"].includes(status)) clear();
  }, [ready, status, clear]);

  useEffect(() => {
    if (status !== "pending") return;
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [status, router]);

  return null;
}
