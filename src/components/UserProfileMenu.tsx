
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Settings, User, LogOut, PlusCircle, Heart, Package, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const UserProfileMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => navigate('/auth')}>
          Se connecter
        </Button>
        <Button className="kiwiiz-btn-primary" onClick={() => navigate('/auth?tab=signup')}>
          S'inscrire
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative p-1" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-kiwiiz-primary text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Contenu des notifications */}
          <div className="text-center py-4 text-sm text-gray-500">
            Aucune nouvelle notification
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative p-0" aria-label="Mon profil">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
              <p className="text-xs leading-none text-gray-500">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/profil')}>
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/deposer-annonce')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Déposer une annonce</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/mes-annonces')}>
              <Package className="mr-2 h-4 w-4" />
              <span>Mes annonces</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/favoris')}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Mes favoris</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/messages')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Messages</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/parametres')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
