import { ArrowLeft, Calendar, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { Agreement } from "../lib/mockData";
import { getUserById, currentUser } from "../lib/mockData";

interface WebSingleAgreementDetailsScreenProps {
  onBack: () => void;
  agreement: Agreement;
  onAcceptAgreement?: (agreementId: string) => void;
  onRejectAgreement?: (agreementId: string) => void;
}

export function WebSingleAgreementDetailsScreen({ 
  onBack, 
  agreement,
  onAcceptAgreement,
  onRejectAgreement
}: WebSingleAgreementDetailsScreenProps) {
  const otherUser = getUserById(agreement.otherPartyId);
  const creator = getUserById(agreement.createdBy);
  const isPending = agreement.status === "pending";
  const isReceivedRequest = isPending && agreement.createdBy !== currentUser.id;

  if (!otherUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="mb-6">Agreement Details</h2>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white/30 shadow-lg">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback className="bg-white text-blue-700 text-xl">
                    {otherUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium mb-1">{otherUser.name}</h3>
                  <p className="text-blue-100">{otherUser.phone}</p>
                </div>
              </div>
              {isPending && (
                <div className="bg-yellow-400/90 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium">
                  Pending
                </div>
              )}
              {!isPending && (
                <div className="bg-green-400/90 text-green-900 px-4 py-2 rounded-full text-sm font-medium">
                  Active
                </div>
              )}
            </div>
          </div>

          {/* Agreement Details */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Agreement Title</h3>
              <p className="text-lg font-medium">{agreement.title}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{agreement.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {agreement.amount && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Amount</h3>
                  <p className="text-lg font-medium text-blue-600">{agreement.amount}</p>
                </div>
              )}

              {agreement.dueDate && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Due Date</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(agreement.dueDate).toLocaleDateString('en-UG', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Created Date</h3>
                <p className="text-gray-700">
                  {new Date(agreement.createdDate).toLocaleDateString('en-UG', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {creator && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Created By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-gray-200">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {creator.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">{creator.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Pending Requests */}
          {isReceivedRequest && onAcceptAgreement && onRejectAgreement && (
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button 
                onClick={() => onRejectAgreement(agreement.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reject Agreement
              </Button>
              <Button 
                onClick={() => onAcceptAgreement(agreement.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-6 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Accept Agreement
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
