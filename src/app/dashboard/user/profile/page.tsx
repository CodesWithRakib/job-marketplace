// app/dashboard/user/profile/page.tsx
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
  Briefcase,
  Edit,
  Save,
  Upload,
  Camera,
  X,
  Settings,
  FileText,
  Bell,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
    skills: [] as string[],
    experience: "",
    education: "",
    resume: "",
    profileImage: "",
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        bio: "",
        location: "",
        website: "",
        skills: [],
        experience: "",
        education: "",
        resume: "",
        profileImage: "",
      });
    }
  }, [session]);

  const handleSaveProfile = () => {
    // In a real app, you would make an API call to save the profile
    console.log("Saving profile:", profileData);
    setIsEditing(false);
    toast.success("Profile saved successfully!");
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      console.log("Uploading file:", file);
      setProfileData({
        ...profileData,
        resume: file.name,
      });
      toast.success("Resume uploaded successfully!");
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      console.log("Uploading profile image:", file);
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
      toast.success("Profile picture updated!");
    }
  };

  return (
    <div className="w-full space-y-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your profile information
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          className="mt-4 md:mt-0 shadow-sm"
        >
          {isEditing ? (
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

      <div className="flex flex-col lg:flex-row gap-6 w-full">
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
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                    {profileData.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : "U"}
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
                  <Badge variant="outline">Job Seeker</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:w-2/3 w-full">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 w-full">
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
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Update your professional details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        value={profileData.experience}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            experience: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Describe your work experience..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Textarea
                        id="education"
                        value={profileData.education}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            education: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Describe your education..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
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
                              onClick={() => handleSkillRemove(skill)}
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
                              handleSkillAdd();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSkillAdd}
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

            <TabsContent value="resume" className="space-y-6 w-full">
              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>
                    Upload and manage your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Current Resume</Label>
                    <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center">
                        <Briefcase className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">
                            {profileData.resume || "No resume uploaded"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {profileData.resume
                              ? "PDF, DOC, or DOCX"
                              : "Upload your resume"}
                          </p>
                        </div>
                      </div>
                      {isEditing && (
                        <div>
                          <Label
                            htmlFor="resume-upload"
                            className="cursor-pointer"
                          >
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-1" />
                                {profileData.resume ? "Replace" : "Upload"}
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id="resume-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Resume Tips</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <p>
                          Keep your resume to one page if you have less than 10
                          years of experience
                        </p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <p>
                          Use keywords from the job description to pass ATS
                          scans
                        </p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <p>
                          Quantify your achievements with numbers and metrics
                        </p>
                      </div>
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <p>
                          Avoid including personal information like age or
                          marital status
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 w-full">
              <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive email notifications for application updates
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

                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h3 className="font-medium">Profile Visibility</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Make your profile visible to recruiters
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

                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-500 mr-3" />
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
