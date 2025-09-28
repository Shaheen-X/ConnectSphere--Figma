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
      age: 29,
      image: "https://i.pravatar.cc/150?img=33",
      location: "Stockholm, Stockholm County, SE",
      distance: "1.2 km"
    },
    activity: {
      type: "Running",
      title: "Morning Jog Buddy Needed",
      time: "Weekdays, 06:30 - 07:30",
      details: "Looking for someone to join my morning runs. I usually do 3-5 km at a moderate pace."
    }
  },
  {
    user: {
      name: "Mike Chen",
      age: 35,
      image: "https://i.pravatar.cc/150?img=12",
      location: "Hägersten, Stockholm County, SE",
      distance: "2.0 km"
    },
    activity: {
      type: "Gym",
      title: "Strength Training Partner",
      time: "Mon/Wed/Fri, 17:30 - 19:30",
      details: "Looking for a spotter and someone to push me during weight training. Intermediate level."
    }
  },
  {
    user: {
      name: "Emma Wilson",
      age: 27,
      image: "https://i.pravatar.cc/150?img=5",
      location: "Solna, Stockholm County, SE",
      distance: "3.1 km"
    },
    activity: {
      type: "Yoga",
      title: "Outdoor Yoga Sessions",
      time: "Weekends, 09:00 - 10:30",
      details: "Small group yoga by the lake. All levels welcome! Bring your mat."
    }
  },
  {
    user: {
      name: "David Rodriguez",
      age: 32,
      image: "https://i.pravatar.cc/150?img=67",
      location: "Södermalm, Stockholm County, SE",
      distance: "1.7 km"
    },
    activity: {
      type: "Cycling",
      title: "Weekend Cycling Group",
      time: "Saturdays, 07:00 - 10:00",
      details: "Moderate-paced 25-30 km ride with a coffee stop. No-drop policy."
    }
  },
  {
    user: {
      name: "Jennifer Lee",
      age: 31,
      image: "https://i.pravatar.cc/150?img=45",
      location: "Nacka, Stockholm County, SE",
      distance: "4.3 km"
    },
    activity: {
      type: "Hiking",
      title: "Sunrise Mountain Hikes",
      time: "Sundays, 05:30 - 09:30",
      details: "Early morning hikes to catch the sunrise. 5-7 km round trip with elevation."
    }
  },
  {
    user: {
      name: "Alex Thomas",
      age: 28,
      image: "https://i.pravatar.cc/150?img=68",
      location: "Vasastan, Stockholm County, SE",
      distance: "0.8 km"
    },
    activity: {
      type: "Basketball",
      title: "Pickup Basketball Games",
      time: "Tue & Thu, 18:00 - 20:00",
      details: "Regular pickup games at the community center. All skill levels welcome."
    }
  }
];

const groups = [
  {
    user: {
      name: "Weekend Runners Club",
      image: "https://images.unsplash.com/photo-1546484959-f9a53db89f9b?w=200&h=200&fit=crop&crop=faces",
      location: "Kungsholmen, Stockholm County, SE",
      distance: "1.7 km"
    },
    activity: {
      type: "Running",
      title: "Morning Jog Buddies",
      time: "Weekdays, 06:30 - 07:30",
      details: "Friendly 3-5 km runs at conversational pace. All levels welcome."
    }
  },
  {
    user: {
      name: "Park Yoga Collective",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&h=200&fit=crop&crop=faces",
      location: "Långholmen, Stockholm County, SE",
      distance: "2.5 km"
    },
    activity: {
      type: "Yoga",
      title: "Outdoor Yoga Sessions",
      time: "Weekends, 09:00 - 10:30",
      details: "Beginner-friendly yoga by the lake. Bring your mat and water."
    }
  },
  {
    user: {
      name: "City Cyclists",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22a4b0bb?w=200&h=200&fit=crop&crop=faces",
      location: "Norrmalm, Stockholm County, SE",
      distance: "1.3 km"
    },
    activity: {
      type: "Cycling",
      title: "Weekend Cycling Group",
      time: "Saturdays, 07:00 - 10:00",
      details: "25-30 km ride with coffee stop. No-drop policy."
    }
  },
  {
    user: {
      name: "Community Hoopers",
      image: "https://images.unsplash.com/photo-1521417531059-74247bdfb7a9?w=200&h=200&fit=crop&crop=faces",
      location: "Östermalm, Stockholm County, SE",
      distance: "0.8 km"
    },
    activity: {
      type: "Basketball",
      title: "Pickup Basketball Games",
      time: "Tue & Thu, 18:00 - 20:00",
      details: "Casual 3v3 and 5v5 runs. All skill levels welcome."
    }
  }
];

const places = [
  {
    user: {
      name: "Badmintonstadion",
      image: "https://images.unsplash.com/photo-1543746918-1bfd70c2d2b8?q=80&w=800",
      location: "Hammarby Slussväg 4, 116 41 Stockholm SE",
      distance: "2.0 km"
    },
    activity: {
      type: "Badminton",
      title: "Indoor Courts",
      address: "Hammarby Slussväg 4, 116 41 Stockholm SE",
      openingHours: "Daily 06:00 - 23:00",
      rating: 4,
      action: 'book'
    }
  },
  {
    user: {
      name: "Nordic Fitness Club",
      image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=800",
      location: "Sveavägen 12, 111 57 Stockholm SE",
      distance: "1.1 km"
    },
    activity: {
      type: "Gym",
      title: "Premium Fitness Center",
      address: "Sveavägen 12, 111 57 Stockholm SE",
      openingHours: "Mon-Fri 06:00 - 22:00",
      rating: 5,
      action: 'membership'
    }
  },
  {
    user: {
      name: "Riverside Basketball Courts",
      image: "https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=800",
      location: "Riverside Park, 112 20 Stockholm SE",
      distance: "1.2 km"
    },
    activity: {
      type: "Basketball",
      title: "Outdoor Courts",
      address: "Riverside Park, 112 20 Stockholm SE",
      openingHours: "Dawn to Dusk",
      rating: 3,
      action: 'reserve'
    }
  },
  {
    user: {
      name: "City Marathon Expo",
      image: "https://images.unsplash.com/photo-1530137073521-28ee92e8dc3c?q=80&w=800",
      location: "Sergels Torg, 111 57 Stockholm SE",
      distance: "Downtown"
    },
    activity: {
      type: "Running",
      title: "Race Pack Pickup",
      address: "Sergels Torg, 111 57 Stockholm SE",
      openingHours: "Oct 10, 07:00 start",
      rating: 5,
      action: 'reserve'
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
