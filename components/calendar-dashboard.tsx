"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { ScheduleView } from "@/components/schedule-view";
import { AnimatedBackground } from "@/components/animated-background";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function CalendarDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"schedule" | "chat">("schedule");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex h-screen overflow-hidden relative">
      <AnimatedBackground />

      {isDesktop ? (
        <Sidebar className="w-64 border-r h-screen" />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar className="w-full h-full" />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-center gap-4 p-4 bg-background/80 backdrop-blur-sm">
          <Button
            variant={view === "schedule" ? "default" : "outline"}
            onClick={() => setView("schedule")}
            className="transition-all duration-300 ease-in-out"
          >
            Schedule
          </Button>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            onClick={() => setView("chat")}
            className="transition-all duration-300 ease-in-out"
          >
            AI Assistant
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {view === "schedule" && <ScheduleView date={date} />}

          {view === "chat" && <ChatInterface />}
        </div>
      </div>
    </div>
  );
}
