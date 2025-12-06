import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User, Camera, Clock, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IdentifyModal } from "./IdentifyModal";
import { cn } from "@/lib/utils";

interface Detection {
  id: string;
  name: string | null;
  image_path: string;
  camera_id: string;
  detected_at: string;
  is_identified: boolean;
  confidence: number | null;
}

interface DetectionsTableProps {
  detections: Detection[];
  onIdentify: (id: string, name: string) => void;
  isLoading?: boolean;
}

export function DetectionsTable({ detections, onIdentify, isLoading }: DetectionsTableProps) {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIdentify = (detection: Detection) => {
    setSelectedDetection(detection);
    setIsModalOpen(true);
  };

  const handleSave = (name: string) => {
    if (selectedDetection) {
      onIdentify(selectedDetection.id, name);
    }
    setIsModalOpen(false);
    setSelectedDetection(null);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 flex items-center justify-center">
        <div className="animate-pulse-subtle text-muted-foreground">
          Chargement des détections...
        </div>
      </div>
    );
  }

  if (detections.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Aucune détection trouvée</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Image</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Personne</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Caméra</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Date/Heure</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Statut</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detections.map((detection, index) => (
              <TableRow 
                key={detection.id} 
                className="table-row-hover border-border/30 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border/50">
                    <img
                      src={detection.image_path}
                      alt="Détection"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className={cn(
                      "font-medium",
                      detection.is_identified ? "text-foreground" : "text-warning"
                    )}>
                      {detection.name || "Inconnu"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{detection.camera_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(detection.detected_at), "dd MMM yyyy, HH:mm", { locale: fr })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "status-badge",
                    detection.is_identified ? "status-identified" : "status-unknown"
                  )}>
                    {detection.is_identified ? "Identifié" : "Inconnu"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!detection.is_identified && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleIdentify(detection)}
                        className="gap-1"
                      >
                        <UserPlus className="w-4 h-4" />
                        Identifier
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <IdentifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        imagePath={selectedDetection?.image_path || ""}
      />
    </>
  );
}
