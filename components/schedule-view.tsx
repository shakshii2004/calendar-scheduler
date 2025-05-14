"use client";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Draggable } from "@/components/draggable";
import { motion } from "framer-motion";
import { Clock, CalendarIcon, Plus } from "lucide-react";
import { useEvents } from "@/lib/event-context";
import { useState, useEffect } from "react";

interface ScheduleViewProps {
  date?: Date;
}

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: "work" | "personal" | "meeting" | "focus";
}

export function ScheduleView({
  date: propDate = new Date(),
}: ScheduleViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(propDate);
  const { events } = useEvents();

  // Update currentDate when propDate changes
  useEffect(() => {
    setCurrentDate(propDate);
  }, [propDate]);

  // Navigate to previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getCategoryColor = (category: Event["category"]) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "personal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "meeting":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "focus":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-background/80 backdrop-blur-sm border shadow-lg">
        <CardHeader className="flex flex-col space-y-2">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(currentDate, "EEEE, MMMM d, yyyy")}</span>
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                Previous Day
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextDay}>
                Next Day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <Draggable key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{event.time}</span>
                        <span>·</span>
                        <span>{event.duration}</span>
                      </div>
                    </div>
                    <Badge
                      className={cn("ml-2", getCategoryColor(event.category))}
                    >
                      {event.category}
                    </Badge>
                  </div>
                </motion.div>
              </Draggable>
            ))}

            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No events scheduled for this day</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
