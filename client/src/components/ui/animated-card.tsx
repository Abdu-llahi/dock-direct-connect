
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

const AnimatedCard = ({ 
  children, 
  className, 
  hoverEffect = true, 
  delay = 0 
}: AnimatedCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 ease-out",
        hoverEffect && "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        "animate-in fade-in-0 slide-in-from-bottom-4",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
