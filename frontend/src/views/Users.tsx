import { useState, useEffect } from 'react';
import { useApi } from '@/lib/use-api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role?: string;
  last_login?: string;
}

interface UserFormData {
  name: string;
  email: string;
}

export function Users() {
  const api = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  // Check if API is available and user is authenticated
  const isReady = api && api.isAuthenticated;

  // Fetch users from API
  const fetchUsers = async () => {
    if (!isReady || !api.callApi) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.callApi('GET', '/api/v1/users');
      setUsers(response);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async () => {
    if (!isReady || !api.callApi) {
      toast.error('Authentication required');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.callApi('POST', '/api/v1/users?' + new URLSearchParams({
        name: formData.name.trim(),
        email: formData.email.trim()
      }).toString(), null);

      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Update user
  const updateUser = async () => {
    if (!isReady || !api.callApi) {
      toast.error('Authentication required');
      return;
    }

    if (!selectedUser || !formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.callApi('PUT', `/api/v1/users/${selectedUser.id}?` + new URLSearchParams({
        name: formData.name.trim(),
        email: formData.email.trim()
      }).toString(), null);

      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Delete user
  const deleteUser = async () => {
    if (!isReady || !api.callApi) {
      toast.error('Authentication required');
      return;
    }

    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await api.callApi('DELETE', `/api/v1/users/${selectedUser.id}`);
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (isReady) {
      fetchUsers();
    }
  }, [isReady]);

  // Show loading state while authentication is being determined
  if (!api) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading...
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required message
  if (!api.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the user management system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users in your system. Create, update, and delete user accounts.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading users...
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found. Create your first user to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{user.last_login ? formatDate(user.last_login) : 'Never'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="create-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="create-name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="create-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="create-email"
                type="email"
                placeholder="Enter user's email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ name: '', email: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={createUser} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information. Make your changes below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter user's email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
                setFormData({ name: '', email: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateUser} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="text-sm text-muted-foreground">
                  Created: {formatDate(selectedUser.created_at)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUser}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}