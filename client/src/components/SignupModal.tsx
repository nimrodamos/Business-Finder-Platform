import React, { useState } from "react";
import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupDialogProps } from "@/types/Signup";

const SignupDialog: React.FC<SignupDialogProps> = ({ isOpen, onClose }) => {
  const { signup } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("Standard");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      await signup(name, email, password, plan);
      onClose(); // Close dialog on successful signup
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signup</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="plan" className="block text-sm font-medium">
              Plan
            </label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Standard">Standard</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-muted text-muted-foreground">
            Cancel
          </Button>
          <Button
            onClick={handleSignup}
            className="bg-primary text-primary-foreground"
          >
            Signup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
