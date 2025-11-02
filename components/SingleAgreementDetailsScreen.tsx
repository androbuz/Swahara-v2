import { ArrowLeft, Calendar, User, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { Agreement } from "../lib/mockData";
import { getUserById, currentUser } from "../lib/mockData";

interface SingleAgreementDetailsScreenProps {
  onBack: () => void;
  agreement: Agreement;
  onAcceptAgreement?: (agreementId: string) => void;
  onRejectAgreement?: (agreementId: string) => void;
}

export function SingleAgreementDetailsScreen({ 
  onBack, 
  agreement,
  onAcceptAgreement,
  onRejectAgreement
}: SingleAgreementDetailsScreenProps) {
  const otherUser = getUserById(agreement.otherPartyId);
  const creator = getUserById(agreement.createdBy);
  const isPending = agreement.status === "pending";
  const isReceivedRequest = isPending && agreement.createdBy !== currentUser.id;

  if (!otherUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative border border-gray-100">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Agreement Details</h2>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-14 h-14 border-3 border-white/30 shadow-lg">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback className="bg-white text-blue-700">
                    {otherUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{otherUser.name}</h3>
                  <p className="text-sm text-blue-100">{otherUser.phone}</p>
                </div>
              </div>
              {isPending && (
                <div className="bg-yellow-400/90 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                  Pending
                </div>
              )}
              {!isPending && (
                <div className="bg-green-400/90 text-green-900 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Agreement Title</h3>
            <p className="font-medium">{agreement.title}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 mb-1">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{agreement.description}</p>
          </div>

          {agreement.amount && (
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Amount</h3>
              <p className="font-medium text-blue-600">{agreement.amount}</p>
            </div>
          )}

          {agreement.dueDate && (
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Due Date</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>{new Date(agreement.dueDate).toLocaleDateString('en-UG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm text-gray-500 mb-1">Created Date</h3>
            <p className="text-sm text-gray-700">
              {new Date(agreement.createdDate).toLocaleDateString('en-UG', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {creator && (
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Created By</h3>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-gray-200">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                    {creator.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{creator.name}</span>
              </div>
            </div>
          )}
        </div>

        {isReceivedRequest && onAcceptAgreement && onRejectAgreement && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => onAcceptAgreement(agreement.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-6 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Accept Agreement
            </Button>
            <Button 
              onClick={() => onRejectAgreement(agreement.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-6 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Reject Agreement
            </Button>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
