"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
export function FetchPageFromClientAndShowHeaders(){
  const [headers, setHeaders] = useState<Record<string, string>>({});
  // button to fetch the page from the server and show the headers
  return (
    <div>
      <button onClick={() => {
        fetch('/').then(res => {
          setHeaders(Object.fromEntries(res.headers.entries()));
        });
      }}>Fetch Page</button>
      <code>
        <pre>{JSON.stringify(headers, null, 2)}</pre>
      </code>
    </div>
  )
}

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
        <p className="text-sm text-gray-500">Rendered at {renderedAt}</p>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random square
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
          Remove a random number
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
          <div key={number._id}
          // random background color based on number value, rectanges
          style={{
            backgroundColor: hexCodes[number.value % hexCodes.length],
            width: '100%',
            height: '100px',
          }}

          />
        ))}
      </div>
    </div>
  );
}
