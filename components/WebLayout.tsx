import { Home, FileText, Plus, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./Logo";
import { currentUser } from "../lib/mockData";

interface WebLayoutProps {
  children: React.ReactNode;
  currentPage: "myAgreements" | "createAgreement" | "profile";
  onNavigate: (page: "myAgreements" | "createAgreement" | "profile") => void;
  onLogout?: () => void;
}

export function WebLayout({ children, currentPage, onNavigate, onLogout }: WebLayoutProps) {
  const navItems = [
    { id: "myAgreements" as const, label: "My Agreements", icon: Home },
    { id: "createAgreement" as const, label: "Create Agreement", icon: Plus },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Logo size={32} />
            <span className="font-medium text-xl">Swahara</span>
          </div>

          {/* User Profile Section */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 mb-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-white text-blue-700">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{currentUser.name}</h3>
                <p className="text-xs text-blue-100">{currentUser.phone}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
