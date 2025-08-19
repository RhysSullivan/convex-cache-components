import { ConvexClient } from "convex/browser";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

Bun.serve({
    port: 3001,
    // `routes` requires Bun v1.2.3+
    routes: {
      // Static routes
      "/api/status": new Response("OK"),
  
      // Per-HTTP method handlers
      "/api/cache/subscribe": {
        POST: async req => {
          const body = await req.json();
          const { key, argsJSON, functionName } = body;
          console.log('Subscribing to updates for', key);
          convex.onUpdate(functionName, argsJSON, () => {
            console.log('Invalidating cache for', key);
            try {
              fetch(`http://localhost:3000/api/invalidate?key=${key}`, {
                method: "POST",
              });
            } catch (error) {
              console.error('Error invalidating cache for', key, error);
            }
          })
          return Response.json({ created: true, ...body });
        },
      },
    },
  });

  console.log('Cache listener started on http://localhost:3001');