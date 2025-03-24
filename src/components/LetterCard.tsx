
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LetterCardProps {
  id: string;
  title: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
  googleDriveId?: string;
  onDelete?: (id: string) => void;
}
const LetterCard = ({
  id,
  title,
  preview,
  createdAt,
  updatedAt,
  googleDriveId,
  onDelete
}: LetterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all-300 border border-border/50 h-full",
        isHovered ? "shadow-md -translate-y-1" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold line-clamp-1">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/editor/${id}`} className="flex items-center cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              {googleDriveId && (
                <DropdownMenuItem
                  onClick={() => window.open(`https://docs.google.com/document/d/${googleDriveId}`, '_blank')}
                  className="flex items-center cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Open in Google Drive</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {formatDistanceToNow(updatedAt, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {preview}
        </p>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/editor/${id}`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </Link>
        </Button>
        {googleDriveId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://docs.google.com/document/d/${googleDriveId}`, '_blank')}
            className="flex items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Open in Drive</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default LetterCard;
