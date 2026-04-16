import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <AppShell title="Not Found">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
          <Button onClick={() => navigate("/tasks")} className="tap-target">
            Back to Tasks
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
