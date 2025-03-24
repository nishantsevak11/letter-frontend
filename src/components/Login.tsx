
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useApi } from "@/contexts/ApiContext";

const Login = () => {
  const { loginUrl, user } = useApi();

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2 animate-pulse-scale">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold text-center text-balance">
        Welcome to Letterly
      </h2>
      
      <p className="text-center text-muted-foreground max-w-sm text-balance">
        Create, edit, and save your letters easily with our intuitive editor and Google Drive integration.
      </p>
      
      <Button 
        className="flex items-center justify-center w-full max-w-xs gap-2 rounded-full shadow-md hover:shadow-lg transition-all py-6"
        onClick={user ? () => window.location.href = "/dashboard" : handleLogin}
      >
        <FileText className="h-5 w-5" />
        <span>{user ? "Go to Dashboard" : "Login with Google"}</span>
      </Button>
    </div>
  );
};

export default Login;
