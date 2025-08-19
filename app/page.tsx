import Home from "./inner";
import { api } from "@/convex/_generated/api";
import { preloadQueryCached } from "./cache-convex";
import { getFunctionName } from "convex/server";

export default async function ServerPage() {
  const preloaded = await preloadQueryCached(getFunctionName(api.myFunctions.listNumbers), {
    count: 10,
  });

  
  return (
      <Home preloaded={preloaded.preloaded}
        title={`Server cached data being kept in sync with client via cache invalidation from use cache`}
        renderedAt={preloaded.renderedAt}
      />
  );
}
