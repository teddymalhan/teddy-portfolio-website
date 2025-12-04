import { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { isAuthorizedAdmin } from "@/lib/auth";
import { resumeService } from "@/lib/services/resume-service";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
} from "@/lib/api-response";
import { resumeUpdateSchema } from "@/lib/validations/resume";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await isAuthorizedAdmin();
  if (!isAdmin) {
    return createErrorResponse("Unauthorized", 403, "UNAUTHORIZED");
  }

  try {
    const { id } = await params;
    const resumeId = Number.parseInt(id, 10);

    if (Number.isNaN(resumeId)) {
      return createErrorResponse("Invalid resume ID", 400, "INVALID_RESUME_ID");
    }

    const body = await request.json();
    const validationResult = resumeUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.issues[0]?.message || "Invalid request",
        400,
        "VALIDATION_ERROR",
      );
    }

    const { notes, filename } = validationResult.data;
    const resumeRow = await resumeService.updateResume(resumeId, {
      notes,
      filename,
    });

    return createSuccessResponse({
      id: resumeRow.id,
      filename: resumeRow.filename,
      notes: resumeRow.notes,
    });
  } catch (error) {
    logError("PUT /api/resume/[id]", error);

    if (error instanceof Error && error.message === "Resume not found") {
      return createErrorResponse("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    return createErrorResponse("Failed to update resume", 500, "UPDATE_ERROR");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await isAuthorizedAdmin();
  if (!isAdmin) {
    return createErrorResponse("Unauthorized", 403, "UNAUTHORIZED");
  }

  try {
    const { id } = await params;
    const resumeId = Number.parseInt(id, 10);

    if (Number.isNaN(resumeId)) {
      return createErrorResponse("Invalid resume ID", 400, "INVALID_RESUME_ID");
    }

    // Get resume info before deleting
    const resume = await resumeService.getResumeById(resumeId);

    if (!resume) {
      return createErrorResponse("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    // Don't allow deleting the active resume
    if (resume.is_active) {
      return createErrorResponse(
        "Cannot delete active resume. Set another resume as active first.",
        400,
        "CANNOT_DELETE_ACTIVE",
      );
    }

    // Delete from Vercel Blob
    try {
      await del(resume.blob_key);
    } catch (blobError) {
      logError("DELETE /api/resume/[id] - Blob deletion", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await resumeService.deleteResume(resumeId);

    return createSuccessResponse({ deleted: true });
  } catch (error) {
    logError("DELETE /api/resume/[id]", error);
    return createErrorResponse("Failed to delete resume", 500, "DELETE_ERROR");
  }
}
