"use client";

import { FileData, StatusStep } from "@/types/workspace";
import { useEffect, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertTriangle, Code, Eye, Wand2 } from "lucide-react";
import {RingLoader} from "react-spinners"
import { Button } from "@/components/ui/button";

const PLACEHOLDER_FILES = {
  "/App.js": {
    code: `export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <p style={{ fontSize: 14 }}>Your app will appear here</p>
      </div>
    </div>
  );
}`,
  },
};
const BASE_DEPENDENCIES: Record<string, string> = {
  "react-is": "latest",
  "react-router-dom": "latest",
  "lucide-react": "latest",
  recharts: "latest",
  "date-fns": "latest",
  "framer-motion": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  zod: "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-tooltip": "latest",
  "@radix-ui/react-accordion": "latest",
  "@radix-ui/react-select": "latest",
  axios: "latest",
  clsx: "latest",
  "class-variance-authority": "latest",
  "tailwind-merge": "latest",
};

type ActiveTab = "preview" | "code";

interface CodePanelProps {
    fileData: FileData | null
    isGenerating: boolean;
    isImproving: boolean;
    statusLog: StatusStep[];
    onFilePatch: (patches: FileData) => void;
    onFixError: (error: string) => Promise<void>;
    
}
function SandPackInner({
  isGenerating,
  statusLog,
  activeTab,
  setActiveTab,
  // onImprove,
  onFixError,
  fileData,
  // appTitle,
  isImproving,
  // isProUser,
}: {
  isGenerating: boolean;
  statusLog: StatusStep[];
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  // onImprove: (userRequest: string) => Promise<void>;
  onFixError: (error: string) => Promise<void>;
  fileData: FileData | null;
  // appTitle: string | null;
  isImproving: boolean;
  // isProUser: boolean;
}) {
    const {sandpack, listen} = useSandpack();
    //listen - for error listening

    // pushing file updates into sandpack without remounting
    // provide key to sandpackProvider on the file PATH SET only
    // when file content changes, we push them using updateFile()
    // sandpack stays mounted and preview refreshes
    const prevFilesRef = useRef<Record<string, { code: string }>>({});

    const [previewError, setPreviewError] = useState<string | null >("Error in the app");
    const unsubscribedRef = useRef<(() => void) | null>(null);

    useEffect(()=> {
      if(isGenerating) setPreviewError(null);
    }, [isGenerating]);


    // sandpack bundle error
    useEffect(()=>{
      unsubscribedRef.current = listen((msg) =>{
        if(msg.type === "action" && "action" in msg && msg.action === "show-error"){
          const errMsg = "message" in msg && typeof msg.message === "string" 
          ? msg.message : "An error occured in the preview";
          setPreviewError(errMsg);
          return;
        }
        // compile error

        if(msg.type === "compile" && "error" in msg){
            const errMsg = "message" in msg && typeof msg.message === "string" 
          ? msg.message : "Compile error in preview";
          setPreviewError(errMsg);
          return;
        }

        if(msg.type === "success"){
          setPreviewError(null);
        }
      });
      return () => unsubscribedRef.current?.();
    }, [listen]);

    useEffect(()=> {
        if(!fileData?.files) return;
        const prev = prevFilesRef.current;
        for (const [path, { code }] of Object.entries(fileData.files)) {
      if (prev[path]?.code !== code) {
        sandpack.updateFile(path, code);
      }
    }
    prevFilesRef.current = fileData.files;

    }, [fileData?.files]);

    useEffect(()=>{
      if(fileData) setActiveTab("preview");
    }, [fileData]);


    return(
    <Tabs value={activeTab} 
    onValueChange={(v) => setActiveTab(v as ActiveTab)}
    className="flex h-full flex-col gap-0">

        <div className="flex items-center justify-between border-b border-white/6 px-2">
        <TabsList
        variant={"line"}
        className={"h-auto gap-0 rounded-none bg-transparent p-0"}
        >
            <TabsTrigger value="code">
            <Code className="h-3.5 w-3.5"/>
            Code
            </TabsTrigger>
            <TabsTrigger value="preview">
            <Eye className="h-3.5 w-3.5"/>
            Preview
            </TabsTrigger>
        </TabsList>
        </div>

          <div className="relative flex-1 overflow-hidden">
            {/* loading ui */}
            { (isGenerating || isImproving && 
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a]/85 backdrop-blur-sm">
                <RingLoader color="#60a5fa" size={65} speedMultiplier={0.8} />

                  <div className="flex flex-col items-center gap-1.5">
                    <p className="text-sm font-medium text-white/60">
                      {isImproving ? "Improving with AI Agent..." : (statusLog[statusLog.length - 1]?.label ?? "Generating...")}
                    </p>
                    <p className="text-xs text-white/20">
                      This usually takes 10-20 seconds
                    </p>
                  </div>
          </div>
          )}

            <SandpackLayout
            style={{
                height: "100vh",
                border: "none",
                borderRadius: 0,
                background: "transparent",

            }}
            >        
        {/* Tab for the c ode Preview */}
        <TabsContent value="preview"
        keepMounted
        className={"mt-0 h-full w-full"}
        >
        <SandpackPreview
        style={{height: "90%"}}
        showOpenInCodeSandbox = {false}
        />

    </TabsContent>


        {/* Tab for the code  */}
    <TabsContent value="code"
    keepMounted
    className={"mt-0 flex h-full w-full"}
    >
        <SandpackFileExplorer
        style={{
            height: "90%",
            width: "100px",
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
        }}
        />
        <SandpackCodeEditor
        style={{height: "90%", flex: 1}}
        showTabs
        showLineNumbers 
        showInlineErrors
        closableTabs
        readOnly
        />

    </TabsContent>
    </SandpackLayout>

    </div>
      {previewError && 
        !isGenerating && !isImproving &&
        activeTab === "preview" && (
       <div className="absolute inset-x-0 -bottom-3 z-20 border-t border-red-500/20 bg-red-950/99 p-4 pb-6">
          <div>
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400/70"/>
            <div className="min-w-0 gap-2.5">
              <p className="text-xs font-medium text-red-400/80">Preview Error</p>
              <p className="break-all text-[11px] text-red-300/50">{previewError}</p>
            </div>
            <Button
              onClick={()=> onFixError(previewError)}
              variant ="destructive"
              size={"sm"}
              >
                <Wand2 className="h-3 w-3"/>
                Fix with AI
            </Button>
          </div>
        </div>
      )}
    </Tabs>
    );

};

export function CodePanel({
  fileData,
  isGenerating,
  statusLog,
//   onImprove,
  onFixError,
  onFilePatch: _onFilePatch,
//   appTitle,
  isImproving,
//   isProUser,

}: CodePanelProps){
    const [activeTab, setActiveTab] = useState<ActiveTab>("preview");

    const files = fileData?.files ?? PLACEHOLDER_FILES;
    const dependencies = {
        ...BASE_DEPENDENCIES,
        ...(fileData?.dependencies ?? {}),
    };

    const filePathKey = Object.keys(files).sort().join("|");

    return(
        <div className="flex flex-1 flex-col overflow-hidden">
            <SandpackProvider 
            key={filePathKey}
            template="react"
            theme={dracula}
            files={files}
            customSetup={{dependencies}}
            options={{
                externalResources: ["https://cdn.tailwindcss.com"],
                recompileMode: "delayed",
                recompileDelay: 500,
            }}
            >
            <SandPackInner
            fileData = {fileData}
            isGenerating = {isGenerating}
            activeTab = {activeTab}
            setActiveTab = {setActiveTab}
            statusLog = {statusLog}
            isImproving={isImproving}
            onFixError={onFixError}
           />   
                
            </SandpackProvider>
        </div>
    )
}