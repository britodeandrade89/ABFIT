// src/data/exerciseDatabase.ts

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl?: string; // URL da imagem/gif
}

export const EXERCISE_DATABASE: Record<string, ExerciseDefinition[]> = {
  'Peitoral': [
    { id: 'supino_reto_barra', name: 'Supino Reto com Barra', muscleGroup: 'Peitoral', videoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=300&auto=format&fit=crop' },
    { id: 'supino_inclinado_hbc', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peitoral', videoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop' },
    { id: 'crucifixo_maquina', name: 'Crucifixo na Máquina (Peck Deck)', muscleGroup: 'Peitoral', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop' },
    { id: 'flexao_solo', name: 'Flexão de Braços', muscleGroup: 'Peitoral', videoUrl: 'https://images.unsplash.com/photo-1598971639058-211a73287110?q=80&w=300&auto=format&fit=crop' },
  ],
  'Dorsal': [
    { id: 'puxada_frente', name: 'Puxada Frontal Alta', muscleGroup: 'Dorsal', videoUrl: 'https://images.unsplash.com/photo-1603287681836-e6c934bf235e?q=80&w=300&auto=format&fit=crop' },
    { id: 'remada_curvada', name: 'Remada Curvada com Barra', muscleGroup: 'Dorsal', videoUrl: 'https://images.unsplash.com/photo-1598532163257-52b01c38e78e?q=80&w=300&auto=format&fit=crop' },
    { id: 'remada_baixa', name: 'Remada Baixa no Triângulo', muscleGroup: 'Dorsal', videoUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=300&auto=format&fit=crop' },
    { id: 'pulldown', name: 'Pulldown na Polia', muscleGroup: 'Dorsal', videoUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=300&auto=format&fit=crop' },
  ],
  'Pernas': [
    { id: 'agachamento_livre', name: 'Agachamento Livre', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?q=80&w=300&auto=format&fit=crop' },
    { id: 'leg_press', name: 'Leg Press 45', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=300&auto=format&fit=crop' },
    { id: 'extensora', name: 'Cadeira Extensora', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop' },
    { id: 'stiff', name: 'Stiff com Barra', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop' },
    { id: 'elevacao_pelvica', name: 'Elevação Pélvica', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1534367347848-8a7195982823?q=80&w=300&auto=format&fit=crop' },
  ],
  'Ombros': [
    { id: 'desenvolvimento_halter', name: 'Desenvolvimento com Halteres', muscleGroup: 'Ombros', videoUrl: 'https://images.unsplash.com/photo-1620371350502-999e9a7d80a2?q=80&w=300&auto=format&fit=crop' },
    { id: 'elevacao_lateral', name: 'Elevação Lateral', muscleGroup: 'Ombros', videoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop' },
  ],
  'Bíceps/Tríceps': [
    { id: 'rosca_direta', name: 'Rosca Direta Barra W', muscleGroup: 'Braços', videoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=300&auto=format&fit=crop' },
    { id: 'triceps_corda', name: 'Tríceps Corda na Polia', muscleGroup: 'Braços', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop' },
  ]
};