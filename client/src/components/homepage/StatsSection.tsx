
import AnimatedCard from '@/components/ui/animated-card';

const StatsSection = () => {
  const stats = [
    { value: "2,400+", label: "Active Drivers", color: "text-dock-blue" },
    { value: "850+", label: "Verified Shippers", color: "text-dock-orange" },
    { value: "$4.2M", label: "Loads Moved", color: "text-green-600" },
    { value: "15min", label: "Avg Match Time", color: "text-purple-600" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trusted by Thousands
        </h2>
        <p className="text-lg text-gray-600">
          Join the fastest-growing freight network in America
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <AnimatedCard key={stat.label} className="text-center p-6" delay={index * 100}>
            <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium text-lg">
              {stat.label}
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
