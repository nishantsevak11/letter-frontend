import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image,
  Save,
  Undo,
  Redo,
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce"; // Adjust the path as needed

interface RichTextEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => Promise<boolean>;
  autoSave?: boolean;
}

const RichTextEditor = ({
  initialTitle = "",
  initialContent = "",
  onSave,
  autoSave = true,
}: RichTextEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize the editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      updateCounts();
    }
  }, [initialContent]);

  // Debounced save function
  const debouncedSave = useDebounce(async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    try {
      if (onSave) {
        const success = await onSave(title, content);
        if (success) {
          setIsDirty(false); // Reset isDirty only if save is successful
        }
      }
    } catch (error) {
      console.error("Error saving letter:", error);
      toast.error("Failed to save letter");
    }
  }, 3000); // Debounce by 3 seconds

  // Set up autosave
  useEffect(() => {
    if (autoSave && isDirty && title.trim() !== "") {
      debouncedSave();
    }
  }, [content, title, isDirty, autoSave, debouncedSave]);

  // Handle editor content change
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      updateCounts();
      setIsDirty(true);
    }
  };

  // Update word and character counts
  const updateCounts = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setCharCount(text.length);
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    }
  };

  // Format buttons handlers
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentChange();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    try {
      if (onSave) {
        const success = await onSave(title, content);
        if (success) {
          setIsDirty(false); // Reset isDirty after successful save
          toast.success("Letter saved successfully");
        }
      }
    } catch (error) {
      console.error("Error saving letter:", error);
      toast.error("Failed to save letter");
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto">
      {/* Title input */}
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setIsDirty(true);
        }}
        placeholder="Letter title..."
        className="text-xl font-semibold mb-4 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 mb-4 bg-secondary rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyLeft")}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyCenter")}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyRight")}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter link URL:");
            if (url) execCommand("createLink", url);
          }}
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) execCommand("insertImage", url);
          }}
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("undo")}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("redo")}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="flex-grow" />

        <Button
          onClick={handleSave}
          disabled={!isDirty}
          className="h-8 px-3"
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Editor */}
      <div className="relative flex-grow">
        <div
          ref={editorRef}
          contentEditable
          className="w-full h-full min-h-[300px] p-6 focus:outline-none paper rounded-lg"
          onInput={handleContentChange}
          onBlur={handleContentChange}
        />

        {/* Word and character counter */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {wordCount} words | {charCount} characters
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;