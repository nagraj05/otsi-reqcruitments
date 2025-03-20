"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import otsiLogo from "@/public/images/otsi.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  return (
    <div className="h-16 border-b flex items-center justify-between px-2 py-3">
      <Image
        src={otsiLogo}
        alt="OTSI Logo"
        width={100}
        height={100}
        onClick={() => router.push("/")}
        className="cursor-pointer"
      />
      <div className="flex gap-2">
        <Button>
          <Link href="/">Form</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/results">Results</Link>
        </Button>
      </div>
    </div>
  );
}
