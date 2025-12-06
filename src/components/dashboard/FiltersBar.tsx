import { useState } from "react";
import { Search, Calendar, Camera, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Camera {
  id: string;
  name: string;
  location: string | null;
}

interface FiltersBarProps {
  cameras: Camera[];
  onFiltersChange: (filters: {
    search: string;
    camera: string;
    status: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export function FiltersBar({ cameras, onFiltersChange }: FiltersBarProps) {
  const [search, setSearch] = useState("");
  const [camera, setCamera] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleChange = (
    newSearch = search,
    newCamera = camera,
    newStatus = status,
    newDateFrom = dateFrom,
    newDateTo = dateTo
  ) => {
    onFiltersChange({
      search: newSearch,
      camera: newCamera,
      status: newStatus,
      dateFrom: newDateFrom,
      dateTo: newDateTo,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCamera("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    onFiltersChange({
      search: "",
      camera: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasFilters = search || camera !== "all" || status !== "all" || dateFrom || dateTo;

  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleChange(e.target.value);
            }}
            className="pl-9 bg-muted border-border"
          />
        </div>

        {/* Camera filter */}
        <Select
          value={camera}
          onValueChange={(value) => {
            setCamera(value);
            handleChange(search, value);
          }}
        >
          <SelectTrigger className="w-[180px] bg-muted border-border">
            <Camera className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Caméra" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Toutes les caméras</SelectItem>
            {cameras.map((cam) => (
              <SelectItem key={cam.id} value={cam.id}>
                {cam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            handleChange(search, camera, value);
          }}
        >
          <SelectTrigger className="w-[160px] bg-muted border-border">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="identified">Identifiés</SelectItem>
            <SelectItem value="unknown">Inconnus</SelectItem>
          </SelectContent>
        </Select>

        {/* Date from */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              handleChange(search, camera, status, e.target.value);
            }}
            className="pl-9 w-[160px] bg-muted border-border"
            placeholder="Date début"
          />
        </div>

        {/* Date to */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              handleChange(search, camera, status, dateFrom, e.target.value);
            }}
            className="pl-9 w-[160px] bg-muted border-border"
            placeholder="Date fin"
          />
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
}
