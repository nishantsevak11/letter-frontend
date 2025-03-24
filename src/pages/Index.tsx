
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { FileText, ArrowRight, Database, Save, Inbox } from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { useEffect } from "react";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const {user} = useApi();



  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
       {
        user? <Dashboard/> : <main className="flex-grow mt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/50 -z-10" />
          
          {/* Animated background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 animate-float -z-10" />
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-primary/10 animate-float animation-delay-1000 -z-10" />
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-2">
                  <span className="font-medium">Modern Letter Writing</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                  Create and manage letters with ease
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  A modern letter writing application. Create, edit, and store your letters securely.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="rounded-full" asChild>
                    <a href="/login">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative lg:pl-10 animate-slide-in-right">
                <div className="rounded-2xl shadow-2xl overflow-hidden glass-card">
                  <div className="p-1">
                    <div className="p-6 bg-background rounded-xl">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-primary/10 rounded-md" />
                        <div className="h-4 w-full bg-secondary rounded-md" />
                        <div className="h-4 w-5/6 bg-secondary rounded-md" />
                        <div className="h-4 w-full bg-secondary rounded-md" />
                        <div className="h-4 w-2/3 bg-secondary rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>
        


      </main>
       }

      
      
      <footer className="py-8 px-6 border-t">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Letterly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
