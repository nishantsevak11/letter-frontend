import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useApi } from "@/contexts/ApiContext";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoadingLetter, isSavingLetter, user, getLetter, saveLetter } = useApi();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchLetter = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const letter = await getLetter(id);

        if (letter) {
          setTitle(letter.title);
          setContent(letter.content);
        } else {
          toast.error("Letter not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching letter:", error);
        toast.error("Failed to load letter");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLetter();
    }
  }, [id, navigate, user, getLetter]);

  const handleSave = useCallback(async (title: string, content: string) => {
    if (isSaving) return false;

    setIsSaving(true);
    try {
      const letterData = { id, title, content };
      const savedLetter = await saveLetter(letterData);

      if (savedLetter && !id) {
        navigate(`/editor/${savedLetter._id}`);
      }

      return true;
    } catch (error) {
      console.error("Error saving letter:", error);
      toast.error("Failed to save letter");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [id, isSaving, navigate, saveLetter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <h1 className="text-xl font-semibold">
              {id ? "Edit Letter" : "New Letter"}
            </h1>
          </div>

          {isLoading || isLoadingLetter ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="animate-fade-in">
              <RichTextEditor
                initialTitle={title}
                initialContent={content}
                onSave={handleSave}
                autoSave={true}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Editor;