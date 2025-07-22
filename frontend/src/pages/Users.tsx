import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Edit, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createUser, listAthletes, deleteAthlete, createAthlete } from "@/lib/api";

interface Athlete {
  id: number;
  first_name: string;
  last_name: string;
  active: boolean;
}

export default function Users() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);

  const [formData, setFormData] = useState({
    memberId: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gunType: ""
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    listAthletes()
      .then(setAthletes)
      .catch((err) => setError(err.message || "Failed to load athletes"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.gunType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    setAdding(true);
    try {
      // Create athlete first
      const athlete = await createAthlete({
        id: parseInt(formData.memberId),
        first_name: formData.firstName,
        last_name: formData.lastName,
        active: true
      });
      // Use athlete.id as memberId
      await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`,
        athlete_id: athlete.id
      });
      setFormData({
        memberId: athlete.id.toString(),
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gunType: ""
      });
      toast({
        title: "User & Athlete Added",
        description: `${formData.firstName} ${formData.lastName} has been added successfully`,
      });
      // Refresh athletes list
      setLoading(true);
      listAthletes()
        .then(setAthletes)
        .catch((err) => setError(err.message || "Failed to load athletes"))
        .finally(() => setLoading(false));
    } catch (err: unknown) {
      let message = "Failed to add user/athlete";
      if (err instanceof Error) message = err.message;
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAthlete = async (athlete: Athlete) => {
    setAthleteToDelete(athlete);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!athleteToDelete) return;
    setDeletingId(athleteToDelete.id);
    try {
      await deleteAthlete(athleteToDelete.id);
      setAthletes(athletes.filter(a => a.id !== athleteToDelete.id));
      toast({
        title: "Athlete Deleted",
        description: `${athleteToDelete.first_name} ${athleteToDelete.last_name} has been removed successfully`,
      });
    } catch (err: unknown) {
      let message = "Failed to delete athlete";
      if (err instanceof Error) message = err.message;
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setAthleteToDelete(null);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Add and manage club members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add User Form */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-id">Member ID</Label>
                <Input
                  id="member-id"
                  type="number"
                  placeholder="12345"
                  value={formData.memberId}
                  onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gun-type">Gun Type</Label>
                <Select value={formData.gunType} onValueChange={(value) => setFormData({...formData, gunType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gun type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pistol">Pistol</SelectItem>
                    <SelectItem value="rifle">Rifle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="john_doe"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                disabled={adding}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  disabled={adding}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={adding}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={adding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  disabled={adding}
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-primary hover:shadow-golden transition-all duration-300"
              onClick={handleAddUser}
              disabled={adding}
            >
              <Plus className="h-4 w-4 mr-2" />
              {adding ? "Adding..." : "Add User"}
            </Button>
          </CardContent>
        </Card>

        {/* Athletes List */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Club Members ({athletes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading athletes...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {athletes.map((athlete) => (
                  <div key={athlete.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{athlete.first_name} {athlete.last_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Member ID: #{athlete.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* No edit for now */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAthlete(athlete)}
                        className="text-destructive hover:text-destructive"
                        disabled={deletingId === athlete.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Confirmation Dialog */}
        {showConfirm && athleteToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{athleteToDelete.first_name} {athleteToDelete.last_name}</span>?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={deletingId !== null}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={deletingId !== null}>
                  {deletingId === athleteToDelete.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}