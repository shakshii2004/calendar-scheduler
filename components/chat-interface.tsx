"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, Calendar, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { format } from "date-fns";
import { useEvents } from "@/lib/event-context";

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: "work" | "personal" | "meeting" | "focus";
}

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp?: Date;
}

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { addEvent } = useEvents();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      onFinish: (message) => {
        setTimeout(() => {
          scrollToBottom();
          // Process the message for event creation
          if (message.content.includes("Event scheduled:")) {
            try {
              // Split the text at "Event scheduled:"
              const parts = message.content.split("Event scheduled:");
              if (parts.length > 1) {
                // Extract the JSON part and any additional text
                let jsonStr = parts[1].trim();

                // Check if there's additional text after the JSON
                const jsonEndIndex = jsonStr.indexOf("}");
                if (jsonEndIndex !== -1) {
                  jsonStr = jsonStr.substring(0, jsonEndIndex + 1);
                }

                // Handle potential JSON formatting issues
                const cleanedJsonStr = jsonStr
                  .replace(/```json|```/g, "")
                  .trim();
                const eventData = JSON.parse(cleanedJsonStr);

                // Ensure all required fields are present
                if (
                  eventData.title &&
                  eventData.time &&
                  eventData.duration &&
                  eventData.category
                ) {
                  addEvent(eventData);
                  console.log("Event added successfully:", eventData);
                } else {
                  console.error(
                    "Invalid event data, missing required fields:",
                    eventData
                  );
                }
              }
            } catch (error) {
              console.error("Failed to parse event data:", error);
            }
          }
        }, 100);
      },
      streamProtocol: "text",
    });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [isLoading]);

  useEffect(() => {
    console.log(messages);
    scrollToBottom();
  }, [messages]);

  const tryParseJSON = (text: string) => {
    try {
      // Check if the text contains "Event scheduled:"
      if (text.includes("Event scheduled:")) {
        // Split the text at "Event scheduled:"
        const parts = text.split("Event scheduled:");
        if (parts.length > 1) {
          // Extract the JSON part and any additional text
          let jsonStr = parts[1].trim();
          let additionalText = "";

          // Check if there's additional text after the JSON
          const jsonEndIndex = jsonStr.indexOf("}");
          if (jsonEndIndex !== -1 && jsonEndIndex < jsonStr.length - 1) {
            additionalText = jsonStr.substring(jsonEndIndex + 1).trim();
            jsonStr = jsonStr.substring(0, jsonEndIndex + 1);
          }

          // Clean the JSON string by removing markdown code blocks
          const cleanedJsonStr = jsonStr.replace(/```json|```/g, "").trim();

          // Parse the JSON data
          const eventData = JSON.parse(cleanedJsonStr);

          // Combine the text before "Event scheduled:" with any additional text after the JSON
          const fullText = (
            parts[0].trim() + (additionalText ? "\n\n" + additionalText : "")
          ).trim();

          return (
            <div className="space-y-2">
              {fullText && <p className="text-muted-foreground">{fullText}</p>}
              <Card className="bg-primary/5 p-3 border-primary/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Calendar className="h-4 w-4" />
                  <h4 className="font-medium">Event Scheduled Successfully</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Title:</span>
                    <span className="text-primary">{eventData.title}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{eventData.time}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{eventData.duration}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Category:</span>
                    <span className="capitalize">{eventData.category}</span>
                  </p>
                </div>
              </Card>
            </div>
          );
        }
      }
    } catch (e) {
      console.error("Error parsing event JSON:", e);
    }
    return text;
  };

  // Mock suggestions for the UI
  const suggestions = [
    "Schedule a team meeting next Monday at 10 AM",
    "Block 2 hours for focused work tomorrow",
    "What's my availability this week?",
    "Reschedule my 3 PM call to tomorrow",
  ];

  return (
    <Card className="h-[calc(100vh-8rem)] max-w-2xl mx-auto bg-background/80 backdrop-blur-sm border shadow-lg">
      <CardHeader className="border-b p-4 sticky top-0 z-10 bg-background/95 backdrop-blur-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Calendar AI Assistant
        </CardTitle>
      </CardHeader>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4 h-[calc(100%-8rem)]"
      >
        <div className="space-y-6 pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Calendar Assistant</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                I can help you manage your schedule, create events, and optimize
                your time. What would you like to do today?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                {suggestions.map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto py-2"
                    onClick={() => {
                      handleInputChange({
                        target: { value: suggestion },
                      } as any);
                      setTimeout(() => {
                        const form = document.querySelector("form");
                        if (form)
                          form.dispatchEvent(
                            new Event("submit", { cancelable: true })
                          );
                      }, 100);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-3 max-w-[85%] group hover:bg-accent/5 rounded-xl p-2 transition-colors",
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/30">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "rounded-xl p-3 shadow-sm transition-all",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground group-hover:shadow-md group-hover:bg-primary/90 ml-auto"
                        : "bg-muted group-hover:bg-muted/80 group-hover:shadow-md"
                    )}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.role === "assistant"
                        ? tryParseJSON(message.content)
                        : message.content}
                    </div>
                    <span className="text-[10px] opacity-50 mt-1 inline-block">
                      {message.timestamp
                        ? format(new Date(message.timestamp), "HH:mm")
                        : format(new Date(), "HH:mm")}
                    </span>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/30">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 max-w-[85%] mr-auto"
                >
                  <Avatar className="ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-xl p-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      <CardFooter className="border-t p-4 sticky bottom-0 bg-background/95 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about your schedule or create events..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 bg-background/50 focus:bg-background transition-colors"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
