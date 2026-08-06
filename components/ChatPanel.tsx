import { Message, StatusStep } from '@/types/workspace'
import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import PricingModal from './PricingModal';
import { cn } from '@/lib/utils';
import { BlueTitle } from './reusables';
import { ArrowUp, Loader2, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
interface ChatPanelProps{
    messages: Message[];
    isGenerating: boolean;
    isImproving: boolean;
    statusLog: StatusStep[];
    credits: number;
    initialPrompt: string | null;
    onGenerate: (prompt: string, imageUrl?: string) => Promise<void>;
    // onStop: () => void;
    userId: string;
    workspaceId: string | null;
    appTitle: string | null;
}

const ChatPanel = ({
    messages,
    isGenerating,
    isImproving,
    statusLog,
    credits,
    initialPrompt,
    onGenerate,
    // onStop,
    userId,
    workspaceId,
    appTitle,

}: ChatPanelProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [input, setInput] = useState("");
    
    const noCredits = credits <= 0;
    const canSubmit = input.trim().length>0 && !isGenerating && !isImproving && !noCredits;
    const hasAutoSubmittedRef = useRef(false);

    //input box resizing acc to input
    useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  // auto-scroll on msgs or updates
    useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isGenerating, isImproving]);

    useEffect(() => {
    if (!initialPrompt || hasAutoSubmittedRef.current || messages.length > 0)
      return;
    hasAutoSubmittedRef.current = true;
    onGenerate(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


    const status = [
        {label: "Planning the component structure", status: "done"},
        {label: "Writting files and components", status: "done"},
        {label: "Validating packages...", status: "running"}
    ];

    const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating || isImproving || noCredits) return;
    setInput("");
    await onGenerate(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };




  return (
    <div className='flex w-[320px] shrink-0 flex-col bg-[#0d0d0d]'>
        <div className="flex items-center justify-between border-b border-white/6 px-2 py-3">
            <BlueTitle>{appTitle}</BlueTitle>

            <PricingModal reason={noCredits ? "credits" : "upgrade"}>
                
                <span className={cn(
              "rounded-full px-2 py-0.5 text-[11px] transition-colors",
              noCredits
                ? "bg-red-500/15 text-red-400/80 hover:bg-red-500/25"
                : "bg-white/6 text-white/30 hover:bg-white/10 hover:text-white/50"
            )}
          >
            {noCredits
              ? "No credits · Upgrade"
              : `${credits} credit${credits !== 1 ? "s" : ""}`}

                </span>

            </PricingModal>
        </div>

        <div
        ref = {scrollRef}
        className='flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden'
        >
         {messages.length === 0 && !isGenerating && (
            <div className='flex h-full items-center justify-center'>
                <p className='text-center text-xs text-white/20'>Describe What you want to build...</p>

            </div>
         )}  
         <div className='space-y-4'>
            {messages.map((msg, i) =>(

                   <div key={i}>
                    {msg.role == "user" ? (
                        <div className='flex items-start justify-end gap-2'>
                            <div className='max-w-[85%] space-y-1.5'>
                                {msg.imageUrl && (
                                    <img
                                    src={msg.imageUrl}
                                    alt='uploaded'
                                    className="max-h-40 w-full rounded-lg object-cover"
                                    />
                                )}

                                <div className='rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2.5'>
                                <p className='text-[13px] leading-relaxed text-white/80 wrap-break-word'>{msg.content}</p>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-start gap-2'>
                            <Image
                            src = "/logo-short.jpeg"
                            alt = "forge"
                            width = {24}
                            height = {24}
                            className = "mt-0.5 h-6 w-6 shrink-0 rounded-md"
                            />
                            <div className='min-w-0 rounded-2xl rounded-tl-sm bg-white/5 px-3.35 py-2.5'>
                                <p className='text-[13px] leading-relaxed text-white/70 wrap-break-word'>{msg.content}</p>
                            </div>
                        </div>

                    )}
                   </div> 
            ))}
        </div> 
        {/* Status Steps */}
        {isGenerating && 
            <div className=' flex items-start gap-2'>
                <Image
                src = "/logo-short.jpeg"
                alt = "forge"
                width = {24}
                height = {24}
                className = "mt-0.5 h-6 w-6 shrink-0 rounded-md"
                />
                <div className='rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-3'>
                    <div className='space-y-2'>
                        {statusLog.map((step, i)=>(
                            <div key={i} className='flex items-center gap-2.5'>
                                                    <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {step.status === "running" ? (
                          <Loader2 className="h-3 w-3 animate-spin text-blue-400/80" />
                        ) : (
                          <svg
                            className="h-3 w-3 text-white/25"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[12px] transition-colors duration-300",
                          step.status === "running"
                            ? "text-white/75"
                            : "text-white/25"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>  

                        ))}
                    </div>
                </div>
            </div>}

        </div>
        <div className='border-t border-white/6 px-3'>

            <div
            className={
                cn(
                    "rounded-xl bg-white/4 transition-colors",
                    isGenerating || isImproving || noCredits
                    ? "border-white/4 opacity-60"
                    : "border-white/8 hover:border-white/12",
                )}
            >
                <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isGenerating || isImproving || noCredits}
                placeholder={
                    noCredits
                    ? "Upgrade to keep building"
                    : isImproving
                    ? "Cline is improving your app"
                    : isGenerating
                    ? "Generating"
                    : "Ask AI to modify"
                }
                rows={1}
                className="w-full resize-none bg-transparent px-3.5 pb-2 pt-3 text-[13px] text-white/80 placeholder:text-white/20 focus:outline-none"
                style={{ maxHeight: 160 }}
                />
                <div className='flex items-center justify-between px-2 pb-2'>
                    <Button
                    variant="ghost"
                    size="icon"
                    disabled
                    className="h-7 w-7 rounded-lg text-white/25 hover:bg-white/6 hover:text-white/50 disabled:opacity-40"
                    >
                    {/* {isGenerating || isImproving ? ( */}
                        <Paperclip className="h-3.5 w-3.5" />
                    {/* ) : (  */}
                        {/* <ArrowUp className="h-3.5 w-3.5" /> */}
                    {/* )} */}
                    </Button>
                    <Button
                    size={"icon"}
                    onClick={handleSubmit}
                    disabled = {!canSubmit}
                    className={cn(
                        "h-7 w-7 rounded-lg transition-all",
                        canSubmit
                            ? "bg-white text-black hover:bg-white/90 active:scale-95"
                            : "bg-white/8 text-white/20 shadow-none"
                        )}
                    >
                        {isGenerating || isImproving ? (
                            <Loader2 className='h-3.5 w-3.5 animate-spin'/>
                        ) : (
                            <ArrowUp className='h-3.5 w-3.5'/>
                        )}

                    </Button>
                </div>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-white/15">
            {isGenerating || isImproving
                ? "Click ■ to stop generation"
                : "⏎ to send · Shift+⏎ for new line"}
            </p>
        </div>
    </div>   
  );
};

export default ChatPanel