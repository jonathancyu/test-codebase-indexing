import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Search, Mail, Lock, User } from 'lucide-react';

export function InputReference() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [successValue, setSuccessValue] = useState('Valid input');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Components</CardTitle>
        <CardDescription>Various input field types, states, and interactive examples with validation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Input Types */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Basic Input Types</h3>
            <Badge variant="outline">Interactive</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Text Input</label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email Input</label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password Input</label>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={passwordValue}
                  onChange={e => setPasswordValue(e.target.value)}
                  className="pl-8 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Input States */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Input States</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Error State</label>
              <Input
                placeholder="This input has an error"
                value={errorValue}
                onChange={e => setErrorValue(e.target.value)}
              />
              <p className="text-xs text-destructive">This field is required</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Success State</label>
              <Input
                placeholder="This input is valid"
                value={successValue}
                onChange={e => setSuccessValue(e.target.value)}
              />
              <p className="text-xs text-green-600">Input is valid</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Disabled State</label>
              <Input disabled placeholder="This input is disabled" value="Cannot edit this" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Search Input</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="pl-8"
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setSearchValue('')}
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
