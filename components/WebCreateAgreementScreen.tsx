import { useState } from "react";
import { WebLayout } from "./WebLayout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { users } from "../lib/mockData";
import type { Agreement } from "../lib/mockData";

interface WebCreateAgreementScreenProps {
  onNavigate: (page: "myAgreements" | "createAgreement" | "profile") => void;
  onCreateAgreement: (agreement: Omit<Agreement, "id">) => void;
  onLogout: () => void;
}

export function WebCreateAgreementScreen({ onNavigate, onCreateAgreement, onLogout }: WebCreateAgreementScreenProps) {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !title || !description) return;

    onCreateAgreement({
      title,
      description,
      otherPartyId: selectedUser,
      createdDate: new Date().toISOString().split('T')[0],
      status: "active",
      amount: amount || undefined,
      dueDate: dueDate || undefined,
      createdBy: "user-1"
    });

    // Reset form
    setSelectedUser("");
    setTitle("");
    setDescription("");
    setAmount("");
    setDueDate("");
    
    onNavigate("myAgreements");
  };

  return (
    <WebLayout currentPage="createAgreement" onNavigate={onNavigate} onLogout={onLogout}>
      <div>
        <div className="mb-8">
          <h1 className="mb-2">Create New Agreement</h1>
          <p className="text-gray-600">Fill in the details to create a new agreement</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select User */}
            <div>
              <Label htmlFor="user" className="text-sm text-gray-700 mb-3 block">Select Person</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedUser === user.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="w-12 h-12 border-2 border-gray-200">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agreement Title */}
            <div>
              <Label htmlFor="title" className="text-sm text-gray-700 mb-2 block">Agreement Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Boda Boda Purchase"
                required
                className="rounded-xl border-gray-300 py-6"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm text-gray-700 mb-2 block">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the agreement details..."
                required
                rows={5}
                className="rounded-xl border-gray-300 resize-none"
              />
            </div>

            {/* Amount and Due Date */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="amount" className="text-sm text-gray-700 mb-2 block">Amount (Optional)</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., UGX 500,000"
                  className="rounded-xl border-gray-300 py-6"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-sm text-gray-700 mb-2 block">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl border-gray-300 py-6"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={() => onNavigate("myAgreements")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl py-6 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedUser || !title || !description}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Agreement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WebLayout>
  );
}
