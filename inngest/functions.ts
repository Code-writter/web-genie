import { inngest } from "./client";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const invoke = inngest.createFunction(
  { id: "invoke" },
  { event: "test" },

  async ({ event, step }) => {

    // get the template sand box
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("web-genie")
      return sandbox.sandboxId
    })

    // Connect the LLM model

    await step.sleep("wait-a-moment", "1s");

    // generate the URL

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId)
        const host = sandbox.getHost(3000);
        return `https://${host}`
    })

    return { sandboxUrl };
  },
);