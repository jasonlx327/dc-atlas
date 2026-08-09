import { redirect } from "next/navigation";

export default function PolicyPage() {
  redirect("/pulse?signal=policy");
}
