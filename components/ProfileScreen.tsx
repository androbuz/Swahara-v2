import { ArrowLeft, User, Phone, Mail, Bell, Shield, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./Logo";
import { currentUser } from "../lib/mockData";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 relative">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Profile & Settings</h2>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-3 shadow-lg border-4 border-blue-100">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="mb-1">{currentUser.name}</h3>
          <p className="text-sm text-gray-500">{currentUser.phone}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-sm">alex.johnson</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-sm">{currentUser.phone}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm">alex.johnson@email.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-sm mb-4">Preferences</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Two-Factor Auth</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <Button 
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-6 transition-colors"
          variant="ghost"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
