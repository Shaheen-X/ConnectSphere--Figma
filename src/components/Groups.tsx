import { useState } from 'react';
import { Plus, Users, MessageCircle, Settings, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface Group {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
  unreadMessages: number;
  role: 'member' | 'admin' | 'owner' | null;
}

const mockGroups: Group[] = [
  {
    id: 1,
    name: "SF Hiking Enthusiasts",
    description: "Weekly hiking adventures around the Bay Area. All levels welcome!",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=400&h=300&fit=crop",
    memberCount: 234,
    isPrivate: false,
    lastActivity: "2 hours ago",
    unreadMessages: 3,
    role: "member"
  },
  {
    id: 2,
    name: "Creative Minds Collective",
    description: "Artists, designers, and creative professionals sharing ideas and collaborating.",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?w=400&h=300&fit=crop",
    memberCount: 89,
    isPrivate: false,
    lastActivity: "1 day ago",
    unreadMessages: 0,
    role: "admin"
  },
  {
    id: 3,
    name: "Morning Yoga Circle",
    description: "Start your day right with mindful yoga sessions and meditation.",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1561579890-3ace74d8e378?w=400&h=300&fit=crop",
    memberCount: 156,
    isPrivate: true,
    lastActivity: "3 hours ago",
    unreadMessages: 7,
    role: "member"
  },
  {
    id: 4,
    name: "Tech Networking Hub",
    description: "Connect with fellow tech professionals, share opportunities, and grow together.",
    category: "Professional",
    image: "https://images.unsplash.com/photo-1672094272561-3d4e3685a3fa?w=400&h=300&fit=crop",
    memberCount: 412,
    isPrivate: false,
    lastActivity: "5 minutes ago",
    unreadMessages: 12,
    role: "owner"
  }
];

const discoverGroups: Group[] = [
  {
    id: 5,
    name: "Photography Walks",
    description: "Explore the city through your camera lens with fellow photographers.",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=400&h=300&fit=crop",
    memberCount: 78,
    isPrivate: false,
    lastActivity: "1 hour ago",
    unreadMessages: 0,
    role: null
  },
  {
    id: 6,
    name: "Cooking Adventures",
    description: "Food lovers unite! Share recipes, cooking tips, and organize group cooking sessions.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    memberCount: 203,
    isPrivate: false,
    lastActivity: "30 minutes ago",
    unreadMessages: 0,
    role: null
  }
];

export function Groups() {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = (activeTab === 'my-groups' ? mockGroups : discoverGroups).filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-blue-100 text-blue-700';
      case 'member': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#D4C4A8] p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[0.75rem] font-normal text-[#5C5C5C]">
            Groups
          </h1>
          <Button size="icon" className="w-[28px] h-[28px] rounded-lg bg-white border border-[#D4C4A8] text-[#D4C4A8]" style={{ boxShadow: '0.5px 0.5px 1px #5C5C5C' }}>
            <Plus size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4C4A8]" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border border-[#D4C4A8] rounded-lg"
            style={{ fontSize: '0.5rem' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-white border border-[#D4C4A8] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-50 ${
              activeTab === 'my-groups'
                ? 'bg-[#D4C4A8] text-white'
                : 'text-[#D4C4A8] hover:text-[#5C5C5C]'
            }`}
            style={{ fontSize: '0.5rem' }}
          >
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-50 ${
              activeTab === 'discover'
                ? 'bg-[#D4C4A8] text-white'
                : 'text-[#D4C4A8] hover:text-[#5C5C5C]'
            }`}
            style={{ fontSize: '0.5rem' }}
          >
            Discover
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div 
              key={group.id}
              className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <div className="flex">
                {/* Image */}
                <div className="w-20 h-20 relative">
                  <ImageWithFallback
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  {group.isPrivate && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{group.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {group.category}
                        </Badge>
                        {group.role && (
                          <Badge className={`text-xs ${getRoleColor(group.role)}`}>
                            {group.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {group.unreadMessages > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {group.unreadMessages}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{group.memberCount} members</span>
                      </div>
                      <span>Active {group.lastActivity}</span>
                    </div>

                    <div className="flex space-x-2">
                      {activeTab === 'my-groups' ? (
                        <>
                          <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                            <MessageCircle size={12} className="mr-1" />
                            Chat
                          </Button>
                          {(group.role === 'admin' || group.role === 'owner') && (
                            <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                              <Settings size={12} />
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-xs px-3 py-1">
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {activeTab === 'my-groups' ? 'No groups joined yet' : 'No groups found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'my-groups' 
                ? 'Discover groups that match your interests!' 
                : 'Try adjusting your search or create a new group.'
              }
            </p>
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white">
              <Plus size={16} className="mr-2" />
              {activeTab === 'my-groups' ? 'Discover Groups' : 'Create Group'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}