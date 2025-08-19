import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
        return new Response('No key provided', { status: 400 });
    }
    console.log('Invalidating cache for', key);
    revalidateTag(key);
    return new Response('OK');
}