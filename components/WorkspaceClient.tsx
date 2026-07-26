"use client";

import { useCallback, useState } from "react";
import { CodePanel } from "./CodePanel";
import { FileData, StatusStep } from "@/types/workspace";

interface WorkspaceClientProps {
  initialPrompt: string | null;
//   workspace: WorkspaceData | null;
  userCredits: number;
  userId: string;
  userPlan: string;
}

export function WorkspaceClient({
    initialPrompt,
    // workspace,
    userCredits,
    userPlan,
}: WorkspaceClientProps){

    const [fileData, setFileData] = useState<FileData | null>(
    // parseFileData(workspace?.fileData)
    null
  );
  const [credits, setCredits] = useState(userCredits);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLog, setStatusLog] = useState<StatusStep[]>([]);

  const handleFilePatch = useCallback((patches: FileData) => {
    setFileData(patches);
  }, []);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0a]">
            {/* Chat Panel - left  */}
            <div className="w-[320px] shrink-0 border-r border-white/6 bg-[#0d0d0d] flex items-center justify-center">
                <p className="text-xs text-white/20 ">Chat coming soon</p>
            </div>

            {/* code panel - right */}
            <CodePanel
            fileData={fileData}
            isGenerating={isGenerating}
            statusLog={statusLog}
            onFilePatch={handleFilePatch}
            />
        </div>
    );
};