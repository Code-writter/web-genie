'use client'

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from '@/components/ui/resizable'

import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger
} from '@/components/ui/tabs'


import PromptContainer from "../components/prompt-container";
import { Suspense, useState } from "react";
import Loader from "@/components/loader";
import { Fragment } from "@/lib/generated/prisma";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeView } from "@/components/code-view";
import { FileExplorer } from "@/components/file-explorar";

interface Props {
    projectId : string
}

export default function ProjectView({projectId} : Props){

    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    const [tabState, setTabState] = useState <"preview" | "code"> ("preview")

    const trpc = useTRPC();
    const {data : project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id : projectId,
    }))

    return(
        <div className=" h-screen" >
            <ResizablePanelGroup direction="horizontal" >
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className=" flex flex-col min-h-0"
                >   
                    <Suspense fallback={<p>Loading ...</p>} > 
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    
                    <Suspense fallback={<Loader />} >
                        <PromptContainer 
                            projectId={projectId} 
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle className=" hover:bg-primary transition-colors" />
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    {/* Tabs to see the code or preview */}

                    <Tabs
                        className=" h-full gap-y-0"
                        defaultValue="preview"
                        value={tabState}
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                    >   
                        <div
                            className=" w-full flex items-center p-2 border-b gap-x-2"
                        >
                            <TabsList className=" h-8 p-0 border rounded-md" >
                                <TabsTrigger value="preview" className="rounded-md" >
                                    <EyeIcon /> <span>Demo</span>
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="rounded-md" >
                                    <CodeIcon /> <span>Code</span>
                                </TabsTrigger>
                            </TabsList>
                                <div className=" ml-auto flex items-center gap-x-2" >
                                    <Button asChild size="sm" variant="default" >
                                        <Link href="/pricing" />
                                        <CrownIcon /> Upgrade
                                    </Button>
                                </div>

                        </div>
                            <TabsContent value="preview" >
                                {!! activeFragment && <FragmentWeb data={activeFragment} /> } 
                            </TabsContent>
                            <TabsContent value="code" className=" min-h-0"  >
                                {/* TODO : Code preview  */}
                                {/* <CodeView lang="ts"  code="" /> */}

                                {!! activeFragment?.files && (
                                    <FileExplorer 
                                        files={activeFragment.files as {[path : string] : string} }
                                    />
                                )}

                            </TabsContent>
                    </Tabs>

                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}