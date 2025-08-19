
import { Card } from '@/components/ui/card'
import {RoleTypes, MessageType, Fragment} from '@/lib/generated/prisma'
import { cn } from '@/lib/utils'
import {format} from "date-fns"
import { ChevronRightIcon, Code2Icon } from 'lucide-react'
import Image from 'next/image'

interface Props {
    content : string,
    role : RoleTypes,
    type : MessageType,
    fragment : Fragment | null
    createdAt : Date
    isActiveFragment : boolean,
    onFragmentClick : (fragment : Fragment) => void
    
};

interface UserPromptProps {
    content : string
}

interface AssistantResponseProps {
    content : string,
    type : MessageType,
    fragment : Fragment | null
    createdAt : Date
    isActiveFragment : boolean,
    onFragmentClick : (fragment : Fragment) => void
}

interface FragmentCardProps {
    fragment : Fragment
    isActiveFragment : boolean
    onFragmentClick : (fragment : Fragment) => void
}

function FragmentCard({fragment, isActiveFragment, onFragmentClick} : FragmentCardProps){
    return(
        <button 
            className={cn(
                "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
                isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary"
            )}

            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className=' size-4 mt-0.5'/>
            <div className=' flex flex-col flex-1' >
                <span className=' text-sm font-medium line-clamp-1' >
                    {fragment.title}
                </span>

                <span className=' text-sm'>
                    Preview
                </span>
            </div>

            <div className=' flex items-center justify-center mt-0.5' >
                <ChevronRightIcon className=' size-4 ' />
            </div>
        </button>
    )
}

function UserPrompt ({content} : UserPromptProps){
    return(
        <div className=' flex justify-end pb-4 pr-2 pl-10' >
            <Card className=' rounded-lg bg-muted shadow-none border-none max-w[80%] break-words' >
                {content}
            </Card>
        </div>
    )
}

function AssistantResponse({content, type, fragment, createdAt, isActiveFragment, onFragmentClick} : AssistantResponseProps){
    return(
        <div className={cn(
            " flex flex-col group px-2 pb-4",
            type === "ERROR" && "text-red-700 dark:text-red-500"

        ) } >
            <div className=' flex items-center gap-2 pl-2 mb-2' >
                {/* Add Assistant logo */}
                <Image src="/logo/logo.svg" alt="genie" height={18} width={18} className=' shrink-0 ' />
                <span className=' text-sm font-medium' > Genie </span>
                <span className=' text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' > {format(createdAt, "HH:mm 'on' MMM dd, yyyy")} </span>
            </div>

            {/* Content */}

            <div className=' pl-8.5 flex flex-col  gap-y-4 ' >
                <span>{content}</span>
                {fragment && type === "RESULT" && (
                    <FragmentCard 
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                ) }
            </div>
        </div>
    )
}

export default function PromptCard({content, role, type, fragment, createdAt, isActiveFragment, onFragmentClick} : Props){
    
    if(role === "ASSISTANT"){
        return(
            <AssistantResponse 
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }

    return (
        <div>
            <UserPrompt 
                content={content}
            />
        </div>
    )
}