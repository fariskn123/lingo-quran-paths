
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-quran-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-quran-green mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! The page you're looking for can't be found.
        </p>
        <p className="text-gray-600 mb-8">
          The path <code className="bg-white px-2 py-1 rounded">{location.pathname}</code> doesn't exist.
        </p>
        <Button 
          className="btn-primary flex items-center justify-center gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="w-5 h-5" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
