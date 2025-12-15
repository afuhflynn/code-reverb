"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Play, BarChart3, History, Download } from "lucide-react";

export function PersonaEditor() {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Persona Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="e.g., Code Quality Expert"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Specialty</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="code-quality">Code Quality</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="accessibility">
                        Accessibility
                      </SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what this persona specializes in..."
                    className="mt-1 min-h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <Input
                    placeholder="e.g., react, typescript, hooks"
                    className="mt-1"
                  />
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary">react</Badge>
                    <Badge variant="secondary">typescript</Badge>
                    <Badge variant="secondary">hooks</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">System Prompt</label>
                  <Textarea
                    placeholder="You are a senior software engineer..."
                    className="mt-1 min-h-64 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Validate Prompt
                  </Button>
                  <Button size="sm" variant="outline">
                    Optimize Prompt
                  </Button>
                  <Button size="sm">Save Changes</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Snippet Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      React Component with Hooks
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Python API with Error Handling
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Security Vulnerability Example
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Performance Bottleneck Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Documentation Example
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      placeholder="Or paste your own code..."
                      className="min-h-32"
                    />
                  </div>
                  <Button className="w-full mt-4">
                    <Play className="h-4 w-4 mr-2" />
                    Run Test
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-64 p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      Click "Run Test" to see the AI response here...
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Rate Response
                    </Button>
                    <Button variant="outline" size="sm">
                      Save as Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">8.7/10</div>
                  <p className="text-sm text-muted-foreground">Clarity Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">9.2/10</div>
                  <p className="text-sm text-muted-foreground">
                    Consistency Score
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">7.8/10</div>
                  <p className="text-sm text-muted-foreground">
                    Efficiency Score
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">8.9/10</div>
                  <p className="text-sm text-muted-foreground">
                    Adaptability Score
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 Consider adding more specific examples for better
                      context understanding
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-900">
                      💡 This prompt can be 23% more token-efficient
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-900">
                      💡 Add error handling examples for better robustness
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">v2.1.3 (current)</p>
                      <p className="text-sm text-muted-foreground">
                        Improved security prompts
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">v2.1.2</p>
                      <p className="text-sm text-muted-foreground">
                        Added performance examples
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      1 day ago
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">v2.1.1</p>
                      <p className="text-sm text-muted-foreground">
                        Fixed token efficiency
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      3 days ago
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Create Branch
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare Versions
                  </Button>
                  <Button variant="outline" size="sm">
                    Revert to Version
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Persona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Format</label>
                  <Select defaultValue="json">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Include Options</label>
                  <div className="space-y-2 mt-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-sm">Prompt & Configuration</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-sm">Performance History</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Test Results</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Version History</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Sharing</label>
                  <Select defaultValue="private">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Persona
                  </Button>
                  <Button variant="outline">Copy to Clipboard</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
