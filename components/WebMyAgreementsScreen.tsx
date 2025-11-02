import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { WebLayout } from "./WebLayout";
import type { Agreement, User as UserType } from "../lib/mockData";
import { getUserById } from "../lib/mockData";

interface WebMyAgreementsScreenProps {
  onNavigate: (page: "myAgreements" | "createAgreement" | "profile") => void;
  onViewAgreementDetails: (userId: string) => void;
  onViewSingleAgreement: (agreementId: string) => void;
  myAgreements: Agreement[];
  pendingAgreements: Agreement[];
  onAcceptAgreement: (agreementId: string) => void;
  onRejectAgreement: (agreementId: string) => void;
  onLogout: () => void;
}

export function WebMyAgreementsScreen({ 
  onNavigate,
  onViewAgreementDetails,
  onViewSingleAgreement,
  myAgreements,
  pendingAgreements,
  onAcceptAgreement,
  onRejectAgreement,
  onLogout
}: WebMyAgreementsScreenProps) {
  return (
    <WebLayout currentPage="myAgreements" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your agreements and pending requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Active Agreements</h3>
            </div>
            <p className="text-3xl font-semibold text-blue-600">{myAgreements.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Pending Requests</h3>
            </div>
            <p className="text-3xl font-semibold text-orange-600">{pendingAgreements.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-gray-600">Total Agreements</h3>
            </div>
            <p className="text-3xl font-semibold text-gray-800">{myAgreements.length + pendingAgreements.length}</p>
          </div>
        </div>

        {/* My Agreements */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="mb-6">My Active Agreements</h2>
          {myAgreements.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No active agreements yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myAgreements.map((agreement) => {
                const otherUser = getUserById(agreement.otherPartyId);
                return (
                  <button
                    key={agreement.id}
                    onClick={() => onViewSingleAgreement(agreement.id)}
                    className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl hover:shadow-xl transition-all hover:scale-105 flex flex-col items-center justify-center p-4 text-white shadow-lg"
                  >
                    <Avatar className="w-16 h-16 mb-3 border-3 border-white/50 shadow-md">
                      <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                      <AvatarFallback className="bg-white/30 text-white backdrop-blur-sm">
                        {otherUser?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-center line-clamp-2 font-medium">{agreement.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Agreements */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="mb-6">Pending Requests</h2>
          {pendingAgreements.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAgreements.map((agreement) => {
                const otherUser = getUserById(agreement.createdBy);
                return (
                  <div 
                    key={agreement.id} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onViewSingleAgreement(agreement.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="mb-1 font-medium">{agreement.title}</h4>
                        <p className="text-sm text-blue-700">
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
                        <span className="font-medium text-blue-800 bg-white/60 px-4 py-2 rounded-xl whitespace-nowrap ml-4">{agreement.amount}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRejectAgreement(agreement.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md flex items-center gap-2"
                      >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-sm font-medium">Reject</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcceptAgreement(agreement.id);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-sm font-medium">Accept</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
