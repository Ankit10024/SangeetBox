import { SignIn, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SangeetLogo } from "../components/SangeetLogo";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900 p-4">
      <div className="mb-8">
        <SangeetLogo size="lg" />
      </div>
      
      <div className="w-full max-w-md">
        <SignIn 
          afterSignInUrl="/"
          afterSignUpUrl="/"
          routing="path"
          path="/login"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-zinc-800/80 border border-zinc-700 rounded-xl backdrop-blur-sm",
              headerTitle: "text-white font-bold text-2xl",
              headerSubtitle: "text-zinc-400",
              socialButtonsBlockButton: "border-zinc-700 hover:bg-zinc-700/50 transition-colors",
              dividerLine: "bg-zinc-700",
              formFieldInput: "bg-zinc-700/50 border-zinc-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              formFieldLabel: "text-zinc-300",
              footerActionText: "text-zinc-400",
              footerActionLink: "text-emerald-500 hover:text-emerald-400 font-medium",
          formButtonPrimary: `bg-emerald-600 hover:bg-emerald-700 text-white ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`,
              identityPreview: "bg-zinc-700/50 border-zinc-600",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-emerald-500"
            }
          }}
        />
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 w-full text-center text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back to home
        </button>
      </div>
    </div>
  );
}
