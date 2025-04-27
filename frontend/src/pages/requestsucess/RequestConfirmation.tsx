import { CheckCircleIcon } from "lucide-react"; // or any icon library you use
import { Button } from "@/components/button/button"; // your custom button
import { useNavigate } from "react-router-dom";

const RequestSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-red-100 via-white to-red-50 text-center">
      <CheckCircleIcon className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Your Request Has Been Submitted</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        We’ve received your blood request. Our community is strong — and you're not alone.
        Donors in your area have been notified. Help is on the way. ❤️
      </p>

      <blockquote className="italic text-md text-red-700 mb-8 max-w-md">
        “You don’t have to be a doctor to save lives. Just donate blood.”
      </blockquote>

      <Button onClick={() => navigate("/donors")} className="bg-red-500 hover:bg-red-600">
        View Available Donors
      </Button>
    </div>
  );
};

export default RequestSuccess;
