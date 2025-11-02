import { Mail, Phone, User, Calendar } from "lucide-react";
import { WebLayout } from "./WebLayout";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { currentUser } from "../lib/mockData";

interface WebProfileScreenProps {
  onNavigate: (page: "myAgreements" | "createAgreement" | "profile") => void;
  onLogout: () => void;
}

export function WebProfileScreen({ onNavigate, onLogout }: WebProfileScreenProps) {
  return (
    <WebLayout currentPage="profile" onNavigate={onNavigate} onLogout={onLogout}>
      <div>
        <div className="mb-8">
          <h1 className="mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="max-w-3xl">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-lg mb-8">
              <div className="flex items-center gap-6">
                <Avatar className="w-32 h-32 border-4 border-white/30 shadow-xl">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-white text-blue-700 text-3xl">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl mb-2">{currentUser.name}</h2>
                  <p className="text-blue-100">Active User</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{currentUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">October 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </WebLayout>
  );
}
