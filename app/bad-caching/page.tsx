import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { unstable_cacheLife as cacheLife } from "next/cache";
import Home from "../inner";

export default async function ServerPage() {
    "use cache"
    const preloaded = await preloadQuery(api.myFunctions.listNumbers, {
      count: 10,
    });

    cacheLife('minutes')
  const renderedAt = new Date().toISOString();
    return (
        <Home preloaded={preloaded} title={`Stale data from server being hydrated with fresh data on client`} renderedAt={renderedAt}     />
    );
  }
  