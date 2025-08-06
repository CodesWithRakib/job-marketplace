// app/dashboard/recruiter/settings/page.tsx
"use client";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  RefreshCw,
  Bell,
  Mail,
  Eye,
  Shield,
  Settings,
  Globe,
  Moon,
  Sun,
  Lock,
  User,
  AlertTriangle,
  CheckCircle,
  Key,
  Smartphone,
  Monitor,
  Tablet,
  LogOut,
  Fingerprint,
  SmartphoneNfc,
  MessageSquare,
  Bot,
  Zap,
  Badge,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RecruiterSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisibility: "public",
    autoReplyEnabled: false,
    autoReplyMessage:
      "Thank you for your application. We will review it and get back to you soon.",
    jobAlerts: true,
    applicationAlerts: true,
    messageAlerts: true,
    language: "en",
    timezone: "UTC",
    darkMode: theme === "dark",
    twoFactorEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "current",
      device: "Current Session",
      browser: navigator.userAgent.split(" ").slice(-3).join(" "),
      location: "New York, USA",
      isActive: true,
      isCurrent: true,
    },
    {
      id: "mobile",
      device: "iPhone 13",
      browser: "Safari",
      location: "San Francisco, USA",
      isActive: true,
      isCurrent: false,
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call to save settings
      console.log("Saving settings:", settings);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      emailNotifications: true,
      profileVisibility: "public",
      autoReplyEnabled: false,
      autoReplyMessage:
        "Thank you for your application. We will review it and get back to you soon.",
      jobAlerts: true,
      applicationAlerts: true,
      messageAlerts: true,
      language: "en",
      timezone: "UTC",
      darkMode: theme === "dark",
      twoFactorEnabled: false,
    });
    toast.info("Settings reset to default");
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      // In a real app, you would implement password change functionality
      console.log("Changing password");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    setSettings({ ...settings, darkMode: checked });
    setTheme(checked ? "dark" : "light");
  };

  const handleToggleTwoFactor = () => {
    setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled });
    toast.success(
      `Two-factor authentication ${
        !settings.twoFactorEnabled ? "enabled" : "disabled"
      }`
    );
  };

  const handleTerminateSession = (id: string) => {
    if (id === "current") {
      toast.error("Cannot terminate current session");
      return;
    }

    setActiveSessions(activeSessions.filter((session) => session.id !== id));
    toast.success("Session terminated successfully");
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) {
      return <Smartphone className="h-5 w-5" />;
    } else if (device.includes("iPad") || device.includes("Tablet")) {
      return <Tablet className="h-5 w-5" />;
    } else {
      return <Monitor className="h-5 w-5" />;
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="shadow-sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset all settings to default? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetSettings}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="shadow-sm"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6 w-full">
          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure which email notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for various events
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="jobAlerts" className="font-medium">
                    Job Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your jobs receive applications
                  </p>
                </div>
                <Switch
                  id="jobAlerts"
                  checked={settings.jobAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, jobAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="applicationAlerts" className="font-medium">
                    Application Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when applications are submitted
                  </p>
                </div>
                <Switch
                  id="applicationAlerts"
                  checked={settings.applicationAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, applicationAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="messageAlerts" className="font-medium">
                    Message Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive new messages
                  </p>
                </div>
                <Switch
                  id="messageAlerts"
                  checked={settings.messageAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, messageAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-500" />
                Auto Reply
              </CardTitle>
              <CardDescription>
                Configure automatic replies to applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="autoReplyEnabled" className="font-medium">
                    Enable Auto Reply
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send a reply when applications are received
                  </p>
                </div>
                <Switch
                  id="autoReplyEnabled"
                  checked={settings.autoReplyEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoReplyEnabled: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoReplyMessage" className="font-medium">
                  Auto Reply Message
                </Label>
                <Textarea
                  id="autoReplyMessage"
                  value={settings.autoReplyMessage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoReplyMessage: e.target.value,
                    })
                  }
                  rows={4}
                  disabled={!settings.autoReplyEnabled}
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6 w-full">
          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                Profile Privacy
              </CardTitle>
              <CardDescription>
                Manage your profile visibility and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility" className="font-medium">
                  Profile Visibility
                </Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) =>
                    setSettings({ ...settings, profileVisibility: value })
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public - Anyone can view your profile
                      </div>
                    </SelectItem>
                    <SelectItem value="recruiters">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Recruiters Only - Only other recruiters can view your
                        profile
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Private - Only you can view your profile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {settings.profileVisibility === "public" &&
                    "Your profile is visible to everyone"}
                  {settings.profileVisibility === "recruiters" &&
                    "Only other recruiters can see your profile"}
                  {settings.profileVisibility === "private" &&
                    "Your profile is private"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 w-full">
          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language" className="font-medium">
                    Language
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      setSettings({ ...settings, language: value })
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      setSettings({ ...settings, timezone: value })
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                      <SelectItem value="MST">Mountain Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="font-medium">Theme</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    {settings.darkMode ? (
                      <Moon className="h-6 w-6 text-indigo-500 mr-3" />
                    ) : (
                      <Sun className="h-6 w-6 text-amber-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">
                        {settings.darkMode ? "Dark Mode" : "Light Mode"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {settings.darkMode
                          ? "You're currently using dark mode"
                          : "You're currently using light mode"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={handleThemeChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 w-full">
          <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="shadow-sm"
                  disabled={
                    isChangingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                >
                  <Key className="mr-2 h-4 w-4" />
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        settings.twoFactorEnabled
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {settings.twoFactorEnabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Fingerprint className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        {settings.twoFactorEnabled
                          ? "Your account is protected with 2FA"
                          : "Add an extra layer of security to your account"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={settings.twoFactorEnabled ? "outline" : "default"}
                    className="shadow-sm"
                    onClick={handleToggleTwoFactor}
                  >
                    {settings.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Active Sessions</h3>
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            session.isCurrent
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {getDeviceIcon(session.device)}
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.browser} • {session.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isActive && (
                          <Badge
                            variant={session.isCurrent ? "default" : "outline"}
                          >
                            {session.isCurrent ? "Current" : "Active"}
                          </Badge>
                        )}
                        {!session.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTerminateSession(session.id)}
                            className="shadow-sm"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
