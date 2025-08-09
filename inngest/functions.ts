
import {Sandbox} from "@e2b/code-interpreter"
import { assistentLastMessageContent, getSandbox } from "./utils";

import { z } from 'zod'

import { createAgent, createNetwork, createTool, openai } from '@inngest/agent-kit';
import { inngest } from "./client";
import { PROMPT } from "@/prompt/prompt";
import prisma from "@/lib/db";

// Types
import { AgentState } from "@/types/agent-interfaces";


export const codeAgentFunctions = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },

  async ({ event, step }) => {

    // get the template sand box
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("web-genie")
      return sandbox.sandboxId
    })

    // Connect the LLM model

      const codeAgent = createAgent <AgentState> ({
        name: 'code-agent',
        description : "An expert coding agent",
        system: PROMPT,
        model: openai({
          model : "gpt-4.1",
          defaultParameters : {
            // Randomness
            temperature : 0.1,

          }
        }),
        tools : [
          // Terminal tool
          createTool({
            name : "terminal",
            description : "use the terminal to run the commands",
            // @ts-ignore
            parameters : z.object({
              command : z.string()
            }),
            handler : async ({command}, {step}) => {
              return await step?.run("terminal", async() => {
                const buffers = {stdout : "" , stderr : ""}

                try {
                  const sandbox  = await getSandbox(sandboxId)
                  const result = await sandbox.commands.run(command, {
                    onStdout : (data : string ) => {
                      buffers.stdout += data
                    }, 

                    onStderr : (data : string) => {
                      buffers.stderr += data
                    }
                  })

                  return result.stdout
                } catch (error) {
                  console.log(
                    `Command failed inside the sandbox : ${error} \n 
                    stdout : ${buffers.stdout} \n
                    stderror : ${buffers.stderr} \n 
                    `
                  )

                  return console.log(
                    `Command failed inside the sandbox : ${error} \n 
                    stdout : ${buffers.stdout} \n
                    stderror : ${buffers.stderr} \n
                    `
                  )
                }
              })
            }
          }),

          // files tool
          createTool({
            name : "createOrUpdateFiles",
            description : "Create or update files in the sandbox",
            // @ts-ignore
            parameters : z.object({
              files : z.array( 
                z.object({
                  path : z.string(),
                  content : z.string()
                })
               )
            }),
            handler : async ({files}, {step, network}) => { 
              const newFiles = await step?.run("createOrUpdateFiles", async () => {
                try {
                  const updatedFiles = network.state.data.files || {}
                  const sandbox = await getSandbox(sandboxId)

                  for(const file of files ){
                    await sandbox.files.write(file.path, file.content)
                    updatedFiles[file.path] = file.content
                  }

                  return updatedFiles
                } catch (error) {
                    console.log(`Error while writing files ${error}`)
                    return "Error" + error
                }
              });
              // It might be a object file or the error string but we are only taking file
              if(typeof newFiles === "object"){
                network.state.data.files = newFiles
              }
            }
          }),

          // Read files
          // It reads for not to halusinate
          createTool({
            name : "readFiles",
            description : "Read files from the sandbox ",
            // @ts-ignore
            parameters : z.object({
              files : z.array(z.string())
            }),

            handler : async({files}, {step}) => {
              return await step?.run("readFiles", async () => {
                try {
                  const sandbox = await getSandbox(sandboxId)
                  const contents = [];
                  for(const file of files){
                    const individualContent = await sandbox.files.read(file)
                    contents.push({path : file, individualContent})
                  }

                  return JSON.stringify(contents);
                } catch (error) {
                  return "Error while reading file : " + error;
                }
              })
            }
          })
        ],

        lifecycle : {
          onResponse : async ({result, network}) => {
            const assistantLastMessage = assistentLastMessageContent(result)

            if(assistantLastMessage && network){
              if(assistantLastMessage.includes("<task_summary>")){
                network.state.data.summary = assistantLastMessage
              }
            }

            return result
          }
        }
      });

      const network = createNetwork <AgentState> ({
        name : "coding-agent-network",
        agents : [codeAgent],
        maxIter : 15,

        router : async ({network}) => {
          const summary = network.state.data.summary

          if(summary){
            return 
          }

          return codeAgent
        }
      })


      const result = await network.run(event.data.value);

      // !Error
      const isError = !result.state.data.summary ||Object.keys(result.state.data.files || {}).length === 0;
    // generate the URL

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId)
        const host = sandbox.getHost(3000);
        return `https://${host}`
    })

    // * After the job store the data in the database
    await step.run("save-result", async () => {
      // Before saving check for the error
      if(isError){
        return await prisma.message.create({
          data : {
            projectId : event.data.projectId,
            content : "Something went wrong, try again.",
            role : "ASSISTANT",
            type : "ERROR"
          } 
        })
      }
        return await prisma.message.create({
          data : {
            projectId : event.data.projectId,
            content : result.state.data.summary,
            role : "ASSISTANT",
            type : "RESULT",

            fragment : {
              create : {
                sandboxUrl: sandboxUrl,
                files : result.state.data.files,
                title : "Fragment"
              }
            }
          }
        })
    })

    return { 
      url : sandboxUrl,
      title : "Fragment",
      files :  result.state.data.files,
      summary : result.state.data.summary
     };
  },
);




