import { NextRequest } from "next/server";
import { isAuthorizedAdmin } from "@/lib/auth";
import { settingsService } from "@/lib/services/settings-service";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
} from "@/lib/api-response";
import { revalidatePath } from "next/cache";
import { resumeVisibilitySchema } from "@/lib/validations/resume";
import type { VisibilityResponse } from "@/types/api";

export async function GET() {
  try {
    const isVisible = await settingsService.getResumeVisibility();
    return createSuccessResponse<VisibilityResponse>({ isVisible });
  } catch (error: unknown) {
    logError("GET /api/resume/visibility", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("does not exist") ||
      errorMessage.includes("relation") ||
      (error as { code?: string }).code === "42P01"
    ) {
      return createSuccessResponse<VisibilityResponse>({
        isVisible: true,
        warning:
          "Settings table does not exist. Please run the database migration.",
      });
    }
    return createSuccessResponse<VisibilityResponse>({ isVisible: true });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await isAuthorizedAdmin();
  if (!isAdmin) {
    return createErrorResponse("Unauthorized", 403, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const validationResult = resumeVisibilitySchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.issues[0]?.message || "Invalid request",
        400,
        "VALIDATION_ERROR",
      );
    }

    const { isVisible } = validationResult.data;
    // setResumeVisibility returns the fresh value after updating
    const verifiedValue = await settingsService.setResumeVisibility(isVisible);

    revalidatePath("/");

    return createSuccessResponse<VisibilityResponse>({
      isVisible: verifiedValue,
    });
  } catch (error) {
    logError("POST /api/resume/visibility", error);
    return createErrorResponse(
      "Failed to update resume visibility",
      500,
      "UPDATE_ERROR",
    );
  }
}
