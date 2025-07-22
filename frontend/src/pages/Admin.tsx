import { useState } from "react";
import { Upload, Calendar, Users, Database, FileSpreadsheet, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { uploadCsvFiles } from "@/lib/api";

interface UploadResult {
  filename: string;
  status: string;
  detail?: string;
}

export default function Admin() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [expandedErrorIdx, setExpandedErrorIdx] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    try {
      // Only accept .csv files
      const csvFiles = Array.from(files).filter(f => f.name.endsWith('.csv'));
      if (csvFiles.length === 0) {
        toast({ title: "Error", description: "Please select CSV files only", variant: "destructive" });
        setIsUploading(false);
        return;
      }
      // Upload to backend
      const result = await uploadCsvFiles(files);
      setUploadResults(result.results || []);
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${csvFiles.length} CSV file(s)`,
      });
    } catch (err: unknown) {
      let message = "Failed to upload CSV files";
      if (err instanceof Error) message = err.message;
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const handleAddCalendarEvent = () => {
    toast({
      title: "Event Added",
      description: "Calendar event has been added successfully",
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage club data, uploads, and calendar events</p>
        </div>
        <Badge variant="default" className="bg-primary text-primary-foreground">
          Administrator
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Upload Section */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Historical Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload CSV files from electronic targets. The system will parse and insert the data into the database.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="csv-upload">Select CSV Files</Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadResults.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Upload Results</h4>
                  <Button variant="outline" size="sm" onClick={() => setUploadResults([])}>
                    Clear Results
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  {uploadResults.map((res, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-2 bg-muted/50 rounded">
                      <div className="flex justify-between items-center">
                        <span>{res.filename}</span>
                        <Badge variant={res.status === 'success' ? 'secondary' : 'destructive'} className="text-xs">
                          {res.status === 'success' ? 'Processed' : 'Error'}
                        </Badge>
                      </div>
                      {res.detail && (
                        <div className="relative">
                          <div
                            className={
                              expandedErrorIdx === idx
                                ? "text-xs text-red-500 whitespace-pre-wrap"
                                : "text-xs text-red-500 whitespace-pre-wrap max-h-16 overflow-hidden"
                            }
                          >
                            {res.detail}
                          </div>
                          {res.detail.length > 120 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-xs mt-1"
                              onClick={() => setExpandedErrorIdx(expandedErrorIdx === idx ? null : idx)}
                            >
                              {expandedErrorIdx === idx ? "Show Less" : "Show More"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Uploads</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>scores_2024_01_15.csv</span>
                  <Badge variant="secondary" className="text-xs">Processed</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>practice_data_jan.csv</span>
                  <Badge variant="secondary" className="text-xs">Processed</Badge>
                </div>
              </div>
            </div>

            <Button className="w-full" disabled={isUploading}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        {/* Calendar Management */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add competitions, training sessions, and club events to the calendar.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input id="event-title" placeholder="Monthly Competition" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input id="event-date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input id="event-time" type="time" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea 
                  id="event-description" 
                  placeholder="Enter event details..."
                  rows={3}
                />
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:shadow-golden transition-all duration-300"
                onClick={handleAddCalendarEvent}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage club members, roles, and permissions.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Members</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Sarah Johnson (#12346)</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Mike Chen (#12347)</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/users'}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage All Users
            </Button>
          </CardContent>
        </Card>

        {/* Database Stats */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">1,247</div>
                <div className="text-xs text-muted-foreground">Total Scores</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">23</div>
                <div className="text-xs text-muted-foreground">Active Members</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-xs text-muted-foreground">Competitions</div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Database Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}