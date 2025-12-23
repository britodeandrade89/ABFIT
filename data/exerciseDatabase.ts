// src/data/exerciseDatabase.ts

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl?: string; 
}

// Função auxiliar para gerar imagens com representatividade
// Atualizado para usar Pollinations AI pois source.unsplash foi descontinuado
const getThumb = (keywords: string) => 
  `https://image.pollinations.ai/prompt/gym%20workout%20exercise%20${keywords}%20fitness%20cinematic%20lighting?width=300&height=200&nologo=true`;

export const EXERCISE_DATABASE: Record<string, ExerciseDefinition[]> = {
  'Glúteos': [
     { id: 'elevacao_pelvica_barra', name: 'Elevação Pélvica com Barra', muscleGroup: 'Glúteos', videoUrl: getThumb('hip-thrust-barbell') },
     { id: 'elevacao_pelvica_maq', name: 'Elevação Pélvica na Máquina', muscleGroup: 'Glúteos', videoUrl: getThumb('hip-thrust-machine') },
     { id: 'gluteo_caneleira', name: 'Extensão de Quadril (Caneleira)', muscleGroup: 'Glúteos', videoUrl: getThumb('glute-kickback-ankle-weights') },
     { id: 'gluteo_polia', name: 'Coice na Polia (Cabo)', muscleGroup: 'Glúteos', videoUrl: getThumb('cable-kickback-glute') },
     { id: 'agachamento_sumo', name: 'Agachamento Sumô (Halter/Barra)', muscleGroup: 'Glúteos', videoUrl: getThumb('sumo-squat') },
     { id: 'abd_quadril_maq', name: 'Cadeira Abdutora', muscleGroup: 'Glúteos', videoUrl: getThumb('abductor-machine-gym') },
     { id: 'passada_bulgara', name: 'Agachamento Búlgaro', muscleGroup: 'Glúteos', videoUrl: getThumb('bulgarian-split-squat') },
     { id: 'subida_caixote', name: 'Subida no Caixote (Step Up)', muscleGroup: 'Glúteos', videoUrl: getThumb('step-up-exercise-gym') },
     { id: 'gluteo_graviton', name: 'Glúteo no Graviton', muscleGroup: 'Glúteos', videoUrl: getThumb('glute-pushdown-machine') },
     { id: 'abducao_elastico', name: 'Abdução com Mini Band', muscleGroup: 'Glúteos', videoUrl: getThumb('resistance-band-glute') }
  ],
  'Posteriores/Panturrilha': [
     { id: 'stiff_barra', name: 'Stiff com Barra', muscleGroup: 'Posteriores', videoUrl: getThumb('stiff-leg-deadlift-barbell') },
     { id: 'stiff_hbc', name: 'Stiff com Halteres', muscleGroup: 'Posteriores', videoUrl: getThumb('dumbbell-stiff-leg-deadlift') },
     { id: 'mesa_flexora', name: 'Mesa Flexora', muscleGroup: 'Posteriores', videoUrl: getThumb('lying-leg-curl-machine') },
     { id: 'cadeira_flexora', name: 'Cadeira Flexora', muscleGroup: 'Posteriores', videoUrl: getThumb('seated-leg-curl-machine') },
     { id: 'flexora_vertical', name: 'Flexora Vertical (Unilateral)', muscleGroup: 'Posteriores', videoUrl: getThumb('standing-leg-curl-machine') },
     { id: 'bom_dia', name: 'Bom Dia (Good Morning)', muscleGroup: 'Posteriores', videoUrl: getThumb('good-morning-barbell-exercise') },
     { id: 'nordico', name: 'Flexão Nórdica', muscleGroup: 'Posteriores', videoUrl: getThumb('nordic-hamstring-curl') },
     // Panturrilhas
     { id: 'panturrilha_smith', name: 'Panturrilha em Pé (Smith)', muscleGroup: 'Panturrilha', videoUrl: getThumb('calf-raise-smith-machine') },
     { id: 'panturrilha_leg', name: 'Panturrilha no Leg Press', muscleGroup: 'Panturrilha', videoUrl: getThumb('leg-press-calf-raise') },
     { id: 'panturrilha_sentado', name: 'Panturrilha Sentado (Banco)', muscleGroup: 'Panturrilha', videoUrl: getThumb('seated-calf-raise-machine') },
     { id: 'panturrilha_unilateral', name: 'Panturrilha Unilateral (Halter)', muscleGroup: 'Panturrilha', videoUrl: getThumb('single-leg-calf-raise') }
  ],
  'Quadríceps': [
     { id: 'agachamento_livre', name: 'Agachamento Livre (Barra)', muscleGroup: 'Quadríceps', videoUrl: getThumb('barbell-squat') },
     { id: 'front_squat', name: 'Agachamento Frontal', muscleGroup: 'Quadríceps', videoUrl: getThumb('front-squat-barbell') },
     { id: 'leg_press_45', name: 'Leg Press 45', muscleGroup: 'Quadríceps', videoUrl: getThumb('leg-press-45-degrees') },
     { id: 'leg_horizontal', name: 'Leg Press Horizontal', muscleGroup: 'Quadríceps', videoUrl: getThumb('seated-leg-press-machine') },
     { id: 'extensora', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', videoUrl: getThumb('leg-extension-machine') },
     { id: 'afundo_barra', name: 'Afundo com Barra', muscleGroup: 'Quadríceps', videoUrl: getThumb('barbell-lunge') },
     { id: 'afundo_hbc', name: 'Afundo com Halteres', muscleGroup: 'Quadríceps', videoUrl: getThumb('dumbbell-lunge') },
     { id: 'goblet_squat', name: 'Goblet Squat', muscleGroup: 'Quadríceps', videoUrl: getThumb('goblet-squat-kettlebell') },
     { id: 'sissy_squat', name: 'Sissy Squat', muscleGroup: 'Quadríceps', videoUrl: getThumb('sissy-squat-bench') },
     { id: 'hack_machine', name: 'Agachamento Hack', muscleGroup: 'Quadríceps', videoUrl: getThumb('hack-squat-machine') }
  ],
  'Adutores': [
     { id: 'cadeira_adutora', name: 'Cadeira Adutora', muscleGroup: 'Adutores', videoUrl: getThumb('adductor-machine-gym') },
     { id: 'aducao_polia', name: 'Adução na Polia', muscleGroup: 'Adutores', videoUrl: getThumb('cable-hip-adduction') },
     { id: 'copenhagen', name: 'Prancha Copenhagen', muscleGroup: 'Adutores', videoUrl: getThumb('copenhagen-plank-exercise') }
  ],
  'Abdomen': [
     { id: 'abdominal_supra', name: 'Abdominal Supra (Solo)', muscleGroup: 'Abdomen', videoUrl: getThumb('crunches-floor') },
     { id: 'abdominal_infra', name: 'Abdominal Infra (Elevação de Pernas)', muscleGroup: 'Abdomen', videoUrl: getThumb('leg-raises-floor') },
     { id: 'abdominal_remador', name: 'Abdominal Remador', muscleGroup: 'Abdomen', videoUrl: getThumb('v-up-abs') },
     { id: 'abdominal_maquina', name: 'Abdominal Máquina', muscleGroup: 'Abdomen', videoUrl: getThumb('abdominal-crunch-machine') },
     { id: 'abdominal_corda', name: 'Abdominal na Polia (Corda)', muscleGroup: 'Abdomen', videoUrl: getThumb('cable-crunch-kneeling') },
     { id: 'abdominal_rodinha', name: 'Roda Abdominal', muscleGroup: 'Abdomen', videoUrl: getThumb('ab-wheel-rollout') },
     { id: 'obliquo_solo', name: 'Abdominal Oblíquo (Cruzado)', muscleGroup: 'Abdomen', videoUrl: getThumb('bicycle-crunches') }
  ],
  'Core': [
     { id: 'prancha_frontal', name: 'Prancha Frontal Isométrica', muscleGroup: 'Core', videoUrl: getThumb('plank-exercise') },
     { id: 'prancha_lateral', name: 'Prancha Lateral', muscleGroup: 'Core', videoUrl: getThumb('side-plank-exercise') },
     { id: 'perdigueiro', name: 'Perdigueiro (Bird Dog)', muscleGroup: 'Core', videoUrl: getThumb('bird-dog-exercise') },
     { id: 'paloff_press', name: 'Paloff Press (Anti-Rotação)', muscleGroup: 'Core', videoUrl: getThumb('pallof-press-cable') },
     { id: 'farmers_walk', name: 'Caminhada do Fazendeiro', muscleGroup: 'Core', videoUrl: getThumb('farmers-walk-carry') }
  ],
  'Paravertebrais': [
     { id: 'extensao_lombar', name: 'Extensão Lombar (Banco Romano)', muscleGroup: 'Paravertebrais', videoUrl: getThumb('hyperextension-bench') },
     { id: 'superman', name: 'Superman (Solo)', muscleGroup: 'Paravertebrais', videoUrl: getThumb('superman-exercise-floor') }
  ],
  'Cintura Escapular': [
     { id: 'face_pull', name: 'Face Pull (Polia)', muscleGroup: 'Cintura Escapular', videoUrl: getThumb('face-pull-cable') },
     { id: 'ytwl', name: 'YTWL (Halteres/Livre)', muscleGroup: 'Cintura Escapular', videoUrl: getThumb('ytwl-exercise') },
     { id: 'encolhimento_barra', name: 'Encolhimento com Barra', muscleGroup: 'Cintura Escapular', videoUrl: getThumb('barbell-shrugs') },
     { id: 'encolhimento_hbc', name: 'Encolhimento com Halteres', muscleGroup: 'Cintura Escapular', videoUrl: getThumb('dumbbell-shrugs') },
     { id: 'retracao_polia', name: 'Retração Escapular na Polia', muscleGroup: 'Cintura Escapular', videoUrl: getThumb('cable-scapular-retraction') }
  ],
  'Grande Dorsais': [
     { id: 'puxada_frente', name: 'Puxada Frontal Aberta', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('lat-pulldown-wide-grip') },
     { id: 'puxada_triangulo', name: 'Puxada com Triângulo', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('close-grip-pulldown') },
     { id: 'puxada_supinada', name: 'Puxada Supinada', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('reverse-grip-lat-pulldown') },
     { id: 'remada_curvada_pronada', name: 'Remada Curvada Pronada', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('barbell-bent-over-row') },
     { id: 'remada_curvada_supinada', name: 'Remada Curvada Supinada', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('reverse-grip-barbell-row') },
     { id: 'remada_unilateral', name: 'Remada Unilateral (Serrote)', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('dumbbell-row-bench') },
     { id: 'remada_baixa', name: 'Remada Baixa (Triângulo)', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('seated-cable-row') },
     { id: 'remada_maquina', name: 'Remada na Máquina', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('seated-row-machine') },
     { id: 'barra_fixa', name: 'Barra Fixa (Pull Up)', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('pull-up-bar') },
     { id: 'pulldown_corda', name: 'Pulldown (Frente)', muscleGroup: 'Grande Dorsais', videoUrl: getThumb('straight-arm-pulldown') }
  ],
  'Peitorais': [
     { id: 'supino_reto_barra', name: 'Supino Reto (Barra)', muscleGroup: 'Peitorais', videoUrl: getThumb('bench-press-barbell') },
     { id: 'supino_reto_hbc', name: 'Supino Reto (Halteres)', muscleGroup: 'Peitorais', videoUrl: getThumb('dumbbell-bench-press') },
     { id: 'supino_inclinado_barra', name: 'Supino Inclinado (Barra)', muscleGroup: 'Peitorais', videoUrl: getThumb('incline-bench-press') },
     { id: 'supino_inclinado_hbc', name: 'Supino Inclinado (Halteres)', muscleGroup: 'Peitorais', videoUrl: getThumb('incline-dumbbell-press') },
     { id: 'supino_declinado', name: 'Supino Declinado', muscleGroup: 'Peitorais', videoUrl: getThumb('decline-bench-press') },
     { id: 'crucifixo_reto', name: 'Crucifixo Reto (Halteres)', muscleGroup: 'Peitorais', videoUrl: getThumb('dumbbell-fly-bench') },
     { id: 'crucifixo_inclinado', name: 'Crucifixo Inclinado', muscleGroup: 'Peitorais', videoUrl: getThumb('incline-dumbbell-fly') },
     { id: 'crossover_polia_alta', name: 'Crossover (Polia Alta)', muscleGroup: 'Peitorais', videoUrl: getThumb('cable-crossover-high') },
     { id: 'crossover_polia_baixa', name: 'Crossover (Polia Baixa)', muscleGroup: 'Peitorais', videoUrl: getThumb('cable-crossover-low') },
     { id: 'peck_deck', name: 'Peck Deck (Voador)', muscleGroup: 'Peitorais', videoUrl: getThumb('peck-deck-machine') },
     { id: 'flexao_solo', name: 'Flexão de Braços', muscleGroup: 'Peitorais', videoUrl: getThumb('push-ups-floor') },
     { id: 'paralelas', name: 'Mergulho nas Paralelas', muscleGroup: 'Peitorais', videoUrl: getThumb('dips-exercise') }
  ],
  'Bíceps': [
     { id: 'rosca_direta_barra', name: 'Rosca Direta (Barra Reta)', muscleGroup: 'Bíceps', videoUrl: getThumb('barbell-curl') },
     { id: 'rosca_direta_w', name: 'Rosca Direta (Barra W)', muscleGroup: 'Bíceps', videoUrl: getThumb('ez-bar-curl') },
     { id: 'rosca_alternada', name: 'Rosca Alternada (Halter)', muscleGroup: 'Bíceps', videoUrl: getThumb('alternating-dumbbell-curl') },
     { id: 'rosca_martelo', name: 'Rosca Martelo', muscleGroup: 'Bíceps', videoUrl: getThumb('hammer-curl-dumbbell') },
     { id: 'rosca_scott_maq', name: 'Rosca Scott (Máquina)', muscleGroup: 'Bíceps', videoUrl: getThumb('preacher-curl-machine') },
     { id: 'rosca_scott_barra', name: 'Rosca Scott (Barra W)', muscleGroup: 'Bíceps', videoUrl: getThumb('ez-bar-preacher-curl') },
     { id: 'rosca_concentrada', name: 'Rosca Concentrada', muscleGroup: 'Bíceps', videoUrl: getThumb('concentration-curl') },
     { id: 'rosca_inclinada', name: 'Rosca no Banco Inclinado 45', muscleGroup: 'Bíceps', videoUrl: getThumb('incline-dumbbell-curl') },
     { id: 'rosca_polia', name: 'Rosca Direta na Polia', muscleGroup: 'Bíceps', videoUrl: getThumb('cable-bicep-curl') }
  ],
  'Tríceps': [
     { id: 'triceps_polia_barra', name: 'Tríceps Polia (Barra Reta)', muscleGroup: 'Tríceps', videoUrl: getThumb('tricep-pushdown-bar') },
     { id: 'triceps_corda', name: 'Tríceps Corda', muscleGroup: 'Tríceps', videoUrl: getThumb('tricep-rope-pushdown') },
     { id: 'triceps_testa_barra', name: 'Tríceps Testa (Barra W)', muscleGroup: 'Tríceps', videoUrl: getThumb('skull-crushers-ez-bar') },
     { id: 'triceps_testa_hbc', name: 'Tríceps Testa (Halteres)', muscleGroup: 'Tríceps', videoUrl: getThumb('dumbbell-skull-crushers') },
     { id: 'triceps_frances_uni', name: 'Tríceps Francês Unilateral', muscleGroup: 'Tríceps', videoUrl: getThumb('overhead-dumbbell-extension') },
     { id: 'triceps_frances_bi', name: 'Tríceps Francês (Corda/Halter)', muscleGroup: 'Tríceps', videoUrl: getThumb('overhead-tricep-extension') },
     { id: 'triceps_coice', name: 'Tríceps Coice (Polia ou Halter)', muscleGroup: 'Tríceps', videoUrl: getThumb('tricep-kickback') },
     { id: 'mergulho_banco', name: 'Mergulho no Banco', muscleGroup: 'Tríceps', videoUrl: getThumb('bench-dips') }
  ],
  'Ombros': [
     { id: 'desenvolvimento_hbc', name: 'Desenvolvimento com Halteres', muscleGroup: 'Ombros', videoUrl: getThumb('dumbbell-shoulder-press') },
     { id: 'desenvolvimento_barra', name: 'Desenvolvimento Militar (Barra)', muscleGroup: 'Ombros', videoUrl: getThumb('military-press-barbell') },
     { id: 'desenvolvimento_maq', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', videoUrl: getThumb('shoulder-press-machine') },
     { id: 'elevacao_lateral_hbc', name: 'Elevação Lateral (Halteres)', muscleGroup: 'Ombros', videoUrl: getThumb('dumbbell-lateral-raise') },
     { id: 'elevacao_lateral_polia', name: 'Elevação Lateral (Polia)', muscleGroup: 'Ombros', videoUrl: getThumb('cable-lateral-raise') },
     { id: 'elevacao_frontal', name: 'Elevação Frontal', muscleGroup: 'Ombros', videoUrl: getThumb('front-raise-dumbbell') },
     { id: 'crucifixo_inverso_hbc', name: 'Crucifixo Inverso (Halteres)', muscleGroup: 'Ombros', videoUrl: getThumb('reverse-dumbbell-fly') },
     { id: 'crucifixo_inverso_mq', name: 'Crucifixo Inverso (Voador Inverso)', muscleGroup: 'Ombros', videoUrl: getThumb('reverse-pec-deck') },
     { id: 'remada_alta', name: 'Remada Alta', muscleGroup: 'Ombros', videoUrl: getThumb('upright-row-barbell') }
  ]
};