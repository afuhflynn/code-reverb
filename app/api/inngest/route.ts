import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import {
  generateReview,
  handleAppDeletion,
  handleAppInstallation,
  indexRepo,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    indexRepo,
    generateReview,
    handleAppInstallation,
    handleAppDeletion,
  ],
});
