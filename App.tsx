import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { MyAgreementsScreen } from "./components/MyAgreementsScreen";
import { AgreementDetailsScreen } from "./components/AgreementDetailsScreen";
import { SingleAgreementDetailsScreen } from "./components/SingleAgreementDetailsScreen";
import { CreateAgreementScreen } from "./components/CreateAgreementScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { WebMyAgreementsScreen } from "./components/WebMyAgreementsScreen";
import { WebAgreementDetailsScreen } from "./components/WebAgreementDetailsScreen";
import { WebSingleAgreementDetailsScreen } from "./components/WebSingleAgreementDetailsScreen";
import { WebCreateAgreementScreen } from "./components/WebCreateAgreementScreen";
import { WebProfileScreen } from "./components/WebProfileScreen";
import { initialAgreements, getAgreementsByUserId, getMyActiveAgreements, getPendingAgreements } from "./lib/mockData";
import type { Agreement } from "./lib/mockData";
import { toast, Toaster } from "sonner@2.0.3";

type Screen = "login" | "myAgreements" | "agreementDetails" | "singleAgreementDetails" | "createAgreement" | "profile";
type ViewMode = "mobile" | "web";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("web");
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);

  const handleViewAgreementDetails = (userId: string) => {
    setSelectedUserId(userId);
    setPreviousScreen(currentScreen);
    setCurrentScreen("agreementDetails");
  };

  const handleViewSingleAgreement = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    setPreviousScreen(currentScreen);
    setCurrentScreen("singleAgreementDetails");
  };

  const handleCreateAgreement = (newAgreement: Omit<Agreement, "id">) => {
    const agreement: Agreement = {
      ...newAgreement,
      id: `agr-${Date.now()}`
    };
    setAgreements([...agreements, agreement]);
    toast.success("Agreement created successfully!");
  };

  const handleAcceptAgreement = (agreementId: string) => {
    setAgreements(agreements.map(agr => 
      agr.id === agreementId ? { ...agr, status: "active" as const } : agr
    ));
    toast.success("Agreement accepted!");
    setCurrentScreen("myAgreements");
  };

  const handleRejectAgreement = (agreementId: string) => {
    setAgreements(agreements.filter(agr => agr.id !== agreementId));
    toast.error("Agreement rejected");
    setCurrentScreen("myAgreements");
  };

  const handleLogout = () => {
    setCurrentScreen("login");
    setAgreements(initialAgreements);
    toast.success("Logged out successfully");
  };

  const handleNavigate = (page: "myAgreements" | "createAgreement" | "profile") => {
    setCurrentScreen(page);
  };

  const renderScreen = () => {
    if (viewMode === "web") {
      // Web version
      switch (currentScreen) {
        case "login":
          return <LoginScreen onLogin={() => setCurrentScreen("myAgreements")} />;
        case "myAgreements":
          return (
            <WebMyAgreementsScreen
              onNavigate={handleNavigate}
              onViewAgreementDetails={handleViewAgreementDetails}
              onViewSingleAgreement={handleViewSingleAgreement}
              myAgreements={getMyActiveAgreements(agreements)}
              pendingAgreements={getPendingAgreements(agreements)}
              onAcceptAgreement={handleAcceptAgreement}
              onRejectAgreement={handleRejectAgreement}
              onLogout={handleLogout}
            />
          );
        case "agreementDetails":
          return selectedUserId ? (
            <WebAgreementDetailsScreen 
              onBack={() => setCurrentScreen("myAgreements")} 
              userId={selectedUserId}
              agreements={getAgreementsByUserId(selectedUserId, agreements)}
              onViewSingleAgreement={handleViewSingleAgreement}
            />
          ) : null;
        case "singleAgreementDetails":
          const selectedAgreement = agreements.find(agr => agr.id === selectedAgreementId);
          return selectedAgreement ? (
            <WebSingleAgreementDetailsScreen 
              onBack={() => {
                if (previousScreen === "agreementDetails") {
                  setCurrentScreen("agreementDetails");
                } else {
                  setCurrentScreen("myAgreements");
                }
              }} 
              agreement={selectedAgreement}
              onAcceptAgreement={handleAcceptAgreement}
              onRejectAgreement={handleRejectAgreement}
            />
          ) : null;
        case "createAgreement":
          return (
            <WebCreateAgreementScreen 
              onNavigate={handleNavigate}
              onCreateAgreement={handleCreateAgreement}
              onLogout={handleLogout}
            />
          );
        case "profile":
          return (
            <WebProfileScreen
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          );
        default:
          return <LoginScreen onLogin={() => setCurrentScreen("myAgreements")} />;
      }
    } else {
      // Mobile version
      switch (currentScreen) {
        case "login":
          return <LoginScreen onLogin={() => setCurrentScreen("myAgreements")} />;
        case "myAgreements":
          return (
            <MyAgreementsScreen
              onCreateAgreement={() => setCurrentScreen("createAgreement")}
              onViewAgreementDetails={handleViewAgreementDetails}
              onViewSingleAgreement={handleViewSingleAgreement}
              onViewProfile={() => setCurrentScreen("profile")}
              myAgreements={getMyActiveAgreements(agreements)}
              pendingAgreements={getPendingAgreements(agreements)}
              onAcceptAgreement={handleAcceptAgreement}
              onRejectAgreement={handleRejectAgreement}
            />
          );
        case "agreementDetails":
          return selectedUserId ? (
            <AgreementDetailsScreen 
              onBack={() => setCurrentScreen("myAgreements")} 
              userId={selectedUserId}
              agreements={getAgreementsByUserId(selectedUserId, agreements)}
              onViewSingleAgreement={handleViewSingleAgreement}
            />
          ) : null;
        case "singleAgreementDetails":
          const selectedAgreement = agreements.find(agr => agr.id === selectedAgreementId);
          return selectedAgreement ? (
            <SingleAgreementDetailsScreen 
              onBack={() => {
                if (previousScreen === "agreementDetails") {
                  setCurrentScreen("agreementDetails");
                } else {
                  setCurrentScreen("myAgreements");
                }
              }} 
              agreement={selectedAgreement}
              onAcceptAgreement={handleAcceptAgreement}
              onRejectAgreement={handleRejectAgreement}
            />
          ) : null;
        case "createAgreement":
          return (
            <CreateAgreementScreen 
              onBack={() => setCurrentScreen("myAgreements")}
              onCreateAgreement={handleCreateAgreement}
              onViewProfile={() => setCurrentScreen("profile")}
            />
          );
        case "profile":
          return (
            <ProfileScreen
              onBack={() => setCurrentScreen("myAgreements")}
              onLogout={handleLogout}
            />
          );
        default:
          return <LoginScreen onLogin={() => setCurrentScreen("myAgreements")} />;
      }
    }
  };

  return (
    <div className="size-full">
      <Toaster position="top-center" />
      {currentScreen !== "login" && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setViewMode(viewMode === "web" ? "mobile" : "web")}
            className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Switch to {viewMode === "web" ? "Mobile" : "Web"} View
          </button>
        </div>
      )}
      {renderScreen()}
    </div>
  );
}
