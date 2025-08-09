
interface Props{
    params : Promise<{
        projectId : string
    }>
}

export default async function project ({params} : Props){
    const projectId = await params;



    return (
        <div>
            projectId : {JSON.stringify(projectId)}
        </div>
    )
}