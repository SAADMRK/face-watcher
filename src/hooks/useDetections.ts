import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface Filters {
  search: string;
  camera: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export function useDetections(filters: Filters) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch detections
  const { data: detections = [], isLoading, refetch } = useQuery({
    queryKey: ["detections", filters],
    queryFn: async () => {
      let query = supabase
        .from("detected_persons")
        .select("*")
        .order("detected_at", { ascending: false });

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.camera && filters.camera !== "all") {
        query = query.eq("camera_id", filters.camera);
      }

      if (filters.status === "identified") {
        query = query.eq("is_identified", true);
      } else if (filters.status === "unknown") {
        query = query.eq("is_identified", false);
      }

      if (filters.dateFrom) {
        query = query.gte("detected_at", `${filters.dateFrom}T00:00:00`);
      }

      if (filters.dateTo) {
        query = query.lte("detected_at", `${filters.dateTo}T23:59:59`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  // Fetch cameras
  const { data: cameras = [] } = useQuery({
    queryKey: ["cameras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cameras")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  // Identify person mutation
  const identifyMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("detected_persons")
        .update({ name, is_identified: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detections"] });
      toast({
        title: "Personne identifiée",
        description: "Le nom a été enregistré avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier la personne.",
        variant: "destructive",
      });
      console.error("Identify error:", error);
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("detections-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "detected_persons",
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calculate stats
  const stats = {
    total: detections.length,
    identified: detections.filter((d) => d.is_identified).length,
    unknown: detections.filter((d) => !d.is_identified).length,
    todayCount: detections.filter((d) => {
      const today = new Date();
      const detectedDate = new Date(d.detected_at);
      return detectedDate.toDateString() === today.toDateString();
    }).length,
  };

  return {
    detections,
    cameras,
    stats,
    isLoading,
    identifyPerson: identifyMutation.mutate,
  };
}
