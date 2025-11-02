import { Menu, User, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./Logo";
import type { Agreement, User as UserType } from "../lib/mockData";
import { getUserById, currentUser } from "../lib/mockData";

interface MyAgreementsScreenProps {
  onCreateAgreement: () => void;
  onViewAgreementDetails: (userId: string) => void;
  onViewSingleAgreement: (agreementId: string) => void;
  onViewProfile: () => void;
  myAgreements: Agreement[];
  pendingAgreements: Agreement[];
  onAcceptAgreement: (agreementId: string) => void;
  onRejectAgreement: (agreementId: string) => void;
}

export function MyAgreementsScreen({ 
  onCreateAgreement, 
  onViewAgreementDetails,
  onViewSingleAgreement,
  onViewProfile,
  myAgreements,
  pendingAgreements,
  onAcceptAgreement,
  onRejectAgreement
}: MyAgreementsScreenProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-medium">Swahara</span>
          </div>
          <button 
            onClick={onViewProfile}
            className="hover:scale-105 transition-transform"
          >
            <Avatar className="w-9 h-9 border-2 border-blue-200">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="mb-4">My Agreements</h2>
          {myAgreements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No active agreements yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {myAgreements.map((agreement) => {
                const otherUser = getUserById(agreement.otherPartyId);
                return (
                  <button
                    key={agreement.id}
                    onClick={() => onViewSingleAgreement(agreement.id)}
                    className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center p-3 text-white shadow-md"
                  >
                    <Avatar className="w-12 h-12 mb-2 border-2 border-white/50">
                      <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                      <AvatarFallback className="bg-white/30 text-white backdrop-blur-sm">
                        {otherUser?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center line-clamp-2 font-medium">{agreement.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-4">Pending Agreements</h2>
          {pendingAgreements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No pending agreements</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAgreements.map((agreement) => {
                const otherUser = getUserById(agreement.createdBy);
                return (
                  <div 
                    key={agreement.id} 
                    className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 shadow-sm border border-blue-200 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onViewSingleAgreement(agreement.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm mb-1 font-medium">{agreement.title}</h4>
                        <p className="text-xs text-blue-700">
                          From:{" "}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewAgreementDetails(agreement.createdBy);
                            }}
                            className="underline hover:text-blue-900 transition-colors"
                          >
                            {otherUser?.name}
                          </button>
                        </p>
                      </div>
                      {agreement.amount && (
                        <span className="text-sm font-medium text-blue-800 bg-white/50 px-3 py-1.5 rounded-lg whitespace-nowrap ml-2">{agreement.amount}</span>
                      )}
                    </div>
                    <div className="flex items-end justify-end">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onRejectAgreement(agreement.id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all hover:scale-105 shadow-md"
                        >
                          <X className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptAgreement(agreement.id);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition-all hover:scale-105 shadow-md"
                        >
                          <Check className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button 
          onClick={onCreateAgreement}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 transition-colors"
        >
          Create Agreement
        </Button>

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
