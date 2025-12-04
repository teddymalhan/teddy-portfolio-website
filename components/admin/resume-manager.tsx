"use client";

import { useEffect, useMemo } from "react";
import {
  Upload,
  Trash2,
  Check,
  FileText,
  Download,
  Loader2,
  Eye,
  Edit2,
  FileStack,
  HardDrive,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  EyeOff,
  Eye as EyeIcon,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useResumeManagerStore } from "@/stores";

interface ResumeVersion {
  id: number;
  filename: string;
  uploadedAt: string;
  isActive: boolean;
  notes?: string;
  size?: number;
  fileSize?: number;
  path: string;
}

export function ResumeManager() {
  // Get state from Zustand store using selective subscriptions
  const resumes = useResumeManagerStore((state) => state.resumes);
  const loading = useResumeManagerStore((state) => state.loading);
  const uploading = useResumeManagerStore((state) => state.uploading);
  const previewResume = useResumeManagerStore((state) => state.previewResume);
  const editingNotes = useResumeManagerStore((state) => state.editingNotes);
  const notesText = useResumeManagerStore((state) => state.notesText);
  const renamingResume = useResumeManagerStore((state) => state.renamingResume);
  const newFilename = useResumeManagerStore((state) => state.newFilename);
  const searchQuery = useResumeManagerStore((state) => state.searchQuery);
  const filterStatus = useResumeManagerStore((state) => state.filterStatus);
  const sortBy = useResumeManagerStore((state) => state.sortBy);
  const isResumeVisible = useResumeManagerStore((state) => state.isResumeVisible);
  const togglingVisibility = useResumeManagerStore((state) => state.togglingVisibility);
  const cooldown = useResumeManagerStore((state) => state.cooldown);
  const autoSetActive = useResumeManagerStore((state) => state.autoSetActive);
  const selectedResumes = useResumeManagerStore((state) => state.selectedResumes);

  // Get actions from store
  const {
    fetchResumes,
    fetchVisibility,
    handleUpload: handleUploadAction,
    setActive,
    deleteResume,
    toggleVisibility,
    copyResumeLink,
    toggleResumeSelection,
    bulkDelete,
    openEditNotes,
    closeEditNotes,
    saveNotes,
    setNotesText,
    openRename,
    closeRename,
    saveRename,
    setNewFilename,
    setPreviewResume,
    setSearchQuery,
    setFilterStatus,
    setSortBy,
    setAutoSetActive,
    toggleSelectAll,
  } = useResumeManagerStore();

  useEffect(() => {
    fetchResumes();
    fetchVisibility();
  }, [fetchResumes, fetchVisibility]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleUploadAction(file);
    // Reset file input
    event.target.value = "";
  }

  function formatFileSize(bytes?: number | null) {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Filter and sort resumes
  const filteredAndSortedResumes = useMemo(() => {
    let filtered = resumes;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.filename.toLowerCase().includes(query) ||
          (r.notes && r.notes.toLowerCase().includes(query)),
      );
    }

    // Status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((r) => r.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((r) => !r.isActive);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          );
        case "name-asc":
          return a.filename.localeCompare(b.filename);
        case "name-desc":
          return b.filename.localeCompare(a.filename);
        case "size-desc":
          return (b.fileSize || 0) - (a.fileSize || 0);
        case "size-asc":
          return (a.fileSize || 0) - (b.fileSize || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [resumes, searchQuery, filterStatus, sortBy]);

  // Helper function for toggleSelectAll
  const handleToggleSelectAll = () => {
    toggleSelectAll(filteredAndSortedResumes.map((r) => r.id));
  };

  // Calculate statistics
  const totalResumes = resumes.length;
  const activeResume = resumes.find((r) => r.isActive);
  const totalStorage = resumes.reduce((sum, r) => sum + (r.fileSize || 0), 0);
  const lastUpload =
    resumes.length > 0
      ? resumes.reduce((latest, r) => {
          const rDate = new Date(r.uploadedAt);
          const latestDate = new Date(latest.uploadedAt);
          return rDate > latestDate ? r : latest;
        })
      : null;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Active Resume
              </p>
              {activeResume ? (
                <>
                  <p className="text-sm font-semibold mt-2 truncate">
                    {activeResume.filename}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activeResume.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">None</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 ml-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Storage
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatFileSize(totalStorage)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <HardDrive className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Last Upload
              </p>
              {lastUpload ? (
                <>
                  <p className="text-sm font-semibold mt-2">
                    {new Date(lastUpload.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(lastUpload.uploadedAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Never</p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 ml-2">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Resume Visibility</h2>
            <p className="text-sm text-muted-foreground">
              {isResumeVisible
                ? "Resume is currently visible on the website. Visitors can view and download it."
                : "Resume is currently hidden. No one can access it on the website."}
            </p>
          </div>
          <Button
            onClick={toggleVisibility}
            disabled={togglingVisibility || cooldown}
            variant={isResumeVisible ? "destructive" : "default"}
            className="shrink-0"
          >
            {togglingVisibility ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isResumeVisible ? "Hiding..." : "Showing..."}
              </>
            ) : (
              <>
                {isResumeVisible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Resume
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Show Resume
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Resume Versions</h2>
            {selectedResumes.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDelete}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedResumes.size})
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by filename or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "inactive",
                  )
                }
                className="pl-9 pr-8 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="all">All Resumes</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="pl-9 pr-8 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No resumes uploaded yet. Upload your first resume above.
          </p>
        ) : filteredAndSortedResumes.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No resumes match your search criteria.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Select All Header */}
            {filteredAndSortedResumes.length > 0 && (
              <div className="flex items-center gap-2 pb-2 border-b">
                <input
                  type="checkbox"
                  checked={
                    selectedResumes.size === filteredAndSortedResumes.length &&
                    filteredAndSortedResumes.length > 0
                  }
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-input cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  Select all ({filteredAndSortedResumes.length})
                </span>
              </div>
            )}
            {filteredAndSortedResumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedResumes.has(resume.id)}
                    onChange={() => toggleResumeSelection(resume.id)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{resume.filename}</p>
                      <button
                        onClick={() => openRename(resume)}
                        className="shrink-0 p-1 hover:bg-accent rounded transition-colors"
                        title="Rename resume"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        {new Date(resume.uploadedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(resume.fileSize)}</span>
                    </div>
                    {resume.notes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {resume.notes}
                      </p>
                    )}
                  </div>
                  {resume.isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-600 dark:text-green-400 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {resume.isActive && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyResumeLink(resume)}
                        title="Copy resume link"
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("/", "_blank")}
                        title="View on website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditNotes(resume)}
                    title="Edit notes"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewResume(resume)}
                    title="Preview resume"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <a
                    href={resume.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" title="Download resume">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  {!resume.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActive(resume.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Set Active
                    </Button>
                  )}
                  {!resume.isActive && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteResume(resume.id, resume.filename)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload New Resume</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a new PDF resume. Maximum file size: 10MB
        </p>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF File
                  </>
                )}
              </span>
            </Button>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSetActive}
              onChange={(e) => setAutoSetActive(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm text-muted-foreground">
              Automatically set as active resume after upload
            </span>
          </label>
        </div>
      </Card>

      <Dialog
        open={!!previewResume}
        onOpenChange={(open) => !open && setPreviewResume(null)}
      >
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

      <Dialog
        open={!!editingNotes}
        onOpenChange={(open) => !open && closeEditNotes()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notes - {editingNotes?.filename}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add notes about this resume version (e.g., 'Updated for tech roles', 'Added new project')..."
              className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditNotes}>
              Cancel
            </Button>
            <Button onClick={saveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={!!renamingResume}
        onOpenChange={(open) => !open && closeRename()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="rename-input"
              className="text-sm font-medium mb-2 block"
            >
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
                if (e.key === "Escape") {
                  closeRename();
                }
              }}
              placeholder="Enter new filename..."
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will only change the display name, not the actual file.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRename}>
              Cancel
            </Button>
            <Button onClick={saveRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
