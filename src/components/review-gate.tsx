"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, RefreshCw, X } from "lucide-react";

/**
 * <ReviewGate /> — the propose-review-approve pattern in one component.
 *
 * Show an AI-generated proposal. Let the human edit it inline. They approve,
 * reject, or regenerate. On approve, the parent receives the final value.
 *
 * Used everywhere Claude is producing user-visible output that needs human
 * sign-off: quote drafts, classification labels, summaries, generated emails,
 * etc. The whole point of the demo: AI does heavy lifting, human approves
 * with a tap.
 */
export function ReviewGate<T>({
  proposal,
  render,
  onApprove,
  onRegenerate,
  onReject,
  title = "AI proposal — review and approve",
}: {
  proposal: T;
  render: (value: T, edit: (next: T) => void) => React.ReactNode;
  onApprove: (final: T) => void | Promise<void>;
  onRegenerate?: () => void | Promise<void>;
  onReject?: () => void;
  title?: string;
}) {
  const [working, setWorking] = useState<T>(proposal);
  const [busy, setBusy] = useState<"approve" | "regenerate" | null>(null);

  return (
    <Card className="border-accent/40">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>{render(working, setWorking)}</div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={async () => {
              setBusy("approve");
              await onApprove(working);
              setBusy(null);
            }}
            disabled={busy !== null}
          >
            <Check className="w-3.5 h-3.5" />
            {busy === "approve" ? "Approving..." : "Approve"}
          </Button>
          {onRegenerate && (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                setBusy("regenerate");
                await onRegenerate();
                setBusy(null);
              }}
              disabled={busy !== null}
            >
              <RefreshCw className={"w-3.5 h-3.5 " + (busy === "regenerate" ? "animate-spin" : "")} />
              Regenerate
            </Button>
          )}
          {onReject && (
            <Button size="sm" variant="ghost" onClick={onReject} disabled={busy !== null}>
              <X className="w-3.5 h-3.5" />
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
