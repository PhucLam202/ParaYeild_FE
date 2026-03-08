import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005/api/v1";

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const targetPath = path.join("/");
    const search = req.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${targetPath}${search}`;

    const headers: HeadersInit = {
        "Content-Type": req.headers.get("Content-Type") || "application/json",
    };

    const body = req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
    });

    const data = await response.text();

    return new NextResponse(data, {
        status: response.status,
        headers: {
            "Content-Type": response.headers.get("Content-Type") || "application/json",
        },
    });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
