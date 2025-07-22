import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Monthly Competition",
    date: "2024-01-20",
    time: "09:00",
    type: "competition",
    location: "Range 1",
    participants: 12
  },
  {
    id: 2,
    title: "Training Session",
    date: "2024-01-22",
    time: "18:00",
    type: "training",
    location: "Range 2",
    participants: 8
  },
  {
    id: 3,
    title: "Club Meeting",
    date: "2024-01-25",
    time: "19:00",
    type: "meeting",
    location: "Clubhouse",
    participants: 15
  },
  {
    id: 4,
    title: "Inter-club Match",
    date: "2024-01-28",
    time: "10:00",
    type: "competition",
    location: "Range 1 & 2",
    participants: 20
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "competition": return "default";
    case "training": return "secondary";
    case "meeting": return "outline";
    default: return "secondary";
  }
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Filter events for current month
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Club events, competitions, and training sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Navigation */}
        <Card className="lg:col-span-3 bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {currentMonth} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentMonthEvents.length > 0 ? (
              currentMonthEvents.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.participants} participants
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for {currentMonth}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Summary */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Competitions</span>
                <span className="text-sm font-medium">
                  {currentMonthEvents.filter(e => e.type === "competition").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Training Sessions</span>
                <span className="text-sm font-medium">
                  {currentMonthEvents.filter(e => e.type === "training").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Meetings</span>
                <span className="text-sm font-medium">
                  {currentMonthEvents.filter(e => e.type === "meeting").length}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Calendar is read-only. Contact administrators to add events.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}