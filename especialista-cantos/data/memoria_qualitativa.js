// ================================================================
// MEMÓRIA QUALITATIVA EDS — Gerada automaticamente
// Todas as ligas: ARG, MLS, BR, USL
// Atualizado: 2026-04-10 (Teacher ARG + USL injetados)
// ================================================================

window.MEMORIA_QUALITATIVA = {
  "ARG": {
    "liga": "Argentina — Liga Profesional 2026",
    "gerado_em": "2026-04-09",
    "jogos_analisados": 180,
    "baseline": {
      "media_cantos_HT": 4.09,
      "media_cantos_FT": 8.5,
      "l_htH": 2.461,
      "l_htA": 1.628,
      "l_ftH": 4.978,
      "l_ftA": 3.522
    },
    "calibracao_teacher": {
    "versao": "Volvo Test v2 (Zona Neutra Poisson)",
    "rodada_validada": 2,
    "data_referencia": "2026-04-06",
    "jogos_validados": 15,
    "media_cantos_ht_real": 4.2,
    "media_cantos_ft_real": 8.6,
    "taxa_over_3_5_ht": 46.7,
    "taxa_over_4_5_ht": 46.7,
    "taxa_over_5_5_ht": 26.7,
    "taxa_over_8_5_ft": 60.0,
    "taxa_over_9_5_ft": 40.0,
    "taxa_over_10_5_ft": 20.0,
    "taxa_over_11_5_ft": 13.3,
    "min_cantos_ft": 3,
    "max_cantos_ft": 16,
    "min_cantos_ht": 0,
    "max_cantos_ht": 11,
    "insights": [
        "Liga equilibrada no HT: média 4.2 cantos — Over 3.5 HT acertou 46.7% dos jogos",
        "Alta variância de cantos FT (min=3, max=16) — overdispersion severo, Poisson pode subestimar extremos"
    ],
    "jogos_destaque": [
        {
            "mandante": "Instituto",
            "visitante": "Defensa y Justicia",
            "cantos_ht": 7,
            "cantos_ft": 10
        },
        {
            "mandante": "Gimnasia L.P.",
            "visitante": "Huracan",
            "cantos_ht": 6,
            "cantos_ft": 13
        },
        {
            "mandante": "Rosario Central",
            "visitante": "Atl. Tucuman",
            "cantos_ht": 2,
            "cantos_ft": 11
        },
        {
            "mandante": "Aldosivi",
            "visitante": "Estudiantes Rio Cuarto",
            "cantos_ht": 11,
            "cantos_ft": 16
        },
        {
            "mandante": "Union de Santa Fe",
            "visitante": "Dep. Riestra",
            "cantos_ht": 6,
            "cantos_ft": 9
        }
    ]
},
    "perfis_times": {
      "Instituto": {
        "n_jogos": 7,
        "xHT_mandante": 3.61,
        "xFT_mandante": 4.84,
        "xHT_visitante": 1.82,
        "xFT_visitante": 4.89,
        "posse_media": 49.3,
        "finalizacoes_media": 8.9,
        "tendencia_cantos": "crescente",
        "volatilidade": 1.75,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 0.97,
        "fator_defesa": 1.39,
        "alertas": []
      },
      "Velez Sarsfield": {
        "n_jogos": 7,
        "xHT_mandante": 1.81,
        "xFT_mandante": 4.5,
        "xHT_visitante": 0.93,
        "xFT_visitante": 2.03,
        "posse_media": 53.8,
        "finalizacoes_media": 8.8,
        "tendencia_cantos": "estavel",
        "volatilidade": 2.05,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 0.9,
        "fator_defesa": 0.58,
        "alertas": []
      },
      "Union de Santa Fe": {
        "n_jogos": 6,
        "xHT_mandante": 3.99,
        "xFT_mandante": 6.8,
        "xHT_visitante": 0.83,
        "xFT_visitante": 4.62,
        "posse_media": 53.7,
        "finalizacoes_media": 14.2,
        "tendencia_cantos": "crescente",
        "volatilidade": 2.36,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 1.37,
        "fator_defesa": 1.31,
        "alertas": [
          "OVER_HT_FAVORAVEL: pressão no 1T acima da média da liga"
        ]
      },
      "Platense": {
        "n_jogos": 7,
        "xHT_mandante": 2.22,
        "xFT_mandante": 4.55,
        "xHT_visitante": 1.41,
        "xFT_visitante": 2.76,
        "posse_media": 52.2,
        "finalizacoes_media": 6.8,
        "tendencia_cantos": "crescente",
        "volatilidade": 1.19,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "COMPACTO",
        "fator_ataque": 0.91,
        "fator_defesa": 0.78,
        "alertas": []
      },
      "Aldosivi": {
        "n_jogos": 6,
        "xHT_mandante": 3.13,
        "xFT_mandante": 5.24,
        "xHT_visitante": 2.02,
        "xFT_visitante": 5.24,
        "posse_media": 40.5,
        "finalizacoes_media": 9.5,
        "tendencia_cantos": "decrescente",
        "volatilidade": 1.5,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "SANGRA_CANTOS",
        "fator_ataque": 1.05,
        "fator_defesa": 1.49,
        "alertas": [
          "ALVO_OVER: sangra cantos como visitante — confrontos vs ele tendem a OVER"
        ]
      },
      "Defensa y Justicia": {
        "n_jogos": 6,
        "xHT_mandante": 3.21,
        "xFT_mandante": 4.98,
        "xHT_visitante": 1.76,
        "xFT_visitante": 4.09,
        "posse_media": 48.7,
        "finalizacoes_media": 6.8,
        "tendencia_cantos": "estavel",
        "volatilidade": 1.3,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1,
        "fator_defesa": 1.16,
        "alertas": []
      },
      "Central Cordoba": {
        "n_jogos": 6,
        "xHT_mandante": 1.27,
        "xFT_mandante": 3.81,
        "xHT_visitante": 1.23,
        "xFT_visitante": 3.62,
        "posse_media": 47.3,
        "finalizacoes_media": 7.5,
        "tendencia_cantos": "decrescente_forte",
        "volatilidade": 3.26,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.77,
        "fator_defesa": 1.03,
        "alertas": [
          "FORMA_DESCENDENTE: volume de cantos caindo — cautela com OVER",
          "JOGO_FECHADO_HT: raramente gera cantos no 1T"
        ]
      },
      "Gimnasia Mendoza": {
        "n_jogos": 6,
        "xHT_mandante": 2.15,
        "xFT_mandante": 4.46,
        "xHT_visitante": 2.22,
        "xFT_visitante": 4.09,
        "posse_media": 49.3,
        "finalizacoes_media": 9.5,
        "tendencia_cantos": "decrescente",
        "volatilidade": 1.61,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.9,
        "fator_defesa": 1.16,
        "alertas": []
      },
      "Banfield": {
        "n_jogos": 7,
        "xHT_mandante": 2.81,
        "xFT_mandante": 4.22,
        "xHT_visitante": 1.27,
        "xFT_visitante": 2.22,
        "posse_media": 43.9,
        "finalizacoes_media": 10.4,
        "tendencia_cantos": "estavel",
        "volatilidade": 2.43,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 0.85,
        "fator_defesa": 0.63,
        "alertas": []
      },
      "Huracan": {
        "n_jogos": 6,
        "xHT_mandante": 3.13,
        "xFT_mandante": 5.83,
        "xHT_visitante": 2.32,
        "xFT_visitante": 4.26,
        "posse_media": 54.2,
        "finalizacoes_media": 7.8,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 1.71,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 1.17,
        "fator_defesa": 1.21,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Independiente": {
        "n_jogos": 7,
        "xHT_mandante": 2.89,
        "xFT_mandante": 5.59,
        "xHT_visitante": 2.32,
        "xFT_visitante": 5.5,
        "posse_media": 53.7,
        "finalizacoes_media": 11.9,
        "tendencia_cantos": "crescente",
        "volatilidade": 2.92,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "SANGRA_CANTOS",
        "fator_ataque": 1.12,
        "fator_defesa": 1.56,
        "alertas": [
          "ALVO_OVER: sangra cantos como visitante — confrontos vs ele tendem a OVER"
        ]
      },
      "Estudiantes L.P.": {
        "n_jogos": 6,
        "xHT_mandante": 4.67,
        "xFT_mandante": 6.56,
        "xHT_visitante": 1.76,
        "xFT_visitante": 3.24,
        "posse_media": 53,
        "finalizacoes_media": 9.3,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 2.38,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1.32,
        "fator_defesa": 0.92,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos",
          "OVER_HT_FAVORAVEL: pressão no 1T acima da média da liga"
        ]
      },
      "San Lorenzo": {
        "n_jogos": 6,
        "xHT_mandante": 1.93,
        "xFT_mandante": 4.75,
        "xHT_visitante": 2.3,
        "xFT_visitante": 3.66,
        "posse_media": 52.7,
        "finalizacoes_media": 9.7,
        "tendencia_cantos": "decrescente",
        "volatilidade": 2.52,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.95,
        "fator_defesa": 1.04,
        "alertas": []
      },
      "Lanus": {
        "n_jogos": 7,
        "xHT_mandante": 2.12,
        "xFT_mandante": 3.44,
        "xHT_visitante": 0.71,
        "xFT_visitante": 2.18,
        "posse_media": 55,
        "finalizacoes_media": 8.6,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 2.76,
        "perfil_ataque": "REATIVO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 0.69,
        "fator_defesa": 0.62,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Talleres Cordoba": {
        "n_jogos": 6,
        "xHT_mandante": 2.21,
        "xFT_mandante": 5.25,
        "xHT_visitante": 1.75,
        "xFT_visitante": 4.15,
        "posse_media": 56.8,
        "finalizacoes_media": 8.8,
        "tendencia_cantos": "decrescente",
        "volatilidade": 3.34,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1.05,
        "fator_defesa": 1.18,
        "alertas": []
      },
      "Newells Old Boys": {
        "n_jogos": 6,
        "xHT_mandante": 3.52,
        "xFT_mandante": 5.41,
        "xHT_visitante": 0.75,
        "xFT_visitante": 2.56,
        "posse_media": 46.5,
        "finalizacoes_media": 9.7,
        "tendencia_cantos": "decrescente",
        "volatilidade": 2.21,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "COMPACTO",
        "fator_ataque": 1.09,
        "fator_defesa": 0.73,
        "alertas": []
      },
      "Ind. Rivadavia": {
        "n_jogos": 7,
        "xHT_mandante": 1.11,
        "xFT_mandante": 4.04,
        "xHT_visitante": 2.15,
        "xFT_visitante": 4.04,
        "posse_media": 42.9,
        "finalizacoes_media": 10.7,
        "tendencia_cantos": "decrescente",
        "volatilidade": 1.92,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.81,
        "fator_defesa": 1.15,
        "alertas": [
          "JOGO_FECHADO_HT: raramente gera cantos no 1T"
        ]
      },
      "Atl. Tucuman": {
        "n_jogos": 6,
        "xHT_mandante": 3.03,
        "xFT_mandante": 5.9,
        "xHT_visitante": 1.35,
        "xFT_visitante": 4.65,
        "posse_media": 50.8,
        "finalizacoes_media": 10.5,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 2.29,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 1.18,
        "fator_defesa": 1.32,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Barracas Central": {
        "n_jogos": 6,
        "xHT_mandante": 2.51,
        "xFT_mandante": 4.65,
        "xHT_visitante": 1.21,
        "xFT_visitante": 4,
        "posse_media": 46.2,
        "finalizacoes_media": 8.5,
        "tendencia_cantos": "decrescente",
        "volatilidade": 2.06,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.93,
        "fator_defesa": 1.14,
        "alertas": []
      },
      "River Plate": {
        "n_jogos": 7,
        "xHT_mandante": 3.85,
        "xFT_mandante": 6.6,
        "xHT_visitante": 1.83,
        "xFT_visitante": 5.27,
        "posse_media": 70.6,
        "finalizacoes_media": 17,
        "tendencia_cantos": "crescente",
        "volatilidade": 2.5,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "SANGRA_CANTOS",
        "fator_ataque": 1.32,
        "fator_defesa": 1.5,
        "alertas": [
          "ALVO_OVER: sangra cantos como visitante — confrontos vs ele tendem a OVER",
          "OVER_HT_FAVORAVEL: pressão no 1T acima da média da liga",
          "DOMINANCIA_TATICA: posse alta + muitas finalizações = pressão sustentada"
        ]
      },
      "Rosario Central": {
        "n_jogos": 6,
        "xHT_mandante": 1.9,
        "xFT_mandante": 5.13,
        "xHT_visitante": 1.98,
        "xFT_visitante": 3.43,
        "posse_media": 59.7,
        "finalizacoes_media": 13.2,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 2.63,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1.03,
        "fator_defesa": 0.97,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Belgrano": {
        "n_jogos": 7,
        "xHT_mandante": 2.58,
        "xFT_mandante": 5.97,
        "xHT_visitante": 0.84,
        "xFT_visitante": 2.15,
        "posse_media": 53.4,
        "finalizacoes_media": 8.8,
        "tendencia_cantos": "decrescente_forte",
        "volatilidade": 3.22,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 1.2,
        "fator_defesa": 0.61,
        "alertas": [
          "FORMA_DESCENDENTE: volume de cantos caindo — cautela com OVER"
        ]
      },
      "Gimnasia L.P.": {
        "n_jogos": 6,
        "xHT_mandante": 2.65,
        "xFT_mandante": 6.32,
        "xHT_visitante": 1.75,
        "xFT_visitante": 3.69,
        "posse_media": 46,
        "finalizacoes_media": 10.3,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 1.88,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1.27,
        "fator_defesa": 1.05,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Racing Club": {
        "n_jogos": 8,
        "xHT_mandante": 1.81,
        "xFT_mandante": 4.33,
        "xHT_visitante": 1.7,
        "xFT_visitante": 3.66,
        "posse_media": 56.8,
        "finalizacoes_media": 14.5,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 1.8,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 0.87,
        "fator_defesa": 1.04,
        "alertas": [
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      },
      "Boca Juniors": {
        "n_jogos": 7,
        "xHT_mandante": 3.14,
        "xFT_mandante": 5.73,
        "xHT_visitante": 2.16,
        "xFT_visitante": 3.31,
        "posse_media": 65.4,
        "finalizacoes_media": 8.9,
        "tendencia_cantos": "crescente",
        "volatilidade": 3.51,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "fator_ataque": 1.15,
        "fator_defesa": 0.94,
        "alertas": []
      },
      "Dep. Riestra": {
        "n_jogos": 6,
        "xHT_mandante": 1.32,
        "xFT_mandante": 3.75,
        "xHT_visitante": 0.9,
        "xFT_visitante": 1.85,
        "posse_media": 47.7,
        "finalizacoes_media": 6.3,
        "tendencia_cantos": "estavel",
        "volatilidade": 2.31,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 0.75,
        "fator_defesa": 0.53,
        "alertas": [
          "JOGO_FECHADO_HT: raramente gera cantos no 1T"
        ]
      },
      "Argentinos Jrs": {
        "n_jogos": 8,
        "xHT_mandante": 2.4,
        "xFT_mandante": 7.23,
        "xHT_visitante": 2.47,
        "xFT_visitante": 4.4,
        "posse_media": 63.5,
        "finalizacoes_media": 13.4,
        "tendencia_cantos": "crescente",
        "volatilidade": 2.36,
        "perfil_ataque": "ABSOLUTO",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 1.45,
        "fator_defesa": 1.25,
        "alertas": [
          "MANDANTE_ABSOLUTO: posse dominante + alto volume de cantos"
        ]
      },
      "Sarmiento Junin": {
        "n_jogos": 6,
        "xHT_mandante": 3.02,
        "xFT_mandante": 4.86,
        "xHT_visitante": 0.75,
        "xFT_visitante": 2.25,
        "posse_media": 53.2,
        "finalizacoes_media": 9.8,
        "tendencia_cantos": "decrescente_forte",
        "volatilidade": 2.42,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "FORTALEZA",
        "fator_ataque": 0.98,
        "fator_defesa": 0.64,
        "alertas": [
          "FORMA_DESCENDENTE: volume de cantos caindo — cautela com OVER"
        ]
      },
      "Tigre": {
        "n_jogos": 7,
        "xHT_mandante": 1.06,
        "xFT_mandante": 3.2,
        "xHT_visitante": 2.6,
        "xFT_visitante": 4.92,
        "posse_media": 43.9,
        "finalizacoes_media": 10,
        "tendencia_cantos": "decrescente",
        "volatilidade": 2.56,
        "perfil_ataque": "REATIVO",
        "perfil_defesa_vis": "VULNERAVEL",
        "fator_ataque": 0.64,
        "fator_defesa": 1.4,
        "alertas": [
          "JOGO_FECHADO_HT: raramente gera cantos no 1T"
        ]
      },
      "Estudiantes Rio Cuarto": {
        "n_jogos": 7,
        "xHT_mandante": 1.51,
        "xFT_mandante": 5.19,
        "xHT_visitante": 4.3,
        "xFT_visitante": 6.6,
        "posse_media": 41.2,
        "finalizacoes_media": 9.6,
        "tendencia_cantos": "crescente_forte",
        "volatilidade": 2.88,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "SANGRA_CANTOS",
        "fator_ataque": 1.04,
        "fator_defesa": 1.87,
        "alertas": [
          "ALVO_OVER: sangra cantos como visitante — confrontos vs ele tendem a OVER",
          "FORMA_ASCENDENTE: cantos aumentando significativamente nos últimos jogos"
        ]
      }
    },
    "analise_under": {
      "gerado_em": "2026-04-09",
      "descricao": "Times com perfil UNDER — baixo volume de cantos em casa ou como visitante compacto",
      "mandantes_compactos": [
        {
          "time": "Tigre",
          "xHT_M": 1.06,
          "xFT_M": 3.2,
          "tendencia": "↘",
          "alerta": "EXTREMO — menor gerador de cantos em casa da liga",
          "p_under_HT": "100%",
          "p_under_FT": "100%"
        },
        {
          "time": "Central Cordoba",
          "xHT_M": 1.27,
          "xFT_M": 3.81,
          "tendencia": "↘↘",
          "alerta": "FORMA_DECRESCENTE — volume de cantos em queda acelerada",
          "p_under_HT": "99%",
          "p_under_FT": "100%"
        },
        {
          "time": "Ind. Rivadavia",
          "xHT_M": 1.11,
          "xFT_M": 4.04,
          "tendencia": "↘",
          "alerta": "PASSIVO — posse baixa 43%, raramente pressiona",
          "p_under_HT": "99%",
          "p_under_FT": "100%"
        },
        {
          "time": "Dep. Riestra",
          "xHT_M": 1.32,
          "xFT_M": 3.75,
          "tendencia": "↘",
          "alerta": "REATIVO — jogo fechado sistematicamente",
          "p_under_HT": "99%",
          "p_under_FT": "100%"
        },
        {
          "time": "Banfield",
          "xHT_M": 2.81,
          "xFT_M": 4.22,
          "tendencia": "↘",
          "alerta": "COMPACTO — abaixo da média em queda",
          "p_under_HT": "85%",
          "p_under_FT": "100%"
        },
        {
          "time": "Gimnasia Mendoza",
          "xHT_M": 2.15,
          "xFT_M": 4.46,
          "tendencia": "↘",
          "alerta": "COMPACTO — consistentemente fechado",
          "p_under_HT": "93%",
          "p_under_FT": "99%"
        }
      ],
      "visitantes_fortaleza": [
        {
          "time": "Dep. Riestra",
          "xHT_V": 0.9,
          "xFT_V": 1.85,
          "alerta": "FORTALEZA EXTREMA — concede menos cantos da liga como visitante"
        },
        {
          "time": "Lanus",
          "xHT_V": 0.71,
          "xFT_V": 2.18,
          "alerta": "FORTALEZA — bloco defensivo sólido fora de casa"
        },
        {
          "time": "Belgrano",
          "xHT_V": 0.84,
          "xFT_V": 2.15,
          "alerta": "COMPACTO — não sangra cantos fora"
        },
        {
          "time": "Velez Sarsfield",
          "xHT_V": 0.93,
          "xFT_V": 2.03,
          "alerta": "COMPACTO — poucos cantos concedidos fora"
        },
        {
          "time": "Sarmiento Junin",
          "xHT_V": 0.75,
          "xFT_V": 2.25,
          "alerta": "FORTALEZA — extremamente fechado fora"
        },
        {
          "time": "Newells Old Boys",
          "xHT_V": 0.75,
          "xFT_V": 2.56,
          "alerta": "COMPACTO — jogo fechado fora de casa"
        }
      ],
      "top_confrontos_under": [
        {
          "jogo": "Ind. Rivadavia vs Dep. Riestra",
          "xHT": 2.01,
          "xFT": 5.89,
          "sinal": "DUPLO UNDER",
          "forca": "EXTREMO"
        },
        {
          "jogo": "Central Cordoba vs Lanus",
          "xHT": 1.98,
          "xFT": 5.99,
          "sinal": "DUPLO UNDER",
          "forca": "EXTREMO"
        },
        {
          "jogo": "Central Cordoba vs Dep. Riestra",
          "xHT": 2.17,
          "xFT": 5.66,
          "sinal": "DUPLO UNDER",
          "forca": "EXTREMO"
        },
        {
          "jogo": "Ind. Rivadavia vs Belgrano",
          "xHT": 1.95,
          "xFT": 6.19,
          "sinal": "DUPLO UNDER",
          "forca": "FORTE"
        },
        {
          "jogo": "Dep. Riestra vs Sarmiento Junin",
          "xHT": 2.07,
          "xFT": 6,
          "sinal": "DUPLO UNDER",
          "forca": "FORTE"
        },
        {
          "jogo": "Tigre vs Dep. Riestra",
          "xHT": 1.96,
          "xFT": 5.05,
          "sinal": "JOGO TRUNCADO",
          "forca": "EXTREMO"
        },
        {
          "jogo": "Tigre vs Lanus",
          "xHT": 1.76,
          "xFT": 5.38,
          "sinal": "JOGO TRUNCADO",
          "forca": "EXTREMO"
        }
      ],
      "oportunidade_banca": "Banca precifica esses times pelo histórico de nome médio. Motor detecta padrão UNDER real por dados recentes. GAP de valor especialmente em Tigre, Central Córdoba e Dep. Riestra como mandantes."
    }
  },
  "MLS": {
    "liga": "MLS 2026",
    "gerado_em": "2026-04-09",
    "jogos_analisados": 89,
    "baseline": {
      "FT": 10.31,
      "HT": 4.78,
      "FT_mandante": 5.63,
      "FT_visitante": 4.69,
      "HT_mandante": 2.49,
      "HT_visitante": 2.28
    },
    "perfis_times": {
      "San Diego FC": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.89,
        "xFT_visitante": 4.3,
        "xHT_mandante": 2.68,
        "xHT_visitante": 2.55,
        "xContra_mandante": 4.43,
        "xContra_visitante": 5.02,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Real Salt Lake": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.89,
        "xFT_visitante": 4.8,
        "xHT_mandante": 2.68,
        "xHT_visitante": 2.55,
        "xContra_mandante": 4.8,
        "xContra_visitante": 5.77,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Portland Timbers": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 4.89,
        "xFT_visitante": 4.68,
        "xHT_mandante": 2.06,
        "xHT_visitante": 2.55,
        "xContra_mandante": 5.93,
        "xContra_visitante": 7.14,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Los Angeles Galaxy": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 5.79,
        "xFT_visitante": 5.35,
        "xHT_mandante": 2.27,
        "xHT_visitante": 2.49,
        "xContra_mandante": 3.71,
        "xContra_visitante": 4.59,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "COMPACTO",
        "alertas": []
      },
      "Minnesota United": {
        "jogos_mandante": 2,
        "jogos_visitante": 4,
        "xFT_mandante": 5.31,
        "xFT_visitante": 4.49,
        "xHT_mandante": 2.21,
        "xHT_visitante": 2.16,
        "xContra_mandante": 6.06,
        "xContra_visitante": 5.79,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Seattle Sounders": {
        "jogos_mandante": 1,
        "jogos_visitante": 5,
        "xFT_mandante": 6.02,
        "xFT_visitante": 4.44,
        "xHT_mandante": 2.58,
        "xHT_visitante": 2.44,
        "xContra_mandante": 4.57,
        "xContra_visitante": 7.11,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "FC Cincinnati": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.39,
        "xFT_visitante": 5.55,
        "xHT_mandante": 2.31,
        "xHT_visitante": 2.43,
        "xContra_mandante": 4.3,
        "xContra_visitante": 4.52,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "COMPACTO",
        "alertas": []
      },
      "CF Montreal": {
        "jogos_mandante": 0,
        "jogos_visitante": 6,
        "xFT_mandante": null,
        "xFT_visitante": 4.49,
        "xHT_mandante": null,
        "xHT_visitante": 2.4,
        "xContra_mandante": null,
        "xContra_visitante": 5.47,
        "perfil_ataque": "SEM_DADOS",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "New York City": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 5.13,
        "xFT_visitante": 4.2,
        "xHT_mandante": 2.27,
        "xHT_visitante": 1.91,
        "xContra_mandante": 4.49,
        "xContra_visitante": 4.88,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Inter Miami": {
        "jogos_mandante": 1,
        "jogos_visitante": 5,
        "xFT_mandante": 5.86,
        "xFT_visitante": 4.74,
        "xHT_mandante": 2.41,
        "xHT_visitante": 2.34,
        "xContra_mandante": 4.4,
        "xContra_visitante": 5.21,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Vancouver Whitecaps": {
        "jogos_mandante": 5,
        "jogos_visitante": 1,
        "xFT_mandante": 5.31,
        "xFT_visitante": 5.07,
        "xHT_mandante": 2.45,
        "xHT_visitante": 2.4,
        "xContra_mandante": 4.34,
        "xContra_visitante": 5.19,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "San Jose Earthquakes": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 8.24,
        "xFT_visitante": 4.2,
        "xHT_mandante": 3.05,
        "xHT_visitante": 1.91,
        "xContra_mandante": 3.94,
        "xContra_visitante": 6.02,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "PADRAO",
        "alertas": [
          "OVER_MANDANTE_FORTE"
        ]
      },
      "Austin FC": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 6.27,
        "xFT_visitante": 4.18,
        "xHT_mandante": 2.56,
        "xHT_visitante": 2.43,
        "xContra_mandante": 4.93,
        "xContra_visitante": 6.77,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Los Angeles FC": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 5.46,
        "xFT_visitante": 5.06,
        "xHT_mandante": 3.05,
        "xHT_visitante": 2.49,
        "xContra_mandante": 5.49,
        "xContra_visitante": 5.31,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "FC Dallas": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 4.91,
        "xFT_visitante": 4.78,
        "xHT_mandante": 2.16,
        "xHT_visitante": 2.2,
        "xContra_mandante": 4.6,
        "xContra_visitante": 5.45,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Houston Dynamo": {
        "jogos_mandante": 4,
        "jogos_visitante": 1,
        "xFT_mandante": 6.02,
        "xFT_visitante": 5.24,
        "xHT_mandante": 2.61,
        "xHT_visitante": 2.57,
        "xContra_mandante": 5.05,
        "xContra_visitante": 5.69,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Sporting Kansas City": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.02,
        "xFT_visitante": 3.8,
        "xHT_mandante": 2.31,
        "xHT_visitante": 2.05,
        "xContra_mandante": 4.68,
        "xContra_visitante": 7.52,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Colorado Rapids": {
        "jogos_mandante": 2,
        "jogos_visitante": 4,
        "xFT_mandante": 6.02,
        "xFT_visitante": 4.38,
        "xHT_mandante": 3.21,
        "xHT_visitante": 1.82,
        "xContra_mandante": 4.92,
        "xContra_visitante": 5.91,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "St. Louis City": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 6.02,
        "xFT_visitante": 4.8,
        "xHT_mandante": 2.18,
        "xHT_visitante": 2.3,
        "xContra_mandante": 3.55,
        "xContra_visitante": 5.27,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "New England Revolution": {
        "jogos_mandante": 2,
        "jogos_visitante": 3,
        "xFT_mandante": 4.31,
        "xFT_visitante": 4.3,
        "xHT_mandante": 2.07,
        "xHT_visitante": 1.8,
        "xContra_mandante": 4.49,
        "xContra_visitante": 5.39,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Atlanta Utd": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 4.79,
        "xFT_visitante": 4.2,
        "xHT_mandante": 2.39,
        "xHT_visitante": 1.91,
        "xContra_mandante": 4.83,
        "xContra_visitante": 5.74,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "DC United": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.39,
        "xFT_visitante": 4.55,
        "xHT_mandante": 2.06,
        "xHT_visitante": 2.18,
        "xContra_mandante": 4.05,
        "xContra_visitante": 5.64,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Charlotte": {
        "jogos_mandante": 4,
        "jogos_visitante": 2,
        "xFT_mandante": 5.68,
        "xFT_visitante": 4.2,
        "xHT_mandante": 2.39,
        "xHT_visitante": 2.06,
        "xContra_mandante": 5.16,
        "xContra_visitante": 5.45,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "New York Red Bulls": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.89,
        "xFT_visitante": 6.43,
        "xHT_mandante": 2.93,
        "xHT_visitante": 3.43,
        "xContra_mandante": 4.93,
        "xContra_visitante": 5.02,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Nashville SC": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.14,
        "xFT_visitante": 4.05,
        "xHT_mandante": 2.81,
        "xHT_visitante": 2.05,
        "xContra_mandante": 4.05,
        "xContra_visitante": 4.89,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Orlando City": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 4.89,
        "xFT_visitante": 4.68,
        "xHT_mandante": 1.81,
        "xHT_visitante": 1.93,
        "xContra_mandante": 6.3,
        "xContra_visitante": 5.77,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Philadelphia Union": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 6.27,
        "xFT_visitante": 5.18,
        "xHT_mandante": 2.68,
        "xHT_visitante": 1.8,
        "xContra_mandante": 3.8,
        "xContra_visitante": 4.89,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Chicago Fire": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 5.27,
        "xFT_visitante": 4.18,
        "xHT_mandante": 2.31,
        "xHT_visitante": 2.05,
        "xContra_mandante": 4.3,
        "xContra_visitante": 5.52,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Toronto FC": {
        "jogos_mandante": 3,
        "jogos_visitante": 3,
        "xFT_mandante": 6.27,
        "xFT_visitante": 4.8,
        "xHT_mandante": 2.68,
        "xHT_visitante": 2.3,
        "xContra_mandante": 5.68,
        "xContra_visitante": 5.52,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Columbus Crew": {
        "jogos_mandante": 2,
        "jogos_visitante": 4,
        "xFT_mandante": 5.88,
        "xFT_visitante": 5.6,
        "xHT_mandante": 3.21,
        "xHT_visitante": 2.82,
        "xContra_mandante": 4.2,
        "xContra_visitante": 5.79,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      }
    },
    "analise_over": {
      "times_explosivos": [
        {
          "time": "San Jose Earthquakes",
          "alertas": [
            "OVER_MANDANTE_FORTE"
          ],
          "xFT_M": 8.24,
          "xFT_V": 4.2
        }
      ]
    },
    "analise_under": {
      "mandantes_compactos": [
        {
          "time": "New England Revolution",
          "xFT_M": 4.31
        }
      ],
      "visitantes_fortaleza": []
    }
  },
  "BR": {
    "liga": "Brasileirão Série A 2026",
    "gerado_em": "2026-04-09",
    "jogos_analisados": 97,
    "baseline": {
      "FT": 10.26,
      "HT": 4.57,
      "FT_mandante": 5.55,
      "FT_visitante": 4.71,
      "HT_mandante": 2.42,
      "HT_visitante": 2.14
    },
    "perfis_times": {
      "Vitória": {
        "jogos_mandante": 4,
        "jogos_visitante": 5,
        "xFT_mandante": 5.19,
        "xFT_visitante": 4.26,
        "xHT_mandante": 1.9,
        "xHT_visitante": 1.77,
        "xContra_mandante": 4.62,
        "xContra_visitante": 5.87,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Remo": {
        "jogos_mandante": 4,
        "jogos_visitante": 6,
        "xFT_mandante": 5.53,
        "xFT_visitante": 4.05,
        "xHT_mandante": 2.23,
        "xHT_visitante": 2.07,
        "xContra_mandante": 5.84,
        "xContra_visitante": 5.79,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Internacional": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 6.97,
        "xFT_visitante": 6.46,
        "xHT_mandante": 3.21,
        "xHT_visitante": 2.97,
        "xContra_mandante": 4.46,
        "xContra_visitante": 5.07,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Athletico-PR": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.57,
        "xFT_visitante": 4.16,
        "xHT_mandante": 2.91,
        "xHT_visitante": 1.67,
        "xContra_mandante": 4.36,
        "xContra_visitante": 5.47,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Coritiba": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 4.17,
        "xFT_visitante": 4.26,
        "xHT_mandante": 1.61,
        "xHT_visitante": 1.77,
        "xContra_mandante": 5.56,
        "xContra_visitante": 6.77,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Red Bull Bragantino": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.97,
        "xFT_visitante": 5.06,
        "xHT_mandante": 2.61,
        "xHT_visitante": 2.27,
        "xContra_mandante": 5.76,
        "xContra_visitante": 5.47,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Atlético-MG": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 4.67,
        "xFT_visitante": 5.36,
        "xHT_mandante": 2.31,
        "xHT_visitante": 1.77,
        "xContra_mandante": 5.86,
        "xContra_visitante": 5.37,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Palmeiras": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.47,
        "xFT_visitante": 4.56,
        "xHT_mandante": 2.51,
        "xHT_visitante": 2.07,
        "xContra_mandante": 4.56,
        "xContra_visitante": 7.47,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Fluminense": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.27,
        "xFT_visitante": 5.76,
        "xHT_mandante": 2.41,
        "xHT_visitante": 3.37,
        "xContra_mandante": 4.26,
        "xContra_visitante": 5.27,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Grêmio": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.37,
        "xFT_visitante": 4.16,
        "xHT_mandante": 2.71,
        "xHT_visitante": 1.77,
        "xContra_mandante": 4.26,
        "xContra_visitante": 4.57,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Corinthians": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.57,
        "xFT_visitante": 4.66,
        "xHT_mandante": 2.21,
        "xHT_visitante": 1.77,
        "xContra_mandante": 4.46,
        "xContra_visitante": 5.87,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Bahia": {
        "jogos_mandante": 5,
        "jogos_visitante": 4,
        "xFT_mandante": 5.77,
        "xFT_visitante": 4.84,
        "xHT_mandante": 2.91,
        "xHT_visitante": 2.75,
        "xContra_mandante": 4.36,
        "xContra_visitante": 5.75,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Chapecoense": {
        "jogos_mandante": 6,
        "jogos_visitante": 3,
        "xFT_mandante": 5.52,
        "xFT_visitante": 4.19,
        "xHT_mandante": 1.74,
        "xHT_visitante": 1.84,
        "xContra_mandante": 5.05,
        "xContra_visitante": 7.09,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Santos": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.37,
        "xFT_visitante": 5.36,
        "xHT_mandante": 2.51,
        "xHT_visitante": 3.07,
        "xContra_mandante": 4.76,
        "xContra_visitante": 5.07,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "São Paulo": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 5.97,
        "xFT_visitante": 5.06,
        "xHT_mandante": 2.41,
        "xHT_visitante": 2.37,
        "xContra_mandante": 4.36,
        "xContra_visitante": 4.97,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Flamengo": {
        "jogos_mandante": 4,
        "jogos_visitante": 5,
        "xFT_mandante": 4.97,
        "xFT_visitante": 4.26,
        "xHT_mandante": 2.35,
        "xHT_visitante": 1.97,
        "xContra_mandante": 4.73,
        "xContra_visitante": 5.17,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Mirassol": {
        "jogos_mandante": 5,
        "jogos_visitante": 4,
        "xFT_mandante": 6.67,
        "xFT_visitante": 4.95,
        "xHT_mandante": 2.41,
        "xHT_visitante": 1.86,
        "xContra_mandante": 4.36,
        "xContra_visitante": 4.41,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "COMPACTO",
        "alertas": []
      },
      "Vasco": {
        "jogos_mandante": 6,
        "jogos_visitante": 4,
        "xFT_mandante": 6.07,
        "xFT_visitante": 4.28,
        "xHT_mandante": 3.1,
        "xHT_visitante": 2.08,
        "xContra_mandante": 3.78,
        "xContra_visitante": 5.08,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Botafogo": {
        "jogos_mandante": 3,
        "jogos_visitante": 6,
        "xFT_mandante": 4.34,
        "xFT_visitante": 3.87,
        "xHT_mandante": 1.89,
        "xHT_visitante": 1.43,
        "xContra_mandante": 5.32,
        "xContra_visitante": 5.16,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Cruzeiro": {
        "jogos_mandante": 5,
        "jogos_visitante": 5,
        "xFT_mandante": 6.07,
        "xFT_visitante": 4.76,
        "xHT_mandante": 2.31,
        "xHT_visitante": 2.27,
        "xContra_mandante": 3.86,
        "xContra_visitante": 5.37,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      }
    },
    "analise_over": {
      "times_explosivos": []
    },
    "analise_under": {
      "mandantes_compactos": [
        {
          "time": "Coritiba",
          "xFT_M": 4.17
        },
        {
          "time": "Botafogo",
          "xFT_M": 4.34
        }
      ],
      "visitantes_fortaleza": []
    }
  },
  "USL": {
    "liga": "USL Championship 2026",
    "gerado_em": "2026-04-09",
    "jogos_analisados": 57,
    "fonte": "backup_v5(45)+injecao_v4(12)",
    "baseline": {
      "FT": 9.16,
      "HT": 4.4,
      "FT_mandante": 4.95,
      "FT_visitante": 4.21,
      "HT_mandante": 2.51,
      "HT_visitante": 1.89
    },
    "calibracao_teacher": {
    "versao": "Volvo Test v2 (Zona Neutra Poisson)",
    "rodada_validada": 2,
    "data_referencia": "2026-04-08",
    "jogos_validados": 11,
    "media_cantos_ht_real": 4.36,
    "media_cantos_ft_real": 9.73,
    "taxa_over_3_5_ht": 63.6,
    "taxa_over_4_5_ht": 45.5,
    "taxa_over_5_5_ht": 18.2,
    "taxa_over_8_5_ft": 63.6,
    "taxa_over_9_5_ft": 54.5,
    "taxa_over_10_5_ft": 45.5,
    "taxa_over_11_5_ft": 36.4,
    "min_cantos_ft": 5,
    "max_cantos_ft": 13,
    "min_cantos_ht": 2,
    "max_cantos_ht": 8,
    "insights": [
        "Liga de alto volume FT: média 9.73 cantos — Over 9.5 FT acertou 54.5% dos jogos",
        "Over 3.5 HT com taxa elevada de 63.6% — mercado HT potencialmente subavaliado"
    ],
    "jogos_destaque": [
        {
            "mandante": "Monterey Bay",
            "visitante": "San Antonio",
            "cantos_ht": 8,
            "cantos_ft": 11
        },
        {
            "mandante": "Sacramento Republic",
            "visitante": "Phoenix Rising",
            "cantos_ht": 6,
            "cantos_ft": 12
        },
        {
            "mandante": "Colorado Springs",
            "visitante": "Lexington",
            "cantos_ht": 5,
            "cantos_ft": 13
        },
        {
            "mandante": "Louisville City",
            "visitante": "Charleston",
            "cantos_ht": 3,
            "cantos_ft": 12
        },
        {
            "mandante": "Miami FC",
            "visitante": "Hartford Athletic",
            "cantos_ht": 3,
            "cantos_ft": 12
        }
    ]
},
    "perfis_times": {
      "San Antonio": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 4.72,
        "xFT_visitante": 4.01,
        "xHT_mandante": 2.57,
        "xHT_visitante": 1.78,
        "xContra_mandante": 4.51,
        "xContra_visitante": 5.82,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Lexington": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 3.97,
        "xFT_visitante": 4.86,
        "xHT_mandante": 1.82,
        "xHT_visitante": 1.92,
        "xContra_mandante": 4.01,
        "xContra_visitante": 5.25,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Louisville City": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 7.22,
        "xFT_visitante": 5.29,
        "xHT_mandante": 3.19,
        "xHT_visitante": 2.78,
        "xContra_mandante": 3.01,
        "xContra_visitante": 4.25,
        "perfil_ataque": "DOMINANTE",
        "perfil_defesa_vis": "PADRAO",
        "alertas": [
          "OVER_MANDANTE_FORTE"
        ]
      },
      "Charleston": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 5.82,
        "xFT_visitante": 4.01,
        "xHT_mandante": 3.08,
        "xHT_visitante": 1.64,
        "xContra_mandante": 3.72,
        "xContra_visitante": 6.25,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Pittsburgh": {
        "jogos_mandante": 1,
        "jogos_visitante": 4,
        "xFT_mandante": 4.79,
        "xFT_visitante": 4.01,
        "xHT_mandante": 2.76,
        "xHT_visitante": 1.72,
        "xContra_mandante": 4.18,
        "xContra_visitante": 4.42,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Sporting Jax": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 5.22,
        "xFT_visitante": 3.58,
        "xHT_mandante": 2.32,
        "xHT_visitante": 1.35,
        "xContra_mandante": 4.26,
        "xContra_visitante": 4.68,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Hartford Athletic": {
        "jogos_mandante": 1,
        "jogos_visitante": 4,
        "xFT_mandante": 4.96,
        "xFT_visitante": 4.56,
        "xHT_mandante": 2.42,
        "xHT_visitante": 2.05,
        "xContra_mandante": 3.84,
        "xContra_visitante": 5.86,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Birmingham": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 4.82,
        "xFT_visitante": 4.15,
        "xHT_mandante": 2.79,
        "xHT_visitante": 1.92,
        "xContra_mandante": 4.01,
        "xContra_visitante": 5.25,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Tampa Bay": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 5.25,
        "xFT_visitante": 4.29,
        "xHT_mandante": 2.65,
        "xHT_visitante": 1.92,
        "xContra_mandante": 3.86,
        "xContra_visitante": 4.11,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Phoenix Rising": {
        "jogos_mandante": 2,
        "jogos_visitante": 3,
        "xFT_mandante": 4.53,
        "xFT_visitante": 5.01,
        "xHT_mandante": 1.93,
        "xHT_visitante": 1.81,
        "xContra_mandante": 4.01,
        "xContra_visitante": 4.09,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "El Paso": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 4.11,
        "xFT_visitante": 4.29,
        "xHT_mandante": 2.22,
        "xHT_visitante": 2.35,
        "xContra_mandante": 4.58,
        "xContra_visitante": 5.39,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Colorado Springs": {
        "jogos_mandante": 2,
        "jogos_visitante": 3,
        "xFT_mandante": 5.82,
        "xFT_visitante": 4.51,
        "xHT_mandante": 3.08,
        "xHT_visitante": 2.56,
        "xContra_mandante": 4.15,
        "xContra_visitante": 4.84,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Sacramento Republic": {
        "jogos_mandante": 4,
        "jogos_visitante": 1,
        "xFT_mandante": 4.64,
        "xFT_visitante": 3.84,
        "xHT_mandante": 2.39,
        "xHT_visitante": 1.58,
        "xContra_mandante": 4.01,
        "xContra_visitante": 4.46,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "FC Tulsa": {
        "jogos_mandante": 3,
        "jogos_visitante": 1,
        "xFT_mandante": 5.09,
        "xFT_visitante": 3.51,
        "xHT_mandante": 2.19,
        "xHT_visitante": 1.58,
        "xContra_mandante": 4.51,
        "xContra_visitante": 4.46,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Orange County SC": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 4.59,
        "xFT_visitante": 3.72,
        "xHT_mandante": 2.32,
        "xHT_visitante": 1.78,
        "xContra_mandante": 4.51,
        "xContra_visitante": 4.68,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Las Vegas Lights": {
        "jogos_mandante": 1,
        "jogos_visitante": 4,
        "xFT_mandante": 4.62,
        "xFT_visitante": 4.78,
        "xHT_mandante": 2.42,
        "xHT_visitante": 2.05,
        "xContra_mandante": 4.34,
        "xContra_visitante": 4.3,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Monterey Bay": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 5.22,
        "xFT_visitante": 3.72,
        "xHT_mandante": 2.57,
        "xHT_visitante": 1.64,
        "xContra_mandante": 3.76,
        "xContra_visitante": 4.96,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Oakland Roots": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 4.39,
        "xFT_visitante": 4.01,
        "xHT_mandante": 2.08,
        "xHT_visitante": 1.92,
        "xContra_mandante": 4.58,
        "xContra_visitante": 4.39,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Brooklyn": {
        "jogos_mandante": 3,
        "jogos_visitante": 2,
        "xFT_mandante": 5.59,
        "xFT_visitante": 3.44,
        "xHT_mandante": 2.82,
        "xHT_visitante": 1.64,
        "xContra_mandante": 4.88,
        "xContra_visitante": 4.96,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Indy Eleven": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 4.53,
        "xFT_visitante": 4.01,
        "xHT_mandante": 2.51,
        "xHT_visitante": 1.92,
        "xContra_mandante": 5.44,
        "xContra_visitante": 4.96,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Loudoun": {
        "jogos_mandante": 3,
        "jogos_visitante": 1,
        "xFT_mandante": 4.34,
        "xFT_visitante": 4.01,
        "xHT_mandante": 2.69,
        "xHT_visitante": 1.91,
        "xContra_mandante": 4.38,
        "xContra_visitante": 5.46,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Rhode Island": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 4.53,
        "xFT_visitante": 4.15,
        "xHT_mandante": 2.36,
        "xHT_visitante": 1.92,
        "xContra_mandante": 3.29,
        "xContra_visitante": 4.96,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "Miami FC": {
        "jogos_mandante": 2,
        "jogos_visitante": 3,
        "xFT_mandante": 3.96,
        "xFT_visitante": 3.76,
        "xHT_mandante": 1.93,
        "xHT_visitante": 1.56,
        "xContra_mandante": 5.15,
        "xContra_visitante": 6.22,
        "perfil_ataque": "PASSIVO",
        "perfil_defesa_vis": "VULNERAVEL",
        "alertas": []
      },
      "Detroit": {
        "jogos_mandante": 2,
        "jogos_visitante": 2,
        "xFT_mandante": 5.53,
        "xFT_visitante": 4.86,
        "xHT_mandante": 2.79,
        "xHT_visitante": 2.35,
        "xContra_mandante": 4.01,
        "xContra_visitante": 4.68,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      },
      "New Mexico": {
        "jogos_mandante": 1,
        "jogos_visitante": 3,
        "xFT_mandante": 5.29,
        "xFT_visitante": 4.38,
        "xHT_mandante": 2.92,
        "xHT_visitante": 1.56,
        "xContra_mandante": 4.34,
        "xContra_visitante": 4.97,
        "perfil_ataque": "PADRAO",
        "perfil_defesa_vis": "PADRAO",
        "alertas": []
      }
    },
    "analise_over": {
      "times_explosivos": [
        {
          "time": "Louisville City",
          "alertas": [
            "OVER_MANDANTE_FORTE"
          ],
          "xFT_M": 7.22,
          "xFT_V": 5.29
        }
      ]
    },
    "analise_under": {
      "mandantes_compactos": [],
      "visitantes_fortaleza": []
    }
  }
};

