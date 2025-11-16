import { AlertCircle, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SubscriptionBannerProps {
  message?: string;
  showRenewButton?: boolean;
  dismissible?: boolean;
}

export const SubscriptionBanner = ({ 
  message = "Your subscription is inactive. Please renew to continue uploading documents and forms.",
  showRenewButton = true,
  dismissible = false
}: SubscriptionBannerProps) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-bold text-red-800 mb-1">
            Subscription Required
          </h3>
          <p className="text-sm text-red-700">
            {message}
          </p>
          {showRenewButton && (
            <div className="mt-3">
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                Renew Subscription
              </button>
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={() => setVisible(false)}
              className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export const useSubscriptionStatus = () => {
  const [subscription] = useState<{
    status: string;
    canUpload: boolean;
  } | null>(null);

  const checkSubscription = async () => {
    try {
      // TODO: Implement subscription check when API is ready
    } catch (error) {
      console.error("Failed to fetch subscription", error);
    }
  };

  return {
    subscription,
    checkSubscription,
    isActive: subscription?.status === 'ACTIVE',
    canUpload: subscription?.canUpload ?? false
  };
};