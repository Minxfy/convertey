// DonationForm Component
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  // const [amount, setAmount] = useState(10); // Default donation amount

  // const presetAmounts = [5, 10, 25, 50, 100];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      // Redirect to PayPal with the selected amount
      window.open(`https://www.paypal.com/ncp/payment/NU6SSGADZPRQJ`, "_blank"); // Replace with your actual PayPal link
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle error, e.g., show a message to the user
      alert("Failed to redirect to PayPal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Submit Button */}
      <Button
        type="submit"
        // disabled={amount < 1 || isLoading}
        className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5 mr-2" /> Donate via PayPal
            {/* Donate ${amount} to Convertey */}
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        🔒 You will be redirected to PayPal to complete your donation.
      </p>
    </form>
  );
}
//
