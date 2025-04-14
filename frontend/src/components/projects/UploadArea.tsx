import { useState, useRef, DragEvent } from "react";
import { Upload, File, FilePlus2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface UploadAreaProps {
  onUploadComplete: (fileName: string, projectId?: string) => void;
  projectData?: any;
}

export default function UploadArea({ onUploadComplete, projectData }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Only ZIP files are allowed');
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit');
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    if (!validateFile(file)) {
      return;
    }

    setUploadedFile(file);
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Cap at 90% until we get actual confirmation
          if (prev < 90) {
            return prev + 5;
          }
          return prev;
        });
      }, 200);

      // This is where we actually upload the file
      const response = await api.uploadFile('/projects', file, projectData || {
        title: file.name.replace('.zip', ''),
        description: 'Uploaded project',
        language: 'Unknown',
        techStack: [],
        tags: []
      });

      clearInterval(progressInterval);

      if (response.error) {
        setError(response.error);
        setUploadProgress(0);
        toast({
          title: "Upload Failed",
          description: response.error,
          variant: "destructive",
        });
      } else {
        setUploadProgress(100);
        toast({
          title: "Upload Complete",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        // Pass the file name and project ID back to parent
        if (response.data) {
          onUploadComplete(file.name, response.data.id);
        } else {
          onUploadComplete(file.name);
        }
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      toast({
        title: "Upload Failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".zip"
      />

      {!isUploading && !uploadedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors duration-200 flex flex-col items-center justify-center gap-4",
            isDragOver ? "drag-over" : "border-muted hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="bg-primary/10 rounded-full p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Upload ZIP file</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Only ZIP files up to 50MB are supported
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            Select File
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-secondary rounded-lg p-2">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate max-w-[200px]">
                  {uploadedFile?.name}
                </span>
                {!isUploading && (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">Complete</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-destructive mr-1" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}
              </div>
              
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {uploadProgress}% complete
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((uploadedFile?.size || 0) / 1024)} KB
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                cancelUpload();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-destructive flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
