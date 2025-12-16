
import { GoogleGenAI } from "@google/genai";
import { CharacterAttributes, StyleCoordinates, PoseOption } from "../types";

const getClient = () => {
    // 1. Check Local Storage (BYOK)
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) {
        return new GoogleGenAI({ apiKey: localKey });
    }

    // 2. Check Environment Variable (Dev fallback)
    const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (envKey) {
        return new GoogleGenAI({ apiKey: envKey });
    }

    throw new Error("APIキーが設定されていません。「あなた」タブからAPIキーを設定してください。");
};

export const generateImage = async (
    prompt: string,
    aspectRatio: string = "1:1",
    style: string = "default",
    negativePrompt: string = "",
    styleCoords?: StyleCoordinates,
    pose?: PoseOption,
    character?: CharacterAttributes,
    modelId: string = "niji-v6",
    useHandDrawnLines: boolean = false,
    referenceImageBase64?: string
): Promise<string> => {
    const ai = getClient();

    // 0. Model Specific Base Prompts
    const modelKeywords: Record<string, string> = {
        'niji-v6': "anime style, masterpiece, best quality, official art, key visual, 8k, highly detailed, beautiful, aesthetic, vivid colors",
        'niji-v5': "anime style, high quality, illustration, clean lines, detailed, soft lighting, studio anime style",
        'mid-v6': "semi-realistic anime, cg, 3d render, unreal engine, cinematic, 8k textures, raytracing, hyper detailed"
    };

    let baseModelPrompt = modelKeywords[modelId] || modelKeywords['niji-v6'];

    // 1. Build Style Description
    let styleDescription = "";
    const stylePrompts: Record<string, string> = {
        default: "expressive character, sharp focus, ufotable style, kyoto animation style, detailed shading",
        expressive: "dynamic pose, bold composition, strong dramatic lighting, intense colors, western comic influence, graphic novel style",
        cute: "pastel color palette, soft lighting, cute, adorable, dreamy, chibi influence, kawaii, heartwarming",
        scenic: "breathtaking scenery, atmospheric lighting, detailed background, cinematic composition, makoto shinkai style, studio ghibli style, concept art",
        manga: "monochrome, black and white, screen tones, ink lines, comic book style, high contrast, japanese manga aesthetic",
        raw: ""
    };

    if (style !== 'raw') {
        styleDescription = stylePrompts[style] || stylePrompts['default'];
    }

    // 2. Add XY Graph Nuances
    if (styleCoords && style !== 'raw') {
        if (styleCoords.x < -30) styleDescription += ", soft curves, gentle atmosphere, round shapes, warm aesthetic";
        if (styleCoords.x > 30) styleDescription += ", sharp angles, cool aesthetic, edgy, dynamic lines, intense";

        if (styleCoords.y < -30) styleDescription += ", flat color, vector style, minimalist, simple background, clean lines";
        if (styleCoords.y > 30) styleDescription += ", intricate details, maximalist, ornate, highly textured, rich background";
    }

    // 3. Build Character Description
    let characterPrompt = "";
    if (character) {
        const parts = [
            character.skinTone && `${character.skinTone}`,
            character.hairColor && `${character.hairColor} hair`,
            character.hairStyle,
            character.eyeColor && `${character.eyeColor} eyes`,
            character.expression && `${character.expression} expression`,
            character.gender,
            character.outfit && `wearing ${character.outfit}`,
            character.accessory && `with ${character.accessory}`
        ].filter(Boolean);
        if (parts.length > 0) {
            characterPrompt = `character features: ${parts.join(', ')}`;
        }
    }

    // 4. Pose
    const posePrompt = pose ? `${pose.prompt}` : "";

    // 5. Hand-Drawn / Natural Lines Logic
    let lineQualityPrompt = "";
    let lineQualityNegative = "";

    if (useHandDrawnLines) {
        lineQualityPrompt = "organic line weight, hand-drawn stroke, traditional ink, g-pen texture, slight imperfection, analog texture, variable line thickness, artist sketch style";
        baseModelPrompt = baseModelPrompt.replace(", crisp lines", "");
        lineQualityNegative = "vector art, uniform line weight, digital perfection, sterile lines, adobe illustrator style, perfectly straight lines";
    } else {
        lineQualityPrompt = "clean lines, digital art, crisp contours";
    }

    // 6. Assemble Final Prompt
    let finalPrompt = "";
    if (style === 'raw') {
        finalPrompt = prompt;
    } else {
        const components = [
            baseModelPrompt,
            lineQualityPrompt,
            characterPrompt,
            posePrompt,
            prompt,
            styleDescription
        ].filter(Boolean);

        finalPrompt = components.join(", ");
    }

    // Style Transfer Logic
    if (referenceImageBase64) {
        // Strong instruction to use the reference image as a style source
        finalPrompt = `[STYLE TRANSFER REQUEST] Analyze the visual style, brushwork, color palette, lighting, and texture of the attached reference image. Generate a NEW image based on the text prompt: "${finalPrompt}". CRITICAL: You must strictly emulate the art style of the reference image, but generate the subject matter described in the text prompt. Do not merely modify the reference image; use its style to paint the new prompt.`;
    }

    // 7. Negative Prompt
    const defaultNegative = "photorealistic, realistic, 3d, cgi, low quality, blurry, bad anatomy, deformed, sketch, text, watermark, logo, cropped, worst quality, normal quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck";

    let combinedNegative = defaultNegative;
    if (useHandDrawnLines) {
        combinedNegative += `, ${lineQualityNegative}`;
    }

    if (style !== 'raw' && negativePrompt) {
        combinedNegative += `, ${negativePrompt}`;
    } else if (style === 'raw') {
        combinedNegative = negativePrompt;
    }

    if (combinedNegative.trim()) {
        finalPrompt += ` Ensure the image does not contain: ${combinedNegative}.`;
    }

    // Construct request parts (Multimodal if image exists)
    const requestParts: any[] = [];

    if (referenceImageBase64) {
        // Strip data prefix if present (Gemini expects raw base64)
        const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, "");
        requestParts.push({
            inlineData: {
                data: base64Data,
                mimeType: "image/png" // Assuming PNG or JPEG
            }
        });
    }

    requestParts.push({ text: finalPrompt });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: requestParts
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                }
            }
        });

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }

        throw new Error("No image data found in response");
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
};
