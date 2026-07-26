// import { WorkspaceClient } from "@/components/WorkspaceClient";
// import { getWorkspaceUser, getWorkspaceById } from "@/actions/workspace";

import { WorkspaceClient } from "@/components/WorkspaceClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";
import React from "react";

interface WorkspacePageProps {
  searchParams: Promise<{ prompt?: string; id?: string }>;
}

const  WorkspacePage = async ({searchParams,}: WorkspacePageProps) => {

  // const user = await getWorkspaceUser();
  const {userId} = await auth();
  if(!userId) redirect("/");

  const {prompt, id} = await searchParams;

  // let workspace = null;
  // if (id) {
  //   workspace = await getWorkspaceById(id, user.id);
  // }

  return (
    <WorkspaceClient/>
    // <WorkspaceClient
    //   initialPrompt={prompt ?? null}
    //   workspace={workspace}
    //   userCredits={user.credits}
    //   userId={user.id}
    //   userPlan={user.plan}
    // />
  );
}

export default WorkspacePage