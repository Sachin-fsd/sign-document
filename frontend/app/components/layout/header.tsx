import { useAuth } from "@/provider/auth-context";
import { Button } from "../ui/button";
import { Bell, PlusCircle, ChevronDown, ChevronUp, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-100 sticky top-0 z-40 border-b shadow-md transition-all duration-500">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 py-3 animate-fade-in">
        

        {/* Right Side: Notification & User */}
        <div className="flex items-center gap-3">
          {/* <Button
            variant="ghost"
            size="icon"
            className="hover:bg-indigo-50 transition"
            aria-label="Notifications"
          >
            <Bell className="text-indigo-400 hover:text-indigo-600 transition-all duration-200 animate-bounce-slow" />
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full border p-1 w-9 h-9 bg-white/90 shadow hover:scale-105 transition-all duration-200">
                <Avatar className="w-8 h-8 bg-white">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} />
                  ) : (
                    <UserCircle2 className="w-7 h-7 text-indigo-400" />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground capitalize">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="animate-slide-down-fade">
              <DropdownMenuLabel className="text-indigo-700">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile" className="flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-indigo-400" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down-fade {
            animation: slideDownFade 0.3s;
          }
          @keyframes slideDownFade {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-bounce-slow {
            animation: bounce 2.5s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-5px);}
          }
        `}
      </style>
    </div>
  );
};