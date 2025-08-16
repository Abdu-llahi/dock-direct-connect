
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${className}`}>
      <Truck className="h-8 w-8 text-blue-700" />
      {showText && (
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
          DockDirect
        </span>
      )}
    </Link>
  );
};

export default Logo;
