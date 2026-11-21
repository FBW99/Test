import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2F2EA] text-[#166534]">
        <Compass className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold text-[#1F2937]">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#4B5563]">
        The page you requested could not be found. Return to the Herbiz homepage or sign in to your role portal.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    </div>
  );
}
