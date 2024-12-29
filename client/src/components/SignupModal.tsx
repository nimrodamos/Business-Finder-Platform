import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/api/auth";
import { User } from "@/types/User";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: User) => void;
}

const SignupModal = ({ isOpen, onClose, onSuccess }: SignupModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // קריאה ל-API להרשמה
      const response = await signup({ name, email, password });

      // פירוק הערכים מהתשובה
      const { id, token, name: userName, email: userEmail } = response;

      // יצירת אובייקט משתמש
      const userData: User = { id, name: userName, email: userEmail, token };

      // עדכון ה-Context דרך onSuccess
      onSuccess(userData);

      // איפוס שדות הטופס
      setName("");
      setEmail("");
      setPassword("");
      setError(null);

      // סגירת המודל
      onClose();
    } catch (err) {
      setError("Failed to Signup. Please check your credentials.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="name"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-opacity-90"
            >
              Signup
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
