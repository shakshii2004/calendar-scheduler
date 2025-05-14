"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  Clock,
  BarChart3,
  Settings,
  PlusCircle,
  Target,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("schedule");

  const menuItems = [];

  return (
    <div
      className={cn(
        "bg-background/80 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="relative">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
        </div>
        <div>
          <h3 className="font-medium text-sm">AI Scheduler</h3>
          <p className="text-xs text-muted-foreground">Smart Scheduling</p>
        </div>
      </div>

      <div className="flex-1 py-4">
        <div className="px-3 mb-4"></div>
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <div className="bg-primary/10 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-1">AI Assistant</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Get scheduling help from your AI assistant
          </p>
          <Button size="sm" className="w-full">
            Open Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
