import { Button } from "@/components/ui/button"

import { trpc, getQueryClient } from "@/trpc/server"

import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import Client from "./client"

import { Suspense } from "react"

import Loader from "@/components/loader"

export default async function App(){
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text : "Abhishek"}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <Suspense fallback={<Loader/>} >
      <Client />
      </Suspense>
    </HydrationBoundary>
  )
}