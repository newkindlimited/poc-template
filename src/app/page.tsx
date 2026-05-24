import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * One-click "Enter demo" landing. The prospect lands here, sees the
 * branded splash, taps Enter, and is inside the tool within 2 seconds.
 *
 * No auth. No login form. No "demo mode" wording — this is THEIR tool.
 *
 * Claude Code will customise this for the target during build.
 */
export default function Landing() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {/* CLAUDE: replace with target company name */}
            POC
          </h1>
          <p className="text-base text-muted-foreground">
            {/* CLAUDE: replace with short value proposition for this target */}
            Custom operations tool
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href="/dashboard">Enter</Link>
        </Button>
      </div>
    </main>
  );
}
