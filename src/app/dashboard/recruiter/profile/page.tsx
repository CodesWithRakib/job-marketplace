// app/dashboard/recruiter/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Save,
  Camera,
  Globe,
  Briefcase,
  Settings,
  Bell,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Company,
  Link,
  Calendar,
  Award,
  Users,
  Star,
  FileText,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";

export default function RecruiterProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    founded: "",
    size: "",
    industry: "",
    profileImage: "",
    companyLogo: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        bio: "",
        company: "",
        location: "",
        website: "",
        founded: "",
        size: "",
        industry: "",
        profileImage: "",
        companyLogo: "",
      });
      // Mock skills for demonstration
      setSkills([
        "Recruitment",
        "Talent Acquisition",
        "HR Management",
        "Interviewing",
      ]);
    }
  }, [session]);

  const handleSaveProfile = () => {
    setIsLoading(true);
    // In a real app, you would make an API call to save the profile
    console.log("Saving profile:", profileData);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success("Profile saved successfully!");
    }, 1000);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData({
            ...profileData,
            profileImage: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData({
            ...profileData,
            companyLogo: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Recruiter Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your profile and company information
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          className="mt-4 md:mt-0 shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:w-1/3 shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
                  <AvatarImage
                    src={profileData.profileImage}
                    alt={profileData.name}
                  />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {profileData.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : "R"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <Label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 cursor-pointer bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border"
                    >
                      <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </Label>
                    <Input
                      id="profile-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-center">
                {profileData.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {profileData.email}
              </p>
              {profileData.company && (
                <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400">
                  <Building className="h-4 w-4 mr-1" />
                  {profileData.company}
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.location}
                </div>
              )}

              <Separator className="my-4" />

              <div className="w-full space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Profile Status
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    Complete
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Member Since
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Jan 2023
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Account Type
                  </span>
                  <Badge variant="outline">Recruiter</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              type="button"
                              className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex mt-2 gap-2">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddSkill}
                          disabled={!newSkill.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your company details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        {profileData.companyLogo ? (
                          <Image
                            src={profileData.companyLogo}
                            alt="Company Logo"
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <Building className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      {isEditing && (
                        <>
                          <Label
                            htmlFor="company-logo-upload"
                            className="absolute bottom-0 right-0 cursor-pointer bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border"
                          >
                            <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          </Label>
                          <Input
                            id="company-logo-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleCompanyLogoUpload}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              company: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              website: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="https://example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded Year</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="founded"
                          value={profileData.founded}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              founded: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="e.g. 2010"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="size"
                          value={profileData.size}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              size: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="e.g. 50-100 employees"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="industry">Industry</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="industry"
                          value={profileData.industry}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              industry: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="e.g. Technology, Finance, Healthcare"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <Bell className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive email notifications for new applications
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        Enabled
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Profile Visibility</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Make your profile visible to job seekers
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        Public
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Account Status</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Current status of your account
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Danger Zone</h3>
                    <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-md bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <h3 className="font-medium text-red-800 dark:text-red-300">
                            Delete Account
                          </h3>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
