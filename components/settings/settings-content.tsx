"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Github,
  Save,
  RotateCcw,
  Download,
  Key,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CreditCard,
  Building,
  Users,
  Settings as SettingsIcon,
  Loader2,
} from "lucide-react";
import {
  useSettingsProfile,
  useUpdateSettingsProfile,
  useSettingsNotifications,
  useUpdateSettingsNotifications,
  useSettingsAI,
  useUpdateSettingsAI,
  useSettingsPrivacy,
  useUpdateSettingsPrivacy,
  useSettingsAppearance,
  useUpdateSettingsAppearance,
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
  useOrganizationSettings,
  useUpdateOrganizationSettings,
  useSettingsSessions,
  useChangePassword,
  useSetup2FA,
  useVerify2FA,
  useDisable2FA,
  useRevokeSession,
  useRevokeAllSessions,
  useSettingsBilling,
  useUpdateSettingsBilling,
} from "@/hooks";

interface SettingsContentProps {
  activeSection: string;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
}

export function SettingsContent({
  activeSection,
  hasChanges,
  setHasChanges,
}: SettingsContentProps) {
  // Real data hooks
  const { data: profile, isLoading: profileLoading } = useSettingsProfile();
  const { data: notifications } = useSettingsNotifications();
  const { data: aiSettings } = useSettingsAI();
  const { data: privacySettings } = useSettingsPrivacy();
  const { data: appearanceSettings } = useSettingsAppearance();
  const { data: apiKeys, isLoading: apiKeysLoading } = useApiKeys();
  const { data: organization } = useOrganizationSettings();
  const { data: sessions } = useSettingsSessions();

  // Account security hooks
  const changePassword = useChangePassword();
  const setup2FA = useSetup2FA();
  const verify2FA = useVerify2FA();
  const disable2FA = useDisable2FA();
  const revokeSession = useRevokeSession();
  const revokeAllSessions = useRevokeAllSessions();
  const { data: billing } = useSettingsBilling();
  const updateBilling = useUpdateSettingsBilling();

  // Mutations
  const updateProfile = useUpdateSettingsProfile();
  const updateNotifications = useUpdateSettingsNotifications();
  const updateAISettings = useUpdateSettingsAI();
  const updatePrivacySettings = useUpdateSettingsPrivacy();
  const updateAppearanceSettings = useUpdateSettingsAppearance();
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const updateOrganization = useUpdateOrganizationSettings();

  // Local state for form data
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    githubUrl: "",
    showEmail: false,
    showLocation: true,
  });

  const [notificationsData, setNotificationsData] = useState({
    email: {
      reviewCompleted: true,
      reviewFailed: true,
      newRepository: true,
      weeklySummary: true,
      marketing: false,
    },
    inApp: {
      aiInsights: true,
      teamMentions: true,
      systemMaintenance: true,
    },
  });

  const [aiSettingsData, setAiSettingsData] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    defaultPersona: "code-quality",
    autoReview: true,
    qualityThreshold: 7.0,
  });

  const [privacyData, setPrivacyData] = useState({
    analytics: true,
    dataSharing: false,
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: "system",
    language: "en",
  });

  const [organizationData, setOrganizationData] = useState({
    name: "",
    description: "",
    website: "",
  });

  // Account security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFAData, setTwoFAData] = useState({
    token: "",
    secret: "",
    qrCode: "",
    isEnabled: false,
    isSettingUp: false,
  });

  // API keys state
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  // hasChanges is managed by parent component

  // Save functions
  const handleSaveProfile = () => {
    // Validation
    if (!profileData.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (profileData.website && !profileData.website.match(/^https?:\/\/.+/)) {
      toast.error(
        "Website must be a valid URL starting with http:// or https://",
      );
      return;
    }

    if (
      profileData.githubUrl &&
      !profileData.githubUrl.match(/^https?:\/\/(www\.)?github\.com\/.+/)
    ) {
      toast.error("GitHub URL must be a valid GitHub profile URL");
      return;
    }

    updateProfile.mutate(profileData);
  };

  const handleSaveNotifications = () => {
    updateNotifications.mutate(notificationsData, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleSaveAI = () => {
    updateAISettings.mutate(aiSettingsData, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleSavePrivacy = () => {
    updatePrivacySettings.mutate(privacyData, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleSaveAppearance = () => {
    updateAppearanceSettings.mutate(appearanceData, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleSaveOrganization = () => {
    // Validation
    if (!organizationData.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (
      organizationData.website &&
      !organizationData.website.match(/^https?:\/\/.+/)
    ) {
      toast.error(
        "Website must be a valid URL starting with http:// or https://",
      );
      return;
    }

    updateOrganization.mutate(organizationData);
  };

  // Reset function to revert to server data
  const handleReset = () => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        githubUrl: profile.githubUrl || "",
        showEmail: profile.showEmail || false,
        showLocation: profile.showLocation !== false,
      });
    }

    if (notifications) {
      setNotificationsData(notifications);
    }

    if (aiSettings) {
      setAiSettingsData(aiSettings);
    }

    if (privacySettings) {
      setPrivacyData(privacySettings);
    }

    if (appearanceSettings) {
      setAppearanceData(appearanceSettings);
    }

    if (organization) {
      setOrganizationData({
        name: organization.name || "",
        description: organization.description || "",
        website: organization.website || "",
      });
    }

    setHasChanges(false);
  };

  // Generic save handler
  const handleSave = () => {
    switch (activeSection) {
      case "profile":
        handleSaveProfile();
        break;
      case "notifications":
        handleSaveNotifications();
        break;
      case "ai":
        handleSaveAI();
        break;
      case "privacy":
        handleSavePrivacy();
        break;
      case "appearance":
        handleSaveAppearance();
        break;
      case "organization":
        handleSaveOrganization();
        break;
      default:
        break;
    }
  };

  // Sync server data with local state
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        githubUrl: profile.githubUrl || "",
        showEmail: profile.showEmail || false,
        showLocation: profile.showLocation !== false,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (notifications) {
      setNotificationsData(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (aiSettings) {
      setAiSettingsData({
        temperature: aiSettings.temperature ?? 0.7,
        maxTokens: aiSettings.maxTokens ?? 2048,
        defaultPersona: aiSettings.defaultPersona ?? "code-quality",
        autoReview: aiSettings.autoReview ?? true,
        qualityThreshold: aiSettings.qualityThreshold ?? 7.0,
      });
    }
  }, [aiSettings]);

  useEffect(() => {
    if (privacySettings) {
      setPrivacyData(privacySettings);
    }
  }, [privacySettings]);

  useEffect(() => {
    if (appearanceSettings) {
      setAppearanceData(appearanceSettings);
    }
  }, [appearanceSettings]);

  useEffect(() => {
    if (organization) {
      setOrganizationData({
        name: organization.name || "",
        description: organization.description || "",
        website: organization.website || "",
      });
    }
  }, [organization]);

  const renderProfileSettings = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.image} />
                <AvatarFallback className="text-lg">
                  {profile?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={profileData.name}
                  onChange={(e) => {
                    setProfileData({ ...profileData, name: e.target.value });
                    setHasChanges(true);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed from profile settings
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={profileData.bio}
                onChange={(e) => {
                  setProfileData({ ...profileData, bio: e.target.value });
                  setHasChanges(true);
                }}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-location">Location</Label>
                <Input
                  id="profile-location"
                  value={profileData.location}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      location: e.target.value,
                    });
                    setHasChanges(true);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="profile-website">Website</Label>
                <Input
                  id="profile-website"
                  value={profileData.website}
                  onChange={(e) => {
                    setProfileData({ ...profileData, website: e.target.value });
                    setHasChanges(true);
                  }}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="profile-github">GitHub Profile</Label>
              <Input
                id="profile-github"
                value={profileData.githubUrl}
                onChange={(e) => {
                  setProfileData({ ...profileData, githubUrl: e.target.value });
                  setHasChanges(true);
                }}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show email address</p>
                <p className="text-sm text-muted-foreground">
                  Make your email visible on your public profile
                </p>
              </div>
              <Switch
                checked={profileData.showEmail}
                onCheckedChange={(checked) => {
                  setProfileData({ ...profileData, showEmail: checked });
                  setHasChanges(true);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show location</p>
                <p className="text-sm text-muted-foreground">
                  Display your location on your public profile
                </p>
              </div>
              <Switch
                checked={profileData.showLocation}
                onCheckedChange={(checked) => {
                  setProfileData({ ...profileData, showLocation: checked });
                  setHasChanges(true);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const handlePasswordChange = () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    changePassword.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      },
    );
  };

  const handleSetup2FA = () => {
    setup2FA.mutate(undefined, {
      onSuccess: (data) => {
        setTwoFAData({
          ...twoFAData,
          secret: data.secret,
          qrCode: data.qrCode,
          isSettingUp: true,
        });
      },
    });
  };

  const handleVerify2FA = () => {
    // Validation
    if (
      !twoFAData.token ||
      twoFAData.token.length !== 6 ||
      !/^\d{6}$/.test(twoFAData.token)
    ) {
      toast.error(
        "Please enter a valid 6-digit code from your authenticator app",
      );
      return;
    }

    verify2FA.mutate(
      {
        token: twoFAData.token,
        secret: twoFAData.secret,
      },
      {
        onSuccess: () => {
          setTwoFAData({
            ...twoFAData,
            isEnabled: true,
            isSettingUp: false,
            token: "",
            secret: "",
            qrCode: "",
          });
        },
      },
    );
  };

  const handleDisable2FA = () => {
    disable2FA.mutate(undefined, {
      onSuccess: () => {
        setTwoFAData({
          ...twoFAData,
          isEnabled: false,
          isSettingUp: false,
        });
      },
    });
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!twoFAData.isEnabled && !twoFAData.isSettingUp && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSetup2FA}
                disabled={setup2FA.isPending}
              >
                {setup2FA.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Enable 2FA
              </Button>
            </div>
          )}

          {twoFAData.isSettingUp && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-medium mb-2">
                  Scan this QR code with your authenticator app
                </p>
                {twoFAData.qrCode && (
                  <img
                    src={twoFAData.qrCode}
                    alt="2FA QR Code"
                    className="mx-auto"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="2fa-token">Enter the 6-digit code</Label>
                <Input
                  id="2fa-token"
                  value={twoFAData.token}
                  onChange={(e) =>
                    setTwoFAData({ ...twoFAData, token: e.target.value })
                  }
                  placeholder="000000"
                  className="mt-1"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleVerify2FA}
                  disabled={verify2FA.isPending || twoFAData.token.length !== 6}
                >
                  {verify2FA.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Verify & Enable
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setTwoFAData({
                      ...twoFAData,
                      isSettingUp: false,
                      qrCode: "",
                      secret: "",
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {twoFAData.isEnabled && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2FA is enabled</p>
                <p className="text-sm text-muted-foreground">
                  Your account is protected with two-factor authentication
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleDisable2FA}
                disabled={disable2FA.isPending}
              >
                {disable2FA.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Disable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{session.device}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.location} •{" "}
                    {session.current
                      ? "Active now"
                      : `${Math.floor((Date.now() - new Date(session.lastActive).getTime()) / (1000 * 60 * 60))} hours ago`}
                  </p>
                </div>
                {session.current ? (
                  <Badge>Current</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeSession.mutate(session.id)}
                    disabled={revokeSession.isPending}
                  >
                    {revokeSession.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Revoke"
                    )}
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => revokeAllSessions.mutate()}
              disabled={revokeAllSessions.isPending}
            >
              {revokeAllSessions.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Revoke All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review completed</p>
              <p className="text-sm text-muted-foreground">
                When AI finishes reviewing your code
              </p>
            </div>
            <Switch
              checked={notificationsData.email.reviewCompleted}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  email: {
                    ...notificationsData.email,
                    reviewCompleted: checked,
                  },
                });
                setHasChanges(true);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review failed</p>
              <p className="text-sm text-muted-foreground">
                When AI review encounters an error
              </p>
            </div>
            <Switch
              checked={notificationsData.email.reviewFailed}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  email: { ...notificationsData.email, reviewFailed: checked },
                });
                setHasChanges(true);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New repository added</p>
              <p className="text-sm text-muted-foreground">
                When repositories are connected
              </p>
            </div>
            <Switch
              checked={notificationsData.email.newRepository}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  email: { ...notificationsData.email, newRepository: checked },
                });
                setHasChanges(true);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly summary</p>
              <p className="text-sm text-muted-foreground">
                Weekly review activity summary
              </p>
            </div>
            <Switch
              checked={notificationsData.email.weeklySummary}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  email: { ...notificationsData.email, weeklySummary: checked },
                });
                setHasChanges(true);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI insights available</p>
              <p className="text-sm text-muted-foreground">
                When new AI recommendations are ready
              </p>
            </div>
            <Switch
              checked={notificationsData.inApp.aiInsights}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  inApp: { ...notificationsData.inApp, aiInsights: checked },
                });
                setHasChanges(true);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Team mentions</p>
              <p className="text-sm text-muted-foreground">
                When mentioned in reviews or comments
              </p>
            </div>
            <Switch
              checked={notificationsData.inApp.teamMentions}
              onCheckedChange={(checked) => {
                setNotificationsData({
                  ...notificationsData,
                  inApp: { ...notificationsData.inApp, teamMentions: checked },
                });
                setHasChanges(true);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-temperature">Temperature</Label>
              <div className="mt-1">
                <input
                  id="ai-temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={aiSettingsData.temperature}
                  onChange={(e) => {
                    setAiSettingsData({
                      ...aiSettingsData,
                      temperature: parseFloat(e.target.value),
                    });
                    setHasChanges(true);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conservative (0.0)</span>
                  <span className="font-medium">
                    {aiSettingsData.temperature}
                  </span>
                  <span>Creative (2.0)</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="ai-max-tokens">Max Tokens</Label>
              <Select
                value={aiSettingsData.maxTokens.toString()}
                onValueChange={(value) => {
                  setAiSettingsData({
                    ...aiSettingsData,
                    maxTokens: parseInt(value),
                  });
                  setHasChanges(true);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512 (Short responses)</SelectItem>
                  <SelectItem value="1024">1024 (Standard)</SelectItem>
                  <SelectItem value="2048">2048 (Detailed)</SelectItem>
                  <SelectItem value="4096">4096 (Comprehensive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ai-persona">Default Persona</Label>
            <Select
              value={aiSettingsData.defaultPersona}
              onValueChange={(value) => {
                setAiSettingsData({ ...aiSettingsData, defaultPersona: value });
                setHasChanges(true);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code-quality">
                  Code Quality Expert
                </SelectItem>
                <SelectItem value="security">Security Guardian</SelectItem>
                <SelectItem value="performance">
                  Performance Optimizer
                </SelectItem>
                <SelectItem value="documentation">
                  Documentation Guide
                </SelectItem>
                <SelectItem value="testing">Testing Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-review new PRs</p>
              <p className="text-sm text-muted-foreground">
                Automatically start AI review when PRs are created
              </p>
            </div>
            <Switch
              checked={aiSettingsData.autoReview}
              onCheckedChange={(checked) => {
                setAiSettingsData({ ...aiSettingsData, autoReview: checked });
                setHasChanges(true);
              }}
            />
          </div>

          <div>
            <Label htmlFor="ai-threshold">Quality Threshold</Label>
            <div className="mt-1">
              <input
                id="ai-threshold"
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={aiSettingsData.qualityThreshold}
                onChange={(e) => {
                  setAiSettingsData({
                    ...aiSettingsData,
                    qualityThreshold: parseFloat(e.target.value),
                  });
                  setHasChanges(true);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low (1.0)</span>
                <span className="font-medium">
                  {aiSettingsData.qualityThreshold}
                </span>
                <span>High (10.0)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Sharing & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics & Usage Data</p>
              <p className="text-sm text-muted-foreground">
                Help improve Code-Reverb by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={privacyData.analytics}
              onCheckedChange={(checked) => {
                setPrivacyData({ ...privacyData, analytics: checked });
                setHasChanges(true);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Sharing</p>
              <p className="text-sm text-muted-foreground">
                Allow sharing anonymized review data for research
              </p>
            </div>
            <Switch
              checked={privacyData.dataSharing}
              onCheckedChange={(checked) => {
                setPrivacyData({ ...privacyData, dataSharing: checked });
                setHasChanges(true);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appearance-theme">Theme</Label>
            <Select
              value={appearanceData.theme}
              onValueChange={(value) => {
                setAppearanceData({ ...appearanceData, theme: value });
                setHasChanges(true);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="appearance-language">Language</Label>
            <Select
              value={appearanceData.language}
              onValueChange={(value) => {
                setAppearanceData({ ...appearanceData, language: value });
                setHasChanges(true);
              }}
            >
              <SelectTrigger className="mt-1">
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
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => {
    if (apiKeysLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage API keys for integrations and webhooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys && apiKeys.length > 0 ? (
                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{apiKey.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {apiKey.type} • Last used:{" "}
                          {apiKey.lastUsed
                            ? new Date(apiKey.lastUsed).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteApiKey.mutate(apiKey.id)}
                        disabled={deleteApiKey.isPending}
                      >
                        {deleteApiKey.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No API keys found.
                </p>
              )}

              <Dialog
                open={showApiKeyDialog}
                onOpenChange={setShowApiKeyDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key for accessing Code-Reverb
                      programmatically.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key-name">Key Name</Label>
                      <Input
                        id="api-key-name"
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                        placeholder="e.g., Development Key, CI/CD Key"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowApiKeyDialog(false);
                        setNewApiKeyName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!newApiKeyName.trim()) {
                          toast.error("API key name is required");
                          return;
                        }

                        createApiKey.mutate(
                          {
                            name: newApiKeyName.trim(),
                            type: "api",
                          },
                          {
                            onSuccess: () => {
                              setShowApiKeyDialog(false);
                              setNewApiKeyName("");
                            },
                          },
                        );
                      }}
                      disabled={createApiKey.isPending}
                    >
                      {createApiKey.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Create Key
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>
              Configure webhook endpoints for real-time notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Webhook configuration will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {organization?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "O"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={organizationData.name}
                onChange={(e) => {
                  setOrganizationData({
                    ...organizationData,
                    name: e.target.value,
                  });
                  setHasChanges(true);
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                placeholder="https://example.com"
                value={organizationData.website || ""}
                onChange={(e) => {
                  setOrganizationData({
                    ...organizationData,
                    website: e.target.value,
                  });
                  setHasChanges(true);
                }}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="org-description">Description</Label>
            <Textarea
              id="org-description"
              value={organizationData.description}
              onChange={(e) => {
                setOrganizationData({
                  ...organizationData,
                  description: e.target.value,
                });
                setHasChanges(true);
              }}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {organization?.members && (
        <Card>
          <CardHeader>
            <CardTitle>Members ({organization.members.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {organization.members.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.image} />
                      <AvatarFallback>
                        {member.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {organization.isOwner &&
                      member.id === organization.owner?.id
                        ? "Owner"
                        : "Member"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {billing?.subscription?.plan || "Free"}
              </p>
              <p className="text-sm text-muted-foreground">
                {billing?.subscription?.status === "active"
                  ? "Active subscription"
                  : "Inactive"}
              </p>
            </div>
            <Badge
              variant={
                billing?.subscription?.status === "active"
                  ? "default"
                  : "secondary"
              }
            >
              {billing?.subscription?.status || "Inactive"}
            </Badge>
          </div>
          {billing?.subscription?.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground mt-2">
              Next billing date:{" "}
              {new Date(
                billing.subscription.currentPeriodEnd,
              ).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          {billing?.paymentMethod ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8" />
                <div>
                  <p className="font-medium">
                    {billing.paymentMethod.brand.toUpperCase()} ****{" "}
                    {billing.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {billing.paymentMethod.expiryMonth}/
                    {billing.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No payment method on file
              </p>
              <Button className="mt-2">Add Payment Method</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {billing?.invoices && billing.invoices.length > 0 ? (
            <div className="space-y-3">
              {billing.invoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      ${(invoice.amount / 100).toFixed(2)}{" "}
                      {invoice.currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        invoice.status === "paid" ? "default" : "secondary"
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={invoice.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No billing history available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancel Subscription</p>
              <p className="text-sm text-muted-foreground">
                Your subscription will remain active until the end of the
                current billing period
              </p>
            </div>
            <Button variant="destructive">Cancel Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "account":
        return renderAccountSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "security":
        return renderSecuritySettings();
      case "ai":
        return renderAISettings();
      case "appearance":
        return renderAppearanceSettings();
      case "organization":
        return renderOrganizationSettings();
      case "billing":
        return renderBillingSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Changes will be saved automatically
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
