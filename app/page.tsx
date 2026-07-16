"use client"


import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { BlueTitle, GrayTitle } from "@/components/reusables";
import { Badge } from "@/components/ui/badge";
import { PLACEHOLDERS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function Home() {

  const {isSignedIn} = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const[prompt, setPrompt] = useState("");
  const [isFocused, setisFocused] = useState(false);
  const [placeholderIndex, setplaceholderIndex] = useState(0);

  useEffect(()=>{
    if(prompt || isFocused) return;
    const t = setInterval(() => {
      setplaceholderIndex((i) => (i+1) % PLACEHOLDERS.length);
    }, 3000);
    return()=>clearInterval(t);
  }, [prompt, isFocused]);

    useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);
  

  const handleSubmit = () =>{
    if (!prompt.trim() || !isSignedIn ) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`); 
  }

  // shift + enter for new line
  const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) =>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      handleSubmit();
    }
  };



  return (
    <main className = "min-h-screen bg-[#0a0a0a] selection:*:bg-white/20">
      <section className = " relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
        
        <HoleBackground 
        strokeColor="rgba(255, 255, 255, 0.05)"
        className="absolute inset-0 h-full w-full"
        style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />
        <Badge variant={'outline'} className="gap-2 p-4  backdrop-blur-sm">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"/>
          Powered by Gemini 3.5 Flash
        </Badge>

        <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl
         leading-tight tracking-tight sm:text-5xl lg:text-7xl z-10">
          <GrayTitle> Forge your dream</GrayTitle>
          <br />
          <BlueTitle>from a single prompt</BlueTitle>

        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance leading-relaxed text-white/40 z-10">
          Describe What you want to build. AI writes the code, picks the 
          packages, and renders a live preview all inside your browser
        </p>

        {/* {Prompt Box} */}
        <div className="relative mx-auto mt-12 w-full max-w-2xl">
          <div className={cn(
            "rounded-2xl border bg-[#111111] duration-200",
            isFocused
            ? "border-white/20 ring-1 ring-white/8"
            : "border-white/8",
          )} >
            <textarea ref={textareaRef}
            rows={1}
            className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base
            overflow-y-hidden"
            style={{ minHeight: 56, maxHeight: 200 }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setisFocused(true)}
            onBlur={() => setisFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIndex]}

            ></textarea>

          </div>
        </div>

      </section> 

    </main>
  );
}
