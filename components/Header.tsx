import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="h-16 border-b flex items-center justify-between px-2 py-3">
      <h1 className="text-2xl font-bold">
        <Link href="/">OTSI</Link>
      </h1>
      <Button variant="outline" asChild>
        <Link href="/results">Results</Link>
      </Button>
    </div>
  );
}
