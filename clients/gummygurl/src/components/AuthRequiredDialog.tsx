import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Lock } from "lucide-react";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthRequiredDialog({ open, onOpenChange }: AuthRequiredDialogProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">Sign in to Subscribe</DialogTitle>
          <DialogDescription className="text-base">
            Create a free account to manage your subscriptions, track orders, and save 10% on every delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button size="lg" className="w-full" onClick={() => handleNavigate("/login")}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => handleNavigate("/login?tab=signup")}>
            <UserPlus className="w-4 h-4 mr-2" />
            Create an Account
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          It only takes a moment — then you'll be redirected to checkout.
        </p>
      </DialogContent>
    </Dialog>
  );
}
