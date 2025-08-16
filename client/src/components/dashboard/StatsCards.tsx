
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Clock, MapPin } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface StatsCardsProps {
  userType: 'shipper' | 'driver';
}

const StatsCards = ({ userType }: StatsCardsProps) => {
  const shipperStats: StatCard[] = [
    {
      title: "Active Loads",
      value: "2",
      subtitle: "1 urgent",
      icon: <Package className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "This Month",
      value: "$24,600",
      subtitle: "+12% from last month",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Completed",
      value: "18",
      subtitle: "This month",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Avg Match Time",
      value: "18min",
      subtitle: "Industry avg: 4hrs",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const driverStats: StatCard[] = [
    {
      title: "Available Loads",
      value: "3",
      subtitle: "Within 100 miles",
      icon: <MapPin className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "This Month",
      value: "$18,400",
      subtitle: "+8% from last month",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Loads Complete",
      value: "14",
      subtitle: "This month",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Rating",
      value: "4.9",
      subtitle: "Based on 47 reviews",
      icon: <div className="text-yellow-500">⭐</div>
    }
  ];

  const stats = userType === 'shipper' ? shipperStats : driverStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
