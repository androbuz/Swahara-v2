import { Menu, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Logo } from "./Logo";
import { useState } from "react";
import type { Agreement } from "../lib/mockData";
import { currentUser } from "../lib/mockData";

interface CreateAgreementScreenProps {
  onBack: () => void;
  onCreateAgreement: (agreement: Omit<Agreement, "id">) => void;
  onViewProfile: () => void;
}

export function CreateAgreementScreen({ onBack, onCreateAgreement, onViewProfile }: CreateAgreementScreenProps) {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    phone: "",
    description: "",
    amount: "",
    dueDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.name || !formData.description) {
      return;
    }

    // Create new agreement
    const newAgreement: Omit<Agreement, "id"> = {
      title: formData.title,
      description: formData.description,
      otherPartyId: "user-" + Date.now(), // In a real app, this would be a proper user ID
      createdDate: new Date().toISOString().split('T')[0],
      status: "pending",
      amount: formData.amount || undefined,
      dueDate: formData.dueDate || undefined,
      createdBy: "user-1"
    };

    onCreateAgreement(newAgreement);
    onBack();
  };

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

        <h2 className="mb-6">Create New Agreement</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm mb-2 block">Agreement Title</Label>
            <Input 
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Laptop Purchase Agreement"
              required
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm mb-2 block">Name of other party</Label>
            <Input 
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm mb-2 block">Phone</Label>
            <Input 
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm mb-2 block">Amount (optional)</Label>
            <Input 
              id="amount"
              type="text"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              placeholder="$500"
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm mb-2 block">Due Date (optional)</Label>
            <Input 
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm mb-2 block">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the agreement terms and conditions..."
              required
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-6 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 transition-colors"
            >
              Submit
            </Button>
          </div>
        </form>

        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
