window.DNA_LIGAS = {
  "BR": {
    "nome": "Brasileirão Série A",
    "perfil": "INTENSO_VARIAVEL",
    "descricao": "Liga de alta intensidade com grande variação entre times grandes e pequenos. Mandante tem vantagem forte. Clássicos tendem a ter muitos cantos.",
    "media_cantos_ft": null,
    "media_cantos_ht": null,
    "media_gols_ft": null,
    "desvio_padrao_cantos": null,
    "fator_mandante": null,
    "tendencia_cantos": "NA_MEDIA",
    "peculiaridades": [
      "Clássicos regionais (FLA×FLU, COR×PAL) tendem a 12+ cantos",
      "Times visitantes pequenos frequentemente retrancam (5ATB)",
      "Calendário congestionado (Copa do Brasil + Libertadores) causa fadiga",
      "VAR gera paralisações que resfriam o ritmo"
    ],
    "ajuste_modelo": {
      "base": 0,
      "classico": 0.12,
      "time_pequeno_fora": -0.1,
      "rodada_pos_libertadores": -0.08
    },
    "times_alto_canto": [],
    "times_baixo_canto": [],
    "times_muro": []
  },
  "MLS": {
    "nome": "MLS",
    "perfil": "OFENSIVO_ABERTO",
    "descricao": "Liga com jogo aberto, muitas transições e espaços. Tendência de mais cantos que a média global.",
    "media_cantos_ft": 9.6,
    "media_cantos_ht": 4.4,
    "media_gols_ft": 3.6,
    "desvio_padrao_cantos": 2.87,
    "fator_mandante": 1.36,
    "tendencia_cantos": "NA_MEDIA",
    "peculiaridades": [
      "Campos maiores = mais espaço nas pontas",
      "Pouca tradição de retranca tática",
      "5 substituições mantém intensidade alta",
      "Viagens longas afetam visitantes",
      "Altitude em Denver/Salt Lake = fadiga no 2T",
      "Calor extremo no verão = ritmo cai no 2T"
    ],
    "ajuste_modelo": {
      "base": 0.08,
      "viagem_longa": -0.05,
      "altitude": 0.06,
      "calor_extremo": -0.07
    },
    "times_alto_canto": [],
    "times_baixo_canto": [],
    "times_muro": []
  },
  "ARG": {
    "nome": "Liga Profesional Argentina",
    "perfil": "DEFENSIVO_TATICO",
    "descricao": "Liga truncada com poucos gols e muitas faltas. Cultura de cerrojo domina visitantes. Clássicos são exceções explosivas.",
    "media_cantos_ft": null,
    "media_cantos_ht": null,
    "media_gols_ft": null,
    "desvio_padrao_cantos": null,
    "fator_mandante": null,
    "tendencia_cantos": "ABAIXO_MEDIA_GLOBAL",
    "peculiaridades": [
      "Média ~2.1 gols/jogo (abaixo da média global de 2.6)",
      "Visitantes quase sempre retrancam (5-4-1 / 5-3-2)",
      "Muitas faltas (~25/jogo) cortam o ritmo",
      "Superclásico (Boca × River) é exceção (jogo intenso)",
      "Campos em mau estado em times menores",
      "Pressão da torcida mandante é enorme"
    ],
    "ajuste_modelo": {
      "base": -0.12,
      "classico": 0.15,
      "visitante_retrancado": -0.15,
      "campo_ruim": -0.05
    },
    "times_alto_canto": [],
    "times_baixo_canto": [],
    "times_muro": []
  },
  "USL": {
    "nome": "USL Championship",
    "perfil": "EQUILIBRADO_INFERIOR",
    "descricao": "Liga de segundo escalão. Qualidade técnica menor. Jogos mais caóticos. Dados mais escassos = maior incerteza.",
    "media_cantos_ft": null,
    "media_cantos_ht": null,
    "media_gols_ft": null,
    "desvio_padrao_cantos": null,
    "fator_mandante": null,
    "tendencia_cantos": "NA_MEDIA",
    "peculiaridades": [
      "Qualidade técnica inferior = jogadas menos elaboradas",
      "Menos dados históricos = modelo precisa de mais shrinkage",
      "Campos menores em alguns estádios",
      "Viagens longas afetam visitantes"
    ],
    "ajuste_modelo": {
      "base": -0.05,
      "dados_escassos": 0.1
    },
    "times_alto_canto": [],
    "times_baixo_canto": [],
    "times_muro": []
  },
  "ECU": {
    "nome": "Liga Pro Equador",
    "perfil": "IMPREVISIVEL_ALTITUDE",
    "descricao": "Liga impactada pela altitude. Jogos em Quito (2.850m) são completamente diferentes de Guayaquil (nível do mar).",
    "media_cantos_ft": null,
    "media_cantos_ht": null,
    "media_gols_ft": null,
    "desvio_padrao_cantos": null,
    "fator_mandante": null,
    "tendencia_cantos": "NA_MEDIA",
    "peculiaridades": [
      "ALTITUDE é o fator nº 1 — Quito a 2.850m, Ambato a 2.600m",
      "Times de terras baixas sofrem no 2T em altitude",
      "Mandante em altitude tem vantagem EXTREMA (>60% vitórias)",
      "Fadiga no 2T = mais cantos do mandante",
      "Bola viaja mais rápido em altitude"
    ],
    "ajuste_modelo": {
      "base": 0,
      "mandante_altitude": 0.15,
      "visitante_altitude": -0.2,
      "jogo_nivel_mar": 0
    },
    "times_alto_canto": [],
    "times_baixo_canto": [],
    "times_muro": []
  }
};