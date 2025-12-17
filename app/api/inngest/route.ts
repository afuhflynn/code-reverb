import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { indexRepo, prAnalyze } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [prAnalyze, indexRepo],
});
