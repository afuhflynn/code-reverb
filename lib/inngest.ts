import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "code-reverb",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