// Helper: busca perfil de um time em uma liga
window.getPerfilTime = function(liga, nomeTime) {
  const mem = window.MEMORIA_QUALITATIVA[liga.toUpperCase()];
  if (!mem) return null;
  const perfis = mem.perfis_times || {};
  // Busca exata primeiro, depois parcial
  if (perfis[nomeTime]) return perfis[nomeTime];
  const key = Object.keys(perfis).find(k => 
    k.toLowerCase().includes(nomeTime.toLowerCase()) || 
    nomeTime.toLowerCase().includes(k.toLowerCase())
  );
  return key ? perfis[key] : null;
};

// Helper: retorna alertas combinados de um confronto
window.getAlertasConfrontoQualit = function(liga, mandante, visitante) {
  const pm = window.getPerfilTime(liga, mandante);
  const pv = window.getPerfilTime(liga, visitante);
  const mem = window.MEMORIA_QUALITATIVA[liga.toUpperCase()];
  const baseline = mem?.baseline || {};
  
  const alertas = [];
  
  if (pm) {
    pm.alertas?.forEach(a => alertas.push({ time: mandante, papel: 'MANDANTE', alerta: a }));
    if (pm.perfil_ataque === 'ABSOLUTO' || pm.perfil_ataque === 'DOMINANTE')
      alertas.push({ time: mandante, papel: 'MANDANTE', alerta: 'ATAQUE_' + pm.perfil_ataque });
  }
  if (pv) {
    pv.alertas?.forEach(a => alertas.push({ time: visitante, papel: 'VISITANTE', alerta: a }));
    if (pv.perfil_defesa_vis === 'SANGRA_CANTOS' || pv.perfil_defesa_vis === 'VULNERAVEL')
      alertas.push({ time: visitante, papel: 'VISITANTE', alerta: 'DEFESA_' + pv.perfil_defesa_vis });
  }
  
  // Sinais UNDER: mandante compacto + visitante fortaleza
  const isUnderM = pm?.alertas?.includes('UNDER_MANDANTE');
  const isUnderV = pv?.alertas?.includes('UNDER_VISITANTE');
  if (isUnderM && isUnderV)
    alertas.push({ time: mandante + ' x ' + visitante, papel: 'CONFRONTO', alerta: 'DUPLO_UNDER_SINAL' });
  
  // Projeção qualitativa de FT
  const xFT_qual = (pm?.xFT_mandante || baseline.FT_mandante || 0) + 
                   (pv?.xFT_visitante || baseline.FT_visitante || 0);
  
  return {
    alertas,
    xFT_qualitativo: +xFT_qual.toFixed(2),
    baseline_liga: baseline.FT || 0,
    perfil_mandante: pm,
    perfil_visitante: pv
  };
};
