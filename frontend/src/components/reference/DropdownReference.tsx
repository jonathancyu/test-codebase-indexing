import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Search } from 'lucide-react';

export function DropdownReference() {
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [_, setSelectedSkill] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Java', 'C++', 'Go', 'Rust'];

  const filteredSkills = skills.filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill);
    setSearchQuery(skill);
    setIsSearchOpen(false);
    toast.info(`Selected skill: ${skill}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Components</CardTitle>
        <CardDescription>
          Three types of dropdown components: regular select, searchable combobox, and disabled state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Regular Select */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Regular Select</h3>
            <Badge variant="outline">Interactive</Badge>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">User Role</label>
            <div className="relative">
              <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="pl-8 w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Searchable Combobox */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Searchable Combobox</h3>
            <Badge variant="secondary">Searchable</Badge>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Programming Skills</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-8 w-full"
              />
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => (
                      <button
                        key={skill}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => handleSkillSelect(skill)}
                      >
                        {skill}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No skills found</div>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Type to search and filter options</p>
          </div>
        </div>

        {/* Click outside handler */}
        {isSearchOpen && <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />}
      </CardContent>
    </Card>
  );
}
