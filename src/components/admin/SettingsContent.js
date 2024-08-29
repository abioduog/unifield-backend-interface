'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Settings, Link, AlertTriangle, Check, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data
const userRoles = [
  { id: 1, name: 'Admin', description: 'Full system access', permissions: ['all'] },
  { id: 2, name: 'Manager', description: 'Manage retailers and field agents', permissions: ['manage_retailers', 'manage_field_agents', 'view_reports'] },
  { id: 3, name: 'Field Agent', description: 'Manage assigned retailers', permissions: ['view_retailers', 'update_retailer_info'] },
  { id: 4, name: 'Finance', description: 'Manage financial operations', permissions: ['view_finances', 'manage_payments', 'generate_invoices'] },
];

const userActivityLogs = [
  { id: 1, user: 'john@example.com', action: 'Login', timestamp: '2023-08-18 14:30:00', ipAddress: '192.168.1.1' },
  { id: 2, name: 'jane@example.com', action: 'Updated retailer #1234', timestamp: '2023-08-18 13:45:00', ipAddress: '192.168.1.2' },
  { id: 3, name: 'admin@unifield.com', action: 'Changed system settings', timestamp: '2023-08-18 12:15:00', ipAddress: '192.168.1.3' },
  { id: 4, name: 'fieldagent1@unifield.com', action: 'Added new retailer', timestamp: '2023-08-18 11:30:00', ipAddress: '192.168.1.4' },
];

const integrations = [
  { id: 1, name: 'PayPal', type: 'payment', status: 'active', apiKey: 'pk_test_123456' },
  { id: 2, name: 'Stripe', type: 'payment', status: 'inactive', apiKey: '' },
  { id: 3, name: 'DHL', type: 'logistics', status: 'active', apiKey: 'dhl_api_789012' },
  { id: 4, name: 'FedEx', type: 'logistics', status: 'inactive', apiKey: '' },
];

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState("user-management");
  const [roles, setRoles] = useState(userRoles);
  const [activityLogs, setActivityLogs] = useState(userActivityLogs);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [integrationList, setIntegrationList] = useState(integrations);

  // User & Access Management Functions
  const addRole = (newRole) => {
    setRoles([...roles, { id: roles.length + 1, ...newRole }]);
  };

  const updateRole = (id, updatedRole) => {
    setRoles(roles.map(role => role.id === id ? { ...role, ...updatedRole } : role));
  };

  const deleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  // System Configuration Functions
  const updateSystemSetting = (setting, value) => {
    setSystemSettings({ ...systemSettings, [setting]: value });
  };

  // Integration Management Functions
  const updateIntegration = (id, updates) => {
    setIntegrationList(integrationList.map(integration => 
      integration.id === id ? { ...integration, ...updates } : integration
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-management">
            <Users className="mr-2 h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="system-config">
            <Settings className="mr-2 h-4 w-4" />
            System Configuration
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User & Access Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Role-based Access Control</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.permissions.join(', ')}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => {/* Open edit dialog */}}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteRole(role.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button className="mt-4" onClick={() => {/* Open add role dialog */}}>Add New Role</Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">User Activity Logs</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button className="mt-4">View Full Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-config">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage global settings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Platform Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <Switch 
                        id="maintenance-mode" 
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => updateSystemSetting('maintenanceMode', checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="session-timeout" 
                        type="number" 
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => updateSystemSetting('sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch 
                        id="email-notifications" 
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => updateSystemSetting('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch 
                        id="sms-notifications" 
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => updateSystemSetting('smsNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Management</CardTitle>
              <CardDescription>Manage third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['payment', 'logistics'].map((type) => (
                  <div key={type}>
                    <h3 className="text-lg font-semibold mb-2 capitalize">{type} Providers</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>API Key</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {integrationList.filter(i => i.type === type).map((integration) => (
                          <TableRow key={integration.id}>
                            <TableCell>{integration.name}</TableCell>
                            <TableCell>
                              <Badge variant={integration.status === 'active' ? 'success' : 'secondary'}>
                                {integration.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {integration.apiKey ? `${integration.apiKey.slice(0, 8)}...` : 'Not set'}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {/* Open configuration dialog */}}
                              >
                                Configure
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;