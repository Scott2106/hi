import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { CircleUser } from "lucide-react";

const SuperAdminHeader = () => {
  return (
    <header className="top-0 flex h-16 items-center gap-4 border border-slate-800 bg-neutral-900 px-4 md:px-6 rounded-lg">
      <nav className="hidden flex-col gap-6 text-md font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
        <Link
          to="/superAdmin/users"
          className="text-muted-foreground transition-colors hover:text-gray-50"
        >
          Users
        </Link>
        <Link
          to="/superAdmin/sites"
          className="text-muted-foreground transition-colors hover:text-gray-50"
        >
          Sites
        </Link>
        <Link
          to="/superAdmin/reports"
          className="text-muted-foreground transition-colors hover:text-gray-50"
        >
          Reports
        </Link>
        <Link
        to="/superAdmin/logs"
        className="text-muted-foreground transition-colors hover:text-gray-50"
        >
        Logs
        </Link>
      </nav>

      <div className="flex w-full flex-row-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-slate-700 text-white"
            >
              <CircleUser className="h-6 w-6" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-slate-700 bg-slate-800 text-gray-50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700"/>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
