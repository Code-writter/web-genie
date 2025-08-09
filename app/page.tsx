'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function App(){
  const [value, setValue] = useState("");
  const router = useRouter();
  const trpc = useTRPC()

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError : (error) => {
      toast.error(error.message)
    },

    onSuccess : (data, variables, context) => {
      router.push(`/project/${data.id}`)
    }
  }))

  return (
    <div className=" max-w-8xl p-20" >
        <Input value={value}  onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({value : value})}
        >click me</Button>

    </div>
  )
}