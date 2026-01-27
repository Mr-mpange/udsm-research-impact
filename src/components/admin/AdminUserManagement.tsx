import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Shield, 
  Mail, 
  Building2, 
  BookOpen,
  MoreHorizontal,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserWithRoles extends Profile {
  roles: AppRole[];
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch users'
      });
      setIsLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
      ...profile,
      roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role as AppRole) || []
    }));

    setUsers(usersWithRoles);
    setIsLoading(false);
  }

  async function assignRole(userId: string, role: AppRole) {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      if (error.code === '23505') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'User already has this role'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to assign role'
        });
      }
      return;
    }

    toast({
      title: 'Success',
      description: `Role "${role}" assigned successfully`
    });
    fetchUsers();
  }

  async function removeRole(userId: string, role: AppRole) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove role'
      });
      return;
    }

    toast({
      title: 'Success',
      description: `Role "${role}" removed successfully`
    });
    fetchUsers();
  }

  const filteredUsers = users.filter(user => 
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors: Record<AppRole, string> = {
    admin: 'bg-destructive/20 text-destructive border-destructive/30',
    moderator: 'bg-secondary/20 text-secondary border-secondary/30',
    researcher: 'bg-primary/20 text-primary border-primary/30',
    user: 'bg-muted text-muted-foreground border-muted'
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Publications</TableHead>
              <TableHead>H-Index</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.display_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {user.department || 'Not set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      {user.total_publications || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {user.h_index || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className={`text-xs ${roleColors[role]}`}
                        >
                          {role}
                        </Badge>
                      ))}
                      {user.roles.length === 0 && (
                        <span className="text-xs text-muted-foreground">No roles</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!user.roles.includes('admin') && (
                          <DropdownMenuItem onClick={() => assignRole(user.user_id, 'admin')}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {!user.roles.includes('moderator') && (
                          <DropdownMenuItem onClick={() => assignRole(user.user_id, 'moderator')}>
                            <Shield className="w-4 h-4 mr-2" />
                            Make Moderator
                          </DropdownMenuItem>
                        )}
                        {user.roles.includes('admin') && (
                          <DropdownMenuItem 
                            onClick={() => removeRole(user.user_id, 'admin')}
                            className="text-destructive"
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Remove Admin
                          </DropdownMenuItem>
                        )}
                        {user.roles.includes('moderator') && (
                          <DropdownMenuItem 
                            onClick={() => removeRole(user.user_id, 'moderator')}
                            className="text-destructive"
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Remove Moderator
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
