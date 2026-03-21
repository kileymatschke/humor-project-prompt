import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

const API_BASE_URL = "https://api.almostcrackd.ai";

const SUPPORTED_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
]);

function normalizeContentType(contentType: string | null) {
    if (!contentType) return null;
    return contentType.split(";")[0].trim().toLowerCase();
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
            return NextResponse.json(
                { error: sessionError.message },
                { status: 500 }
            );
        }

        const accessToken = session?.access_token;

        if (!accessToken) {
            return NextResponse.json(
                { error: "No valid JWT found. Please sign in again." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const humorFlavorId = Number(body?.humorFlavorId);
        const imageUrls = Array.isArray(body?.imageUrls) ? body.imageUrls : [];

        if (Number.isNaN(humorFlavorId)) {
            return NextResponse.json(
                { error: "Invalid humor flavor id." },
                { status: 400 }
            );
        }

        if (imageUrls.length === 0) {
            return NextResponse.json(
                { error: "No image URLs were provided." },
                { status: 400 }
            );
        }

        const results: {
            sourceImageUrl: string;
            imageId: string;
            captions: unknown[];
        }[] = [];

        for (const imageUrl of imageUrls) {
            // Fetch original image bytes from the public URL
            const sourceImageResponse = await fetch(imageUrl);

            if (!sourceImageResponse.ok) {
                return NextResponse.json(
                    {
                        error: `Failed to fetch source image: ${imageUrl}`,
                    },
                    { status: 400 }
                );
            }

            const contentType = normalizeContentType(
                sourceImageResponse.headers.get("content-type")
            );

            if (!contentType || !SUPPORTED_TYPES.has(contentType)) {
                return NextResponse.json(
                    {
                        error: `Unsupported content type for image: ${imageUrl}. Found: ${contentType ?? "unknown"}`,
                    },
                    { status: 400 }
                );
            }

            const imageBytes = await sourceImageResponse.arrayBuffer();

            // Step 1: Generate presigned upload URL
            const presignedResponse = await fetch(
                `${API_BASE_URL}/pipeline/generate-presigned-url`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contentType,
                    }),
                }
            );

            if (!presignedResponse.ok) {
                const errorText = await presignedResponse.text();
                return NextResponse.json(
                    {
                        error: `Failed to generate presigned URL. ${errorText}`,
                    },
                    { status: presignedResponse.status }
                );
            }

            const presignedData: {
                presignedUrl: string;
                cdnUrl: string;
            } = await presignedResponse.json();

            // Step 2: Upload image bytes
            const uploadResponse = await fetch(presignedData.presignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": contentType,
                },
                body: imageBytes,
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                return NextResponse.json(
                    {
                        error: `Failed to upload image bytes. ${errorText}`,
                    },
                    { status: uploadResponse.status }
                );
            }

            // Step 3: Register uploaded image URL
            const registerResponse = await fetch(
                `${API_BASE_URL}/pipeline/upload-image-from-url`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        imageUrl: presignedData.cdnUrl,
                        isCommonUse: false,
                    }),
                }
            );

            if (!registerResponse.ok) {
                const errorText = await registerResponse.text();
                return NextResponse.json(
                    {
                        error: `Failed to register uploaded image. ${errorText}`,
                    },
                    { status: registerResponse.status }
                );
            }

            const registerData: {
                imageId: string;
                now: number;
            } = await registerResponse.json();

            // Step 4: Generate captions for this humor flavor
            const captionsResponse = await fetch(
                `${API_BASE_URL}/pipeline/generate-captions`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        imageId: registerData.imageId,
                        humorFlavorId,
                    }),
                }
            );

            if (!captionsResponse.ok) {
                const errorText = await captionsResponse.text();
                return NextResponse.json(
                    {
                        error: `Failed to generate captions. ${errorText}`,
                    },
                    { status: captionsResponse.status }
                );
            }

            const captions = await captionsResponse.json();

            results.push({
                sourceImageUrl: imageUrl,
                imageId: registerData.imageId,
                captions: Array.isArray(captions) ? captions : [],
            });
        }

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unexpected server error.",
            },
            { status: 500 }
        );
    }
}