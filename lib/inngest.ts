import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "CodeReverb",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
