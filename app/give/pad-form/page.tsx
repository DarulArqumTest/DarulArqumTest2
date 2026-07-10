import type { Metadata } from "next";
import { PadFormPage } from "@/components/sections/pad-form-page";

export const metadata: Metadata = {
  title: "PAD form",
  description:
    "Set up a Pre-Authorized Debit (PAD) — a recurring monthly donation to Darul Arqum. Download the official form and instructions.",
};

export default function PadFormRoute() {
  return (
    <main>
      <PadFormPage />
    </main>
  );
}
