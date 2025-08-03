import { Button } from "@/components/ui/button"
import prisma from "@/lib/db"
export default async function App(){
  const users = prisma.user.findMany();
  return (
    <div>
        <Button className=" bg-amber-300" >Hello world</Button>
    </div>
  )
}