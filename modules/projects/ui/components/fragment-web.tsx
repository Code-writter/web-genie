import { Fragment } from "@/lib/generated/prisma"
import { useState } from "react"
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Hint } from "@/components/hint"

interface  Props {
    data : Fragment
}

export default function FragmentWeb({data} : Props){
    const [copied, setCopied] = useState(false)
    const [fragmentKey, setFragmentKey] = useState(0)

    const onRefresh = () => {
        setFragmentKey((prev) => prev + 1)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true)
        // It will make the setCopied false after 2sec
        setTimeout(() => setCopied(false) , 2000)
    }

    return (
        <div className=" flex flex-col w-full h-full" >
            <div className=" p-2 border-b bg-sidebar flex items-center gap-x-2" >

                {/* Refresh Button */}
                <Hint text="Refresh" side="bottom" align="start" >
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onRefresh}  

                    >
                        <RefreshCcwIcon />
                    </Button>
                </Hint>

                {/* Copy button of preview */}
                <Hint text="Click to copy" side="bottom" >
                    <Button 
                        
                        size="sm" 
                        variant="outline" 
                        onDoubleClick={handleCopy}
                        disabled={!data.sandboxUrl || copied}  
                        className="flex-1 justify-start text-start font-normal "    
                    >
                        <span className=" truncate" > {data.sandboxUrl} </span>
                    </Button>
                </Hint>

                {/* Open in new Tab button */}
                <Hint text="Open in a new tab" side="bottom" align="start" >
                    <Button
                        size="sm"
                        disabled={!data.sandboxUrl}
                        variant="outline"
                        onClick={() => {
                            if(!data.sandboxUrl) return
                            window.open(data.sandboxUrl, "_blank")
                        }}
                    >
                        <ExternalLinkIcon />
                    </Button>
                </Hint>
            </div>

            {/* Overall fragment view form the sandbox */}
            <iframe
                key={fragmentKey}
                className=" h-full w-full"
                sandbox="allow-forms allow-scripts allow-same-origin"
                loading="lazy"
                src={data.sandboxUrl}
            />
        </div>
    )
} 