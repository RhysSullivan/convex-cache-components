import { NextjsOptions, preloadQuery } from "convex/nextjs";
import { Preloaded } from "convex/react";
import { ArgsAndOptions, FunctionReference } from "convex/server";
import { convexToJson } from "convex/values";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { unstable_cacheLife as cacheLife } from "next/cache";
export async function preloadQueryCached<Query extends FunctionReference<"query">>(
    functionName: string,
    ...args: ArgsAndOptions<Query, NextjsOptions>
  ): Promise<Preloaded<Query>> {
    "use cache"
      const argsJSON = convexToJson(args[0] ?? {});
      const key = Buffer.from(`${functionName}:${JSON.stringify(argsJSON)}`).toString('base64');
      await fetch(`http://localhost:3001/api/cache/subscribe`, {
        method: "POST",
        body: JSON.stringify({ key, argsJSON, functionName }),
      });
      
      const preloaded = await preloadQuery(functionName, ...args);
      console.log('caching', key);
      cacheTag(key);
      cacheLife('weeks')
      return preloaded;
  }