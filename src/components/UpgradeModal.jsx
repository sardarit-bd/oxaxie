// 'use client';

// import { X, Zap } from "lucide-react";

// const UpgradeModal = ({ isOpen, onClose, currentPlan, upgradeTo, message }) => {
//   if (!isOpen) return null;

//   const formatPlanName = (plan) => {
//     if (!plan) return '';
    
//     const planMap = {
//       'free': 'Free',
//       'pro': 'Pro',
//       'pro_plus': 'Pro Plus',
//       'enterprise': 'Enterprise'
//     };
    
//     return planMap[plan.toLowerCase()] || plan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   const formattedCurrentPlan = formatPlanName(currentPlan);
//   const formattedUpgradeTo = formatPlanName(upgradeTo);

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <X className="w-5 h-5 text-gray-500" />
//         </button>

//         <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
//           <Zap className="w-8 h-8 text-amber-600" />
//         </div>

//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           Upgrade Required
//         </h2>

//         <p className="text-gray-600 mb-6">
//           {message || `Case creation is not available on the ${formattedCurrentPlan} plan.`}
//         </p>

//         <div className="bg-gray-50 rounded-lg p-4 mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">Current Plan</span>
//             <span className="font-semibold text-gray-900">{formattedCurrentPlan}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-600">Upgrade To</span>
//             <span className="font-semibold text-amber-600">{formattedUpgradeTo}</span>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <button
//             onClick={() => window.location.href = '/pricing'}
//             className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
//           >
//             Upgrade to {formattedUpgradeTo}
//           </button>

//           <button
//             onClick={onClose}
//             className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
//           >
//             Maybe Later
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpgradeModal;

'use client';

import { X, Zap } from "lucide-react";

const UpgradeModal = ({ isOpen, onClose, currentPlan, upgradeTo, message }) => {
  if (!isOpen) return null;

  const formatPlanName = (plan) => {
    if (!plan) return '';
    
    const planMap = {
      'free': 'Free',
      'pro': 'Pro',
      'pro_plus': 'Pro Plus',
      'enterprise': 'Enterprise'
    };
    
    return planMap[plan.toLowerCase()] || plan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // ✅ NEW: Clean up backend messages
  const sanitizeMessage = (rawMessage) => {
    if (!rawMessage) return `You've reached your ${formatPlanName(currentPlan)} plan limit.`;

    // Remove technical jargon and dollar signs
    let cleanMessage = rawMessage
      .replace(/\$\d+(\.\d{2})?/g, '') // Remove dollar amounts like $0.50
      .replace(/threshold/gi, 'limit') // Replace "threshold" with "limit"
      .replace(/cost/gi, 'usage') // Replace "cost" with "usage"
      .replace(/exceeded/gi, 'reached') // Replace "exceeded" with "reached"
      .trim();

    // If message mentions "monthly limit" or similar, keep it simple
    if (cleanMessage.toLowerCase().includes('monthly') || 
        cleanMessage.toLowerCase().includes('limit') ||
        cleanMessage.toLowerCase().includes('reached')) {
      return cleanMessage;
    }

    // Default fallback for any other technical messages
    return `You've reached your monthly usage limit. Upgrade to continue using all features.`;
  };

  const formattedCurrentPlan = formatPlanName(currentPlan);
  const formattedUpgradeTo = formatPlanName(upgradeTo);
  const displayMessage = sanitizeMessage(message);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <Zap className="w-8 h-8 text-amber-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upgrade Required
        </h2>

        <p className="text-gray-600 mb-6">
          {displayMessage}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Plan</span>
            <span className="font-semibold text-gray-900">{formattedCurrentPlan}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Upgrade To</span>
            <span className="font-semibold text-amber-600">{formattedUpgradeTo}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/pricing'}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Upgrade to {formattedUpgradeTo}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;