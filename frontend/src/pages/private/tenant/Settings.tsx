import { useEffect, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
 

const TenantSettings = () => {
  const [saving, setSaving] = useState(false);
 

  const STORAGE_KEY = "tenant_notification_settings";
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    paymentReminders: true,
    messageNotifications: true,
  });

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // Helper to persist immediately when toggles change
  const updateAndPersist = (next: typeof notifications) => {
    setNotifications(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      toast.success("Notification settings saved");
    } finally {
      setSaving(false);
    }
  };

  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage notifications or deactivate your account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card id="notifications">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(v) => updateAndPersist({ ...notifications, emailNotifications: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-xs text-gray-500">Browser/device notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(v) => updateAndPersist({ ...notifications, pushNotifications: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Reminders</Label>
                <p className="text-xs text-gray-500">Rent due and receipt notifications</p>
              </div>
              <Switch
                checked={notifications.paymentReminders}
                onCheckedChange={(v) => updateAndPersist({ ...notifications, paymentReminders: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Message Notifications</Label>
                <p className="text-xs text-gray-500">Messages from landlord</p>
              </div>
              <Switch
                checked={notifications.messageNotifications}
                onCheckedChange={(v) => updateAndPersist({ ...notifications, messageNotifications: v })}
              />
            </div>

            <Button onClick={() => { handleSaveNotifications(); }} disabled={saving}>
              {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        
      </div>
      
    </div>
  );
};

export default TenantSettings;


