import { ArrowLeft, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Agreement } from "../lib/mockData";
import { getUserById } from "../lib/mockData";

interface WebAgreementDetailsScreenProps {
  onBack: () => void;
  userId: string;
  agreements: Agreement[];
  onViewSingleAgreement: (agreementId: string) => void;
}

export function WebAgreementDetailsScreen({ onBack, userId, agreements, onViewSingleAgreement }: WebAgreementDetailsScreenProps) {
  const user = getUserById(userId);
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="mb-6">Agreements with {user.name.split(' ')[0]}</h2>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-lg mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white/30 shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-white text-blue-700 text-xl">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2">{user.name}</h3>
                <p className="text-blue-100">{user.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-center mb-3">
                  <div className="text-3xl font-semibold">{agreements.length}</div>
                  <div className="text-sm text-blue-100">Total Agreements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">{agreements.filter(a => a.status === 'active').length}</div>
                  <div className="text-sm text-blue-100">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agreements List */}
          <div className="space-y-4">
            {agreements.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>No agreements with this person</p>
              </div>
            ) : (
              agreements.map((agreement) => (
                <div 
                  key={agreement.id}
                  onClick={() => onViewSingleAgreement(agreement.id)}
                  className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all cursor-pointer border border-gray-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="flex-1 mr-4">{agreement.title}</h4>
                    {agreement.amount && (
                      <span className="font-medium text-blue-600 whitespace-nowrap">{agreement.amount}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agreement.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {agreement.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(agreement.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${agreement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {agreement.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
