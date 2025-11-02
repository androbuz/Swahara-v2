import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Agreement } from "../lib/mockData";
import { getUserById } from "../lib/mockData";

interface AgreementDetailsScreenProps {
  onBack: () => void;
  userId: string;
  agreements: Agreement[];
  onViewSingleAgreement: (agreementId: string) => void;
}

export function AgreementDetailsScreen({ onBack, userId, agreements, onViewSingleAgreement }: AgreementDetailsScreenProps) {
  const user = getUserById(userId);
  
  if (!user) {
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
          <h2>Agreements with {user.name.split(' ')[0]}</h2>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 relative text-white shadow-lg">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-20 h-20 mb-3 border-4 border-white/30 shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-white text-blue-700">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-blue-100">{user.phone}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-blue-100">Total Agreements</span>
                <span className="font-medium">{agreements.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Active</span>
                <span className="font-medium">{agreements.filter(a => a.status === 'active').length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {agreements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No agreements with this person</p>
            </div>
          ) : (
            agreements.map((agreement) => (
              <div 
                key={agreement.id}
                onClick={() => onViewSingleAgreement(agreement.id)}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all cursor-pointer border border-gray-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="flex-1 mr-2">{agreement.title}</h4>
                  {agreement.amount && (
                    <span className="text-sm font-medium text-blue-600 whitespace-nowrap">{agreement.amount}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agreement.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {agreement.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(agreement.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className={`px-2 py-1 rounded-full ${agreement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {agreement.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
