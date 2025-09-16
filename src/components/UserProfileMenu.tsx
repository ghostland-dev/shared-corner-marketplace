import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Heart, 
  MessageCircle, 
  Calendar, 
  FileText, 
  LogOut,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface UserProfileMenuProps {
  className?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ className }) => {
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className={className}>
          <User className="h-4 w-4 mr-2" />
          Connexion
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative ${className}`}>
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">
            {profile?.full_name || profile?.username || user.email?.split('@')[0]}
          </span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {profile?.full_name || profile?.username || 'Utilisateur'}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/tableau-de-bord" className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Tableau de bord
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/deposer-annonce" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Déposer une annonce
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/mes-annonces" className="cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Mes annonces
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/mes-reservations" className="cursor-pointer">
            <Calendar className="h-4 w-4 mr-2" />
            Mes réservations
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/messages" className="cursor-pointer relative">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/favoris" className="cursor-pointer">
            <Heart className="h-4 w-4 mr-2" />
            Favoris
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/parametres" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};