"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useResumeManagerStore } from "@/stores";

export function ResumeDialogs() {
  const previewResume = useResumeManagerStore((state) => state.previewResume);
  const editingNotes = useResumeManagerStore((state) => state.editingNotes);
  const notesText = useResumeManagerStore((state) => state.notesText);
  const renamingResume = useResumeManagerStore((state) => state.renamingResume);
  const newFilename = useResumeManagerStore((state) => state.newFilename);
  const setPreviewResume = useResumeManagerStore((state) => state.setPreviewResume);
  const closeEditNotes = useResumeManagerStore((state) => state.closeEditNotes);
  const saveNotes = useResumeManagerStore((state) => state.saveNotes);
  const setNotesText = useResumeManagerStore((state) => state.setNotesText);
  const closeRename = useResumeManagerStore((state) => state.closeRename);
  const saveRename = useResumeManagerStore((state) => state.saveRename);
  const setNewFilename = useResumeManagerStore((state) => state.setNewFilename);

  return (
    <>
      <Dialog open={!!previewResume} onOpenChange={(open) => !open && setPreviewResume(null)}>
        <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !m-0 !rounded-none !p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{previewResume?.filename}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6 min-h-0">
            {previewResume && (
              <iframe
                src={previewResume.path}
                className="w-full h-full border-0 rounded-lg"
                title={`Preview of ${previewResume.filename}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingNotes} onOpenChange={(open) => !open && closeEditNotes()}>
        <DialogContent className="max-w-2xl border border-border dark:border-border/80 dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Notes - {editingNotes?.filename}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add notes about this resume version (e.g., 'Updated for tech roles', 'Added new project')..."
              className="w-full min-h-[120px] px-4 py-3 text-sm rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              rows={5}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeEditNotes}>Cancel</Button>
            <Button onClick={saveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renamingResume} onOpenChange={(open) => !open && closeRename()}>
        <DialogContent className="max-w-2xl border border-border dark:border-border/80 dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="rename-input" className="text-sm font-medium mb-2 block">
              Filename
            </label>
            <input
              id="rename-input"
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveRename();
                }
                if (e.key === "Escape") closeRename();
              }}
              placeholder="Enter new filename..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will only change the display name, not the actual file.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeRename}>Cancel</Button>
            <Button onClick={saveRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
