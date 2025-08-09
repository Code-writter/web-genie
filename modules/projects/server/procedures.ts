import { inngest } from '@/inngest/client'
import prisma from '@/lib/db'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import z from 'zod'
import { generateSlug } from 'random-word-slugs'


export const projectRouter = createTRPCRouter({
    create : baseProcedure
        .input(
            z.object({
                value : z.string().min(1, {message : "Prompt is required "}).max(10000, {message : "Prompt is too long"})
            })
        )
        .mutation(async ({input}) => {
            const createProject = await prisma.project.create({
                data:{
                    name : generateSlug(2, {
                        format : "kebab",
                    }),

                    messages : {
                        create : {
                            content : input.value,
                            role : "USER",
                            type : "RESULT"
                        }
                    }
                }
            })

            await inngest.send({
                name : "code-agent/run",
                data : {
                    value : input.value,
                    projectId : createProject.id
                }
            })

            return createProject;
        }),


    getMany : baseProcedure
        .query(async () => {
            const projects = prisma.project.findMany({
                orderBy : {
                    createdAt : "desc",
                }
            })

            return projects;
        })
})