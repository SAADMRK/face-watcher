-- Table des personnes détectées
CREATE TABLE public.detected_persons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    image_path TEXT NOT NULL,
    camera_id TEXT NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_identified BOOLEAN NOT NULL DEFAULT false,
    confidence DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les recherches
CREATE INDEX idx_detected_persons_detected_at ON public.detected_persons(detected_at DESC);
CREATE INDEX idx_detected_persons_camera ON public.detected_persons(camera_id);
CREATE INDEX idx_detected_persons_identified ON public.detected_persons(is_identified);

-- Enable RLS
ALTER TABLE public.detected_persons ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture admin (pour l'instant public pour dev)
CREATE POLICY "Allow read access for all"
ON public.detected_persons
FOR SELECT
USING (true);

-- Policy pour insertion (API)
CREATE POLICY "Allow insert for all"
ON public.detected_persons
FOR INSERT
WITH CHECK (true);

-- Policy pour update (identifier les personnes)
CREATE POLICY "Allow update for all"
ON public.detected_persons
FOR UPDATE
USING (true);

-- Table des caméras
CREATE TABLE public.cameras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for cameras"
ON public.cameras
FOR SELECT
USING (true);

CREATE POLICY "Allow insert for cameras"
ON public.cameras
FOR INSERT
WITH CHECK (true);

-- Insérer quelques caméras par défaut
INSERT INTO public.cameras (id, name, location) VALUES
('CAM-001', 'Entrée principale', 'Hall A'),
('CAM-002', 'Parking', 'Niveau -1'),
('CAM-003', 'Couloir B', 'Étage 2');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.detected_persons;