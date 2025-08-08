'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";


export default function App(){
  const [value, setValue] = useState("");

  const trpc = useTRPC()
  const { data : messages } = useQuery(trpc.messages.getMany.queryOptions())
  const invoke = useMutation(trpc.messages.create.mutationOptions({
    onSuccess : () => {
      toast("Done the work");
    }
  }))

  return (
    <div className=" max-w-8xl p-20" >
        <Input value={value}  onChange={(e) => setValue(e.target.value)} />
        <Button
          onClick={() => invoke.mutate({value : value})}
        >click me</Button>

        {JSON.stringify(messages, null, 2)}
    </div>
  )
}