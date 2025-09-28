import React, { useState } from "react";
import Navbar from "./Navbar";
import ActivityCard from "./ActivityCard";
import ActivityFilter from "./ActivityFilter";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search as SearchIcon, Filter, Users, MapPin } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./ui/pagination";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./ui/tabs";

const activities = [
  {
    user: {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?img=33",
      location: "Central Park, New York, NY",
      distance: "0.8 miles away",
      age: 28,
      city: "New York",
      county: "Manhattan",
      countryCode: "US"
    },
    activity: {
      type: "Running",
      title: "Morning Jog Buddy Needed",
      time: "Weekdays, 6:30 AM - 7:30 AM",
      details: "Looking for someone to join my morning runs. I usually do 3-5 miles at a moderate pace. Great way to start the day!"
    }
  },
  {
    user: {
      name: "Mike Chen",
      image: "https://i.pravatar.cc/150?img=12",
      location: "24/7 Fitness, San Jose, CA",
      distance: "1.2 miles away",
      age: 31,
      city: "San Jose",
      county: "Santa Clara",
      countryCode: "US"
    },
    activity: {
      type: "Gym Workout",
      title: "Strength Training Partner",
      time: "Mon/Wed/Fri, 5:30 PM - 7:00 PM",
      details: "Looking for a spotter and someone to push me during weight training. Intermediate level, focusing on progressive overload."
    }
  },
  {
    user: {
      name: "Emma Wilson",
      image: "https://i.pravatar.cc/150?img=5",
      location: "Lakeside Park, Oakland, CA",
      distance: "2.5 miles away",
      age: 26,
      city: "Oakland",
      county: "Alameda",
      countryCode: "US"
    },
    activity: {
      type: "Yoga",
      title: "Outdoor Yoga Sessions",
      time: "Weekends, 9:00 AM - 10:30 AM",
      details: "I organize small group yoga sessions by the lake. All levels welcome! Bring your own mat and enjoy nature while improving flexibility."
    }
  },
  {
    user: {
      name: "David Rodriguez",
      image: "https://i.pravatar.cc/150?img=67",
      location: "City Trails, Austin, TX",
      distance: "1.7 miles away",
      age: 34,
      city: "Austin",
      county: "Travis",
      countryCode: "US"
    },
    activity: {
      type: "Cycling",
      title: "Weekend Cycling Group",
      time: "Saturdays, 7:00 AM - 10:00 AM",
      details: "Moderate-paced group ride covering 25-30 miles. We make stops for coffee and always wait for everyone. Road bikes recommended."
    }
  },
  {
    user: {
      name: "Jennifer Lee",
      image: "https://i.pravatar.cc/150?img=45",
      location: "Shoreline Trail, Mountain View, CA",
      distance: "3.9 miles away",
      age: 29,
      city: "Mountain View",
      county: "Santa Clara",
      countryCode: "US"
    },
    activity: {
      type: "Hiking",
      title: "Sunrise Mountain Hikes",
      time: "Sundays, 5:30 AM - 9:30 AM",
      details: "Early morning hikes to catch the sunrise from mountain peaks. Moderate difficulty, about 5-7 miles round trip with elevation gain."
    }
  },
  {
    user: {
      name: "Alex Thomas",
      image: "https://i.pravatar.cc/150?img=68",
      location: "Community Center, Palo Alto, CA",
      distance: "0.5 miles away",
      age: 27,
      city: "Palo Alto",
      county: "Santa Clara",
      countryCode: "US"
    },
    activity: {
      type: "Basketball",
      title: "Pickup Basketball Games",
      time: "Tuesdays & Thursdays, 6:00 PM - 8:00 PM",
      details: "Regular pickup games at the community center. All skill levels welcome. We usually play 3v3 or 5v5 depending on turnout."
    }
  }
];

const groups = [
  {
    user: {
      name: "Weekend Runners Club",
      image: "https://images.unsplash.com/photo-1546484959-f9a53db89f9b?w=200&h=200&fit=crop&crop=faces",
      location: "City Trails",
      distance: "1.7 miles away"
    },
    activity: {
      type: "Group Activity",
      title: "Morning Jog Buddy Needed",
      time: "Weekdays, 6:30 AM - 7:30 AM",
      details: "Looking for friendly runners to join 3-5 mile morning runs at a conversational pace. All levels welcome."
    }
  },
  {
    user: {
      name: "Park Yoga Collective",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&h=200&fit=crop&crop=faces",
      location: "Lakeside Park",
      distance: "2.5 miles away"
    },
    activity: {
      type: "Group Activity",
      title: "Outdoor Yoga Sessions",
      time: "Weekends, 9:00 AM - 10:30 AM",
      details: "Relaxed, beginner-friendly yoga by the lake. Bring your mat and water. Group size 6-10."
    }
  },
  {
    user: {
      name: "City Cyclists",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22a4b0bb?w=200&h=200&fit=crop&crop=faces",
      location: "Downtown Plaza",
      distance: "1.3 miles away"
    },
    activity: {
      type: "Group Activity",
      title: "Weekend Cycling Group",
      time: "Saturdays, 7:00 AM - 10:00 AM",
      details: "Moderate-paced 25-30 mile ride with coffee stop. Road bikes recommended. No-drop policy."
    }
  },
  {
    user: {
      name: "Community Hoopers",
      image: "https://images.unsplash.com/photo-1521417531059-74247bdfb7a9?w=200&h=200&fit=crop&crop=faces",
      location: "Community Center",
      distance: "0.5 miles away"
    },
    activity: {
      type: "Group Activity",
      title: "Pickup Basketball Games",
      time: "Tues & Thurs, 6:00 PM - 8:00 PM",
      details: "Casual 3v3 and 5v5 runs. All skill levels welcome. Bring a light and dark shirt."
    }
  }
];

