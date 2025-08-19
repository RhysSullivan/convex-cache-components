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

export default function Home({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
}) {
  const { numbers } = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);
  const removeNumber = useMutation(api.myFunctions.removeNumber);


  return (
    <div className="flex flex-row gap-8 w-full justify-between p-8">
      <div className="flex flex-col gap-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold">Reactive client-loaded data</h2>
        <button
          className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
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
        <code>
          <pre>{JSON.stringify(numbers, null, 2)}</pre>
        </code>
      </div>
      <FetchPageFromClientAndShowHeaders />
    </div>
  );
}
