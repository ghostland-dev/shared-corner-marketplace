
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  link: string;
}

const CategoryCard = ({ name, icon: Icon, color, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="block">
      <div className="kiwiiz-card p-6 flex flex-col items-center text-center">
        <div 
          className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${color}`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-medium">{name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