const places = [
  {
    user: {
      name: "Central Park Running Track",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=200",
      location: "Central Park",
      distance: "0.8 miles away"
    },
    activity: {
      type: "Running Track",
      title: "Public Running Area",
      time: "Open daily, 6:00 AM - 10:00 PM",
      details: "400m rubberized track with water fountains and restrooms nearby. Well-lit for evening runs."
    }
  },
  {
    user: {
      name: "Downtown Fitness Expo",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200",
      location: "Convention Center",
      distance: "2.3 miles away"
    },
    activity: {
      type: "Fitness Event",
      title: "Annual Fitness & Health Expo",
      time: "May 15-17, 9:00 AM - 6:00 PM",
      details: "Over 100 vendors, fitness workshops, and demonstrations. Tickets $15 online, $20 at the door."
    }
  },
  {
    user: {
      name: "Community Basketball Courts",
      image: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=200",
      location: "Riverside Park",
      distance: "1.2 miles away"
    },
    activity: {
      type: "Basketball Courts",
      title: "Public Outdoor Courts",
      time: "Open daily, dawn to dusk",
      details: "Four full courts with new backboards and nets. Regular pickup games on weekends."
    }
  },
  {
    user: {
      name: "City Marathon",
      image: "https://images.unsplash.com/photo-1530137073521-28ee92e8dc3c?q=80&w=200",
      location: "City Center",
      distance: "Downtown Area"
    },
    activity: {
      type: "Running Event",
      title: "Annual City Marathon",
      time: "October 10, 7:00 AM start",
      details: "Full marathon, half marathon, and 5K options. Flat, fast course through scenic downtown areas. Registration required."
    }
  }
];

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("partners");
  const [filteredPartners, setFilteredPartners] = useState(activities);
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 4 : 8;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filteredPartnersList = activities.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();
      
      return searchText.includes(term.toLowerCase());
    });
    setFilteredPartners(filteredPartnersList);
    
    const filteredGroupsList = groups.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();

      return searchText.includes(term.toLowerCase());
    });
    setFilteredGroups(filteredGroupsList);
    
    const filteredPlacesList = places.filter(item => {
      const activityText = `${item.activity.type} ${item.activity.title} ${item.activity.details}`;
      const userText = `${item.user.name} ${item.user.location}`;
      const searchText = (activityText + userText).toLowerCase();
      
      return searchText.includes(term.toLowerCase());
    });
    setFilteredPlaces(filteredPlacesList);
    
    setCurrentPage(1);
  };

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    if (activeTab === "partners") {
      return filteredPartners.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === "groups") {
      return filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
    } else {
      return filteredPlaces.slice(indexOfFirstItem, indexOfLastItem);
    }
  };

  const getTotalPages = () => {
    if (activeTab === "partners") {
      return Math.ceil(filteredPartners.length / itemsPerPage);
    } else if (activeTab === "groups") {
      return Math.ceil(filteredGroups.length / itemsPerPage);
    } else {
      return Math.ceil(filteredPlaces.length / itemsPerPage);
    }
  };

  const currentItems = getCurrentItems();
  const totalPages = getTotalPages();

  const getPlaceholderText = () => {
    if (activeTab === "partners") {
      return "Search workout partners...";
    } else if (activeTab === "groups") {
      return "Search group activities...";
    } else {
      return "Search places, events...";
    }
  };

  const MobileFilters = () => {
    return isMobile ? (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-2">
            <Filter className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="pb-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription id="sheet-description">
              Customize your search by setting distance, activity type, time preferences, and skill level.
            </SheetDescription>
          </SheetHeader>
          <ActivityFilter className="border-0 shadow-none p-0" />
        </SheetContent>
      </Sheet>
    ) : null;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-section-header gradient-text mb-6">Find Your Fitness Match</h1>
        
        <Tabs defaultValue="partners" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-3 mb-4 glass-card border-white/20 rounded-xl">
            <TabsTrigger
              value="partners"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Workout Partners</span>
              <span className="inline md:hidden">Partners</span>
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Groups</span>
              <span className="inline md:hidden">Groups</span>
            </TabsTrigger>
            <TabsTrigger
              value="places"
              className="flex items-center gap-1.5 text-subtext data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white rounded-xl text-tag"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Places & Events</span>
              <span className="inline md:hidden">Places</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder={getPlaceholderText()}
                className="pl-10 h-10 bg-input-background border border-white/20 rounded-xl backdrop-blur-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <MobileFilters />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {!isMobile && (
              <div className="lg:col-span-1 hidden lg:block">
                <ActivityFilter />
              </div>
            )}
            
            <div className="lg:col-span-3">
              {currentItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {currentItems.map((item, index) => (
                      <ActivityCard 
                        key={index} 
                        user={item.user}
                        activity={item.activity}
                        cardType={activeTab === 'partners' ? 'partner' :
                                 activeTab === 'groups' ? 'group' : 'place'}
                      />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-6">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i} className={isMobile && totalPages > 3 && ![0, totalPages - 1, currentPage - 1].includes(i) ? "hidden" : undefined}>
                            <PaginationLink 
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="glass-card p-6 text-center">
                  <h3 className="font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Search;
