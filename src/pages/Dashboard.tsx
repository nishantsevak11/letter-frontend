
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LetterCard from "@/components/LetterCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiContext";
import { FileText, Plus, Search, SortAsc, SortDesc } from "lucide-react";
const Dashboard = () => {
  const { isLoadingLetters, user, letters, fetchLetters, deleteLetter } = useApi();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    
    fetchLetters();
  }, [user, navigate, fetchLetters]);

  const handleDeleteLetter = async (id: string) => {
    await deleteLetter(id);
  };

  const filteredLetters = letters
    .filter(letter => 
      letter.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      letter.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Letters</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage your letters
              </p>
            </div>
            
            <Button asChild className="rounded-full">
              <Link to="/editor">
                <Plus className="mr-2 h-4 w-4" />
                New Letter
              </Link>
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search letters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-2 pr-4 rounded-full border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="rounded-full w-10 h-10"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isLoadingLetters ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-xl p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="pt-4 flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLetters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredLetters.map(letter => (
                <LetterCard
                  key={letter._id}
                  id={letter._id}
                  title={letter.title}
                  preview={letter.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                  createdAt={new Date(letter.createdAt)}
                  updatedAt={new Date(letter.updatedAt)}
                  googleDriveId={letter.googleDriveId}
                  onDelete={handleDeleteLetter}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              {searchTerm ? (
                <>
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    No letters match your search criteria. Try adjusting your search terms.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No letters yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first letter to get started
                  </p>
                  <Button asChild className="rounded-full">
                    <Link to="/editor">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Letter
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
