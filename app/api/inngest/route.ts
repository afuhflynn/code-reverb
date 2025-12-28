import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import {
  generateReview,
  handleAppDeletion,
  handleAppInstallation,
  handleInstallationSuspended,
  handleInstallationUnsuspended,
  indexRepo,
  summarizePr,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    indexRepo,
    generateReview,
    handleAppInstallation,
    handleAppDeletion,
    handleInstallationSuspended,
    handleInstallationUnsuspended,
    summarizePr,
  ],
});
