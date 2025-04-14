import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "../stores/useAuthStore";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div
      className='flex items-center justify-between p-4 sticky top-0 bg-zinc-800/75 
      backdrop-blur-md z-10 border-b border-zinc-800'
    >
      {/* Clickable logo that routes to home */}
      <Link to="/" className='flex gap-2 items-center'>
        <img src='/SangeetBox.png' className='size-8' alt='SangeetBox logo' />
        <span className='font-semibold text-white'>SangeetBox</span>
      </Link>

      <div className='flex items-center gap-4'>
        {/* Show admin dashboard button if user is admin */}
        {isAdmin && (
          <Link 
            to={"/admin"} 
            className={cn(buttonVariants({ variant: "outline" }), "text-white border-zinc-600")}
          >
            <LayoutDashboardIcon className='size-4 mr-2' />
            Admin Dashboard
          </Link>
        )}

        {/* Show Sign In buttons when logged out */}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        {/* Show Clerk User Button when logged in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Topbar;
