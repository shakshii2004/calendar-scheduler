import { createMistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { format } from "date-fns";

// Check if API key exists, otherwise use a fallback mechanism
const apiKey = process.env.MISTRAL_API_KEY || "";

// Only create Mistral client if API key is available
let mistral;
let model;

if (apiKey) {
  mistral = createMistral({
    apiKey: apiKey,
  });
  model = mistral("mistral-large-latest");
}

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  category: "work" | "personal" | "meeting" | "focus";
}

// Get events from localStorage if available (client-side only)
let events: Event[] = [
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
];

// Note: This is a server-side component, so localStorage isn't available here
// The actual events will be managed by the client-side EventContext

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Check if API key is missing
  if (!apiKey) {
    // Return a fallback response when API key is not available
    return new Response(
      JSON.stringify({
        role: "assistant",
        content:
          "I'm sorry, but the AI assistant is currently unavailable. Please try again later or contact support for assistance.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const systemMessage = {
    role: "system",
    content: `You are a smart schedule assistant that helps users manage their schedule efficiently.
    Your capabilities include:
    1. Creating new events with specified time, duration, and category
    2. Listing upcoming events
    3. Modifying existing events
    4. Providing schedule recommendations
    
    When creating events:
    - Extract time, duration, and category from user requests
    - Categories available: work, personal, meeting, focus
    - Use 24-hour format for time
    - Validate time slots for conflicts
    
    When a user requests to create an event, respond with:
    "Event scheduled:" followed by a JSON object containing:
    {
      "title": "Event title",
      "time": "HH:MM AM/PM",
      "duration": "Xh",
      "category": "work|personal|meeting|focus"
    }
    
    Always maintain a professional yet friendly tone. If you don't understand a request, ask for clarification.
    
    Format your responses clearly with event details structured for easy reading.
    
    Current Schedule:
    ${events
      .map(
        (event) =>
          `- ${event.title} at ${event.time} (${event.duration}, ${event.category})`
      )
      .join("\n")}`,
  };

  try {
    // Use the messages array with the system message
    const text = streamText({
      model,
      system: systemMessage.content,
      messages: messages,
    });

    return text.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        role: "assistant",
        content:
          "I'm sorry, but I encountered an error processing your request. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
