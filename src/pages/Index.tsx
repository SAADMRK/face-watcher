import { useState } from "react";
import { Users, UserCheck, UserX, Activity } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { DetectionsTable } from "@/components/dashboard/DetectionsTable";
import { useDetections } from "@/hooks/useDetections";

const Index = () => {
  const [filters, setFilters] = useState({
    search: "",
    camera: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const { detections, cameras, stats, isLoading, identifyPerson } = useDetections(filters);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        <Header />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total détections"
            value={stats.total}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Personnes identifiées"
            value={stats.identified}
            icon={UserCheck}
            variant="success"
          />
          <StatsCard
            title="Personnes inconnues"
            value={stats.unknown}
            icon={UserX}
            variant="warning"
          />
          <StatsCard
            title="Détections aujourd'hui"
            value={stats.todayCount}
            icon={Activity}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FiltersBar cameras={cameras} onFiltersChange={setFilters} />
        </div>

        {/* Detections Table */}
        <DetectionsTable
          detections={detections}
          onIdentify={(id, name) => identifyPerson({ id, name })}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
