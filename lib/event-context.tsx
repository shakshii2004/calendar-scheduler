"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: "work" | "personal" | "meeting" | "focus";
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id">) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Meeting",
      time: "09:00 AM",
      duration: "1h",
      category: "meeting",
    },
    {
      id: "2",
      title: "Project Planning",
      time: "11:00 AM",
      duration: "2h",
      category: "work",
    },
    {
      id: "3",
      title: "Lunch Break",
      time: "01:00 PM",
      duration: "1h",
      category: "personal",
    },
  ]);

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        updateEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
