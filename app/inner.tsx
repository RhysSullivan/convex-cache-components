"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

const hexCodes = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F0FF33",
  "#33F0FF",
  "#FF33F0",
  "#8A2BE2",
  "#00FFFF",
  "#FFD700",
  "#A9A9A9",
];
const messages = [
  "Hey, how's it going?",
  "Did you see the news today?",
  "Don't forget to pick up milk!",
  "I'm running a bit late, be there soon.",
  "What's for dinner?",
  "Just wanted to say hi!",
  "Having a great time!",
  "Can we reschedule for tomorrow?",
  "That's hilarious! 😂",
  "See you later alligator!"
];

function FakeMessage(props: {
  seed: number;
}){



 // circle avatar + message
  return <div className="flex flex-row gap-4">  
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
    style={{ backgroundColor: hexCodes[props.seed % hexCodes.length] }}
    />
    <div className="">
      {messages[props.seed % messages.length]}
    </div>
  </div>
}

export default function Home({
  preloaded,
  title,
  renderedAt,
}: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
  title: string;
  renderedAt: string;
}) {
  const { numbers } = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);
  const removeNumber = useMutation(api.myFunctions.removeNumber);
  const [reloading, setReloading] = useState(false);


  return (
    <div className="flex flex-row gap-8 w-full justify-between p-8">
      <div className="flex flex-col gap-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Rendered at {renderedAt}</p>
        <span>You are seeing server side cached data that is then hydrateded & updated on the client</span>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 1000) + 1 });
          }}
        >
          Add a message
        </button>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            if (numbers?.numbers.length) {
              const randomIndex = Math.floor(Math.random() * numbers.numbers.length);
              const id = numbers.numbers[randomIndex]._id;
              if (id) {
                void removeNumber({ id });
              }
            }
          }}
        >
          Remove a random message
        </button>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            setReloading(true);
            // give React a tick to update the button UI before reloading
            setTimeout(() => window.location.reload(), 50);
          }}
          disabled={reloading}
          aria-busy={reloading}
        >
          {reloading ? "Reloading..." : "Reload page"}
        </button>
        {numbers?.numbers.map((number) => (
          <FakeMessage key={number._id} seed={number.value} />
        ))}
      </div>
    </div>
  );
}
