'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";


export default function App(){
  const [value, setValue] = useState("");

  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
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
    </div>
  )
}