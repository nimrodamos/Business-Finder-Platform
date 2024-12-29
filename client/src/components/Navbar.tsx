import { Link } from "react-router-dom";
import LoginModal from "@/components/LoginModal";
import { Button } from "./ui/button";
import { useUser } from "@/context/userContext";
import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/Theme-provider";
import { Switch } from "@radix-ui/react-switch";
import { User } from "@/types/User";

function Navbar() {
  const { user, login, logout, isLoggedIn } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-primary text-primary-foreground p-4 flex items-center gap-4 justify-between">
      {/* קישורים */}
      <ul className="flex items-center gap-4">
        <li>
          <Link to="/" className="text-accent hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile" className="text-accent hover:underline">
            Profile
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-muted-foreground">Welcome, {user?.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-foreground hover:text-secondary">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            onClick={() => setIsLoginOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-opacity-90"
          >
            Login
          </Button>
        )}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSuccess={(userData: User) => {
            console.log("UserData received:", userData);
            login(userData);
            console.log("Context user after login:", userData);
            setIsLoginOpen(false);
          }}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            className="relative inline-flex items-center w-12 h-6 bg-muted rounded-full cursor-pointer"
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </Switch>
          <span>
            {theme === "light" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
