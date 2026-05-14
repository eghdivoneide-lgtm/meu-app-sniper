// DNA SNIPER v2 — EDS Especialista em Cantos
// Gerado: 2026-04-22 | 223 times | 10 ligas
// Comportamento: por resultado FT (ganhou/perdeu/empatou) — mais robusto que HT placar
// Módulos: Base | VED | Conversão | Dissociação | Pressão | Comportamento Resultado | Adversário Tier | Consistência | DNA Temporal | Over Rates
window.DNA_SNIPER = {
  "BR::Vitória": {
    "time": "Vitória",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.9,
        "cc": 5.5,
        "saldo_cantos": -1.6,
        "gp": 1.1,
        "gc": 1.4,
        "saldo_gols": -0.3
      },
      "casa": {
        "cp": 4.0,
        "cc": 4.8,
        "saldo_cantos": -0.8,
        "gp": 1.6,
        "gc": 0.4,
        "saldo_gols": 1.2
      },
      "fora": {
        "cp": 3.8,
        "cc": 6.2,
        "saldo_cantos": -2.4,
        "gp": 0.6,
        "gc": 2.4,
        "saldo_gols": -1.8
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.282,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 39,
      "total_gols": 11
    },
    "dissociacao": {
      "indice": -1.3,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.32,
      "saldo_gols_norm": -0.3
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.25,
        "avg_cc": 5.5,
        "delta_cp": -0.65,
        "delta_cc": 0.0,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 5.5,
        "avg_cc": 4.25,
        "delta_cp": 1.6,
        "delta_cc": -1.25,
        "n": 4
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": -1.9,
        "n": 2
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.67,
        "cc_avg": 5.33,
        "saldo": -1.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 5.5,
        "saldo": -1.5
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 1.91,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.31,
      "avg_ht_cp": 1.2,
      "avg_ft_cp": 3.9,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.3
    },
    "split_ctx": 0.2
  },
  "BR::Remo": {
    "time": "Remo",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 5,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.92,
        "cc": 6.0,
        "saldo_cantos": -2.08,
        "gp": 1.08,
        "gc": 1.83,
        "saldo_gols": -0.75
      },
      "casa": {
        "cp": 5.0,
        "cc": 7.0,
        "saldo_cantos": -2.0,
        "gp": 1.6,
        "gc": 1.4,
        "saldo_gols": 0.2
      },
      "fora": {
        "cp": 3.14,
        "cc": 5.29,
        "saldo_cantos": -2.15,
        "gp": 0.71,
        "gc": 2.14,
        "saldo_gols": -1.43
      }
    },
    "ved": {
      "geral": {
        "V": 0.167,
        "E": 0.167,
        "D": 0.667,
        "tv": 0.167
      },
      "casa": {
        "V": 0.2,
        "E": 0.2,
        "D": 0.6,
        "tv": 0.2
      },
      "fora": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.277,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": -1.32,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.41,
      "saldo_gols_norm": -0.75
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 9.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 3.33,
        "avg_cc": 4.5,
        "delta_cp": -0.59,
        "delta_cc": -1.5,
        "n": 6
      },
      "empatou": {
        "avg_cp": 4.4,
        "delta_cp": 0.48,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.8,
        "cc_avg": 6.6,
        "saldo": -1.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 3.5,
        "cc_avg": 5.25,
        "saldo": -1.75
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 1.98,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 1.75,
      "avg_ft_cp": 3.92,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.58,
      "taxa_ht_4": 0.42
    },
    "split_ctx": 1.86
  },
  "BR::Palmeiras": {
    "time": "Palmeiras",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 6,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.42,
        "cc": 6.17,
        "saldo_cantos": -0.75,
        "gp": 1.83,
        "gc": 0.83,
        "saldo_gols": 1.0
      },
      "casa": {
        "cp": 6.0,
        "cc": 4.17,
        "saldo_cantos": 1.83,
        "gp": 2.17,
        "gc": 0.67,
        "saldo_gols": 1.5
      },
      "fora": {
        "cp": 4.83,
        "cc": 8.17,
        "saldo_cantos": -3.34,
        "gp": 1.5,
        "gc": 1.0,
        "saldo_gols": 0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.338,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 65,
      "total_gols": 22
    },
    "dissociacao": {
      "indice": -1.75,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.15,
      "saldo_gols_norm": 1.0
    },
    "pressao": {
      "ratio_liga": 1.08,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.11,
        "avg_cc": 6.44,
        "delta_cp": -0.31,
        "delta_cc": 0.27,
        "n": 9
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 9.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": 1.58,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.4,
        "cc_avg": 10.0,
        "saldo": -6.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 3.33,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.57,
      "cp_std": 2.31,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.67,
      "avg_ft_cp": 5.42,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.75,
      "taxa_ht_4": 0.42
    },
    "split_ctx": 1.17
  },
  "BR::Flamengo": {
    "time": "Flamengo",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 10,
      "casa": 4,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.8,
        "cc": 5.1,
        "saldo_cantos": -1.3,
        "gp": 1.8,
        "gc": 1.0,
        "saldo_gols": 0.8
      },
      "casa": {
        "cp": 4.25,
        "cc": 4.75,
        "saldo_cantos": -0.5,
        "gp": 2.25,
        "gc": 0.5,
        "saldo_gols": 1.75
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.33,
        "saldo_cantos": -1.83,
        "gp": 1.5,
        "gc": 1.33,
        "saldo_gols": 0.17
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.474,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 38,
      "total_gols": 18
    },
    "dissociacao": {
      "indice": -2.1,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.26,
      "saldo_gols_norm": 0.8
    },
    "pressao": {
      "ratio_liga": 0.76,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.5,
        "avg_cc": 5.5,
        "delta_cp": -0.3,
        "delta_cc": 0.4,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 5.5,
        "avg_cc": 4.5,
        "delta_cp": 1.7,
        "delta_cc": -0.6,
        "n": 2
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": -0.8,
        "n": 2
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.6,
        "cc_avg": 5.4,
        "saldo": -1.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 3.67,
        "saldo": 0.66
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 1.81,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.9,
      "avg_ft_cp": 3.8,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.3,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 0.75
  },
  "BR::Bahia": {
    "time": "Bahia",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 5.27,
        "saldo_cantos": -0.27,
        "gp": 1.36,
        "gc": 1.09,
        "saldo_gols": 0.27
      },
      "casa": {
        "cp": 6.0,
        "cc": 4.0,
        "saldo_cantos": 2.0,
        "gp": 1.6,
        "gc": 0.8,
        "saldo_gols": 0.8
      },
      "fora": {
        "cp": 4.17,
        "cc": 6.33,
        "saldo_cantos": -2.16,
        "gp": 1.17,
        "gc": 1.33,
        "saldo_gols": -0.16
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.091,
        "D": 0.364,
        "tv": 0.545
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.273,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 55,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -0.54,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.05,
      "saldo_gols_norm": 0.27
    },
    "pressao": {
      "ratio_liga": 1.0,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.17,
        "avg_cc": 5.83,
        "delta_cp": -0.83,
        "delta_cc": 0.56,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 5.67,
        "avg_cc": 5.33,
        "delta_cp": 0.67,
        "delta_cc": 0.06,
        "n": 3
      },
      "empatou": {
        "avg_cp": 6.5,
        "delta_cp": 1.5,
        "n": 2
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 6.75,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.0,
        "cc_avg": 4.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 2.61,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.62,
      "avg_ht_cp": 3.09,
      "avg_ft_cp": 5.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.73,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 1.83
  },
  "BR::Atlético-MG": {
    "time": "Atlético-MG",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.09,
        "cc": 6.0,
        "saldo_cantos": -0.91,
        "gp": 1.27,
        "gc": 1.18,
        "saldo_gols": 0.09
      },
      "casa": {
        "cp": 3.8,
        "cc": 7.0,
        "saldo_cantos": -3.2,
        "gp": 1.8,
        "gc": 1.2,
        "saldo_gols": 0.6
      },
      "fora": {
        "cp": 6.17,
        "cc": 5.17,
        "saldo_cantos": 1.0,
        "gp": 0.83,
        "gc": 1.17,
        "saldo_gols": -0.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.455,
        "E": 0.0,
        "D": 0.545,
        "tv": 0.455
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.25,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 56,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -1.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.18,
      "saldo_gols_norm": 0.09
    },
    "pressao": {
      "ratio_liga": 1.02,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 2.75,
        "avg_cc": 7.5,
        "delta_cp": -2.34,
        "delta_cc": 1.5,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 6.8,
        "avg_cc": 4.8,
        "delta_cp": 1.71,
        "delta_cc": -1.2,
        "n": 5
      },
      "empatou": {
        "avg_cp": 5.5,
        "delta_cp": 0.41,
        "n": 2
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 5.75,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 5.33,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 3.39,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.82,
      "avg_ft_cp": 5.09,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.73,
      "taxa_ht_4": 0.27
    },
    "split_ctx": -2.37
  },
  "BR::Grêmio": {
    "time": "Grêmio",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.18,
        "cc": 4.09,
        "saldo_cantos": 0.09,
        "gp": 1.27,
        "gc": 1.27,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.2,
        "cc": 3.8,
        "saldo_cantos": 1.4,
        "gp": 2.0,
        "gc": 1.0,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 3.33,
        "cc": 4.33,
        "saldo_cantos": -1.0,
        "gp": 0.67,
        "gc": 1.5,
        "saldo_gols": -0.83
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.091,
        "D": 0.364,
        "tv": 0.545
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.304,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 46,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": 0.09,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.02,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.67,
        "avg_cc": 3.33,
        "delta_cp": 0.49,
        "delta_cc": -0.76,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 3.25,
        "avg_cc": 3.5,
        "delta_cp": -0.93,
        "delta_cc": -0.59,
        "n": 4
      },
      "empatou": {
        "avg_cp": 4.75,
        "delta_cp": 0.57,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 3.5,
        "saldo": -0.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.4,
        "cc_avg": 3.4,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 1.94,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 4.18,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.27
    },
    "split_ctx": 1.87
  },
  "BR::Mirassol": {
    "time": "Mirassol",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 6.36,
        "cc": 4.27,
        "saldo_cantos": 2.09,
        "gp": 1.18,
        "gc": 1.55,
        "saldo_gols": -0.37
      },
      "casa": {
        "cp": 7.83,
        "cc": 4.0,
        "saldo_cantos": 3.83,
        "gp": 1.17,
        "gc": 1.5,
        "saldo_gols": -0.33
      },
      "fora": {
        "cp": 4.6,
        "cc": 4.6,
        "saldo_cantos": 0.0,
        "gp": 1.2,
        "gc": 1.6,
        "saldo_gols": -0.4
      }
    },
    "ved": {
      "geral": {
        "V": 0.636,
        "E": 0.182,
        "D": 0.182,
        "tv": 0.636
      },
      "casa": {
        "V": 0.667,
        "E": 0.167,
        "D": 0.167,
        "tv": 0.667
      },
      "fora": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.186,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 70,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": 2.45,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.42,
      "saldo_gols_norm": -0.37
    },
    "pressao": {
      "ratio_liga": 1.27,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.5,
        "avg_cc": 8.0,
        "delta_cp": -2.86,
        "delta_cc": 3.73,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 7.33,
        "avg_cc": 3.33,
        "delta_cp": 0.97,
        "delta_cc": -0.94,
        "n": 6
      },
      "empatou": {
        "avg_cp": 6.33,
        "delta_cp": -0.03,
        "n": 3
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 5.5,
        "cc_avg": 5.75,
        "saldo": -0.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.0,
        "cc_avg": 3.0,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 2.8,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.27,
      "avg_ht_cp": 1.73,
      "avg_ft_cp": 6.36,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 3.23
  },
  "BR::Cruzeiro": {
    "time": "Cruzeiro",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 7,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.25,
        "cc": 4.08,
        "saldo_cantos": 1.17,
        "gp": 1.33,
        "gc": 1.75,
        "saldo_gols": -0.42
      },
      "casa": {
        "cp": 5.57,
        "cc": 3.29,
        "saldo_cantos": 2.28,
        "gp": 1.71,
        "gc": 1.0,
        "saldo_gols": 0.71
      },
      "fora": {
        "cp": 4.8,
        "cc": 5.2,
        "saldo_cantos": -0.4,
        "gp": 0.8,
        "gc": 2.8,
        "saldo_gols": -2.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "casa": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.254,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 63,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": 1.59,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.23,
      "saldo_gols_norm": -0.42
    },
    "pressao": {
      "ratio_liga": 1.05,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.67,
        "avg_cc": 4.67,
        "delta_cp": -1.58,
        "delta_cc": 0.59,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 7.2,
        "avg_cc": 3.8,
        "delta_cp": 1.95,
        "delta_cc": -0.28,
        "n": 5
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -1.25,
        "n": 4
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 4.75,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 7.75,
        "cc_avg": 3.75,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.44,
      "cp_std": 2.93,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.33,
      "avg_ft_cp": 5.25,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.42
    },
    "split_ctx": 0.77
  },
  "BR::Internacional": {
    "time": "Internacional",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 7,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 8.5,
        "cc": 4.0,
        "saldo_cantos": 4.5,
        "gp": 0.83,
        "gc": 1.0,
        "saldo_gols": -0.17
      },
      "casa": {
        "cp": 8.71,
        "cc": 3.57,
        "saldo_cantos": 5.14,
        "gp": 0.71,
        "gc": 1.14,
        "saldo_gols": -0.43
      },
      "fora": {
        "cp": 8.2,
        "cc": 4.6,
        "saldo_cantos": 3.6,
        "gp": 1.0,
        "gc": 0.8,
        "saldo_gols": 0.2
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.083,
        "D": 0.25,
        "tv": 0.667
      },
      "casa": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.098,
      "perfil": "MÉDIO",
      "total_cantos_pro": 102,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 4.66,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.9,
      "saldo_gols_norm": -0.17
    },
    "pressao": {
      "ratio_liga": 1.7,
      "perfil": "ALTO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.33,
        "avg_cc": 4.67,
        "delta_cp": -3.17,
        "delta_cc": 0.67,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 12.2,
        "avg_cc": 2.0,
        "delta_cp": 3.7,
        "delta_cc": -2.0,
        "n": 5
      },
      "empatou": {
        "avg_cp": 6.25,
        "delta_cp": -2.25,
        "n": 4
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 7.0,
        "cc_avg": 5.33,
        "saldo": 1.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 8.25,
        "cc_avg": 4.25,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.45,
      "cp_std": 4.68,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 3.92,
      "avg_ft_cp": 8.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.75,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 0.51
  },
  "BR::Athletico-PR": {
    "time": "Athletico-PR",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 6,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 4.67,
        "saldo_cantos": -0.17,
        "gp": 1.42,
        "gc": 1.17,
        "saldo_gols": 0.25
      },
      "casa": {
        "cp": 5.5,
        "cc": 3.33,
        "saldo_cantos": 2.17,
        "gp": 2.0,
        "gc": 0.67,
        "saldo_gols": 1.33
      },
      "fora": {
        "cp": 3.5,
        "cc": 6.0,
        "saldo_cantos": -2.5,
        "gp": 0.83,
        "gc": 1.67,
        "saldo_gols": -0.84
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.315,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 54,
      "total_gols": 17
    },
    "dissociacao": {
      "indice": -0.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.03,
      "saldo_gols_norm": 0.25
    },
    "pressao": {
      "ratio_liga": 0.9,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.33,
        "avg_cc": 5.5,
        "delta_cp": -0.17,
        "delta_cc": 0.83,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 4.2,
        "avg_cc": 4.2,
        "delta_cp": -0.3,
        "delta_cc": -0.47,
        "n": 5
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.5,
        "cc_avg": 7.0,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.25,
        "cc_avg": 3.5,
        "saldo": 1.75
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 3.03,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 2.33,
      "avg_ft_cp": 4.5,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.42
    },
    "split_ctx": 2.0
  },
  "BR::Coritiba": {
    "time": "Coritiba",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 6,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.25,
        "cc": 7.25,
        "saldo_cantos": -4.0,
        "gp": 1.25,
        "gc": 1.0,
        "saldo_gols": 0.25
      },
      "casa": {
        "cp": 2.67,
        "cc": 6.67,
        "saldo_cantos": -4.0,
        "gp": 0.83,
        "gc": 0.67,
        "saldo_gols": 0.16
      },
      "fora": {
        "cp": 3.83,
        "cc": 7.83,
        "saldo_cantos": -4.0,
        "gp": 1.67,
        "gc": 1.33,
        "saldo_gols": 0.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.385,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 39,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -4.24,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.8,
      "saldo_gols_norm": 0.25
    },
    "pressao": {
      "ratio_liga": 0.65,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.2,
        "avg_cc": 8.2,
        "delta_cp": -0.05,
        "delta_cc": 0.95,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 2.67,
        "avg_cc": 6.33,
        "delta_cp": -0.58,
        "delta_cc": -0.92,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.75,
        "delta_cp": 0.5,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.6,
        "cc_avg": 8.0,
        "saldo": -5.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 6.33,
        "saldo": -2.0
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 1.42,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.38,
      "avg_ht_cp": 1.25,
      "avg_ft_cp": 3.25,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.75,
      "taxa_ht_4": 0.42
    },
    "split_ctx": -1.16
  },
  "BR::Red Bull Bragantino": {
    "time": "Red Bull Bragantino",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 6.0,
        "cc": 5.73,
        "saldo_cantos": 0.27,
        "gp": 1.0,
        "gc": 1.09,
        "saldo_gols": -0.09
      },
      "casa": {
        "cp": 6.4,
        "cc": 6.8,
        "saldo_cantos": -0.4,
        "gp": 1.4,
        "gc": 1.0,
        "saldo_gols": 0.4
      },
      "fora": {
        "cp": 5.67,
        "cc": 4.83,
        "saldo_cantos": 0.84,
        "gp": 0.67,
        "gc": 1.17,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.182,
        "D": 0.273,
        "tv": 0.545
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.5,
        "E": 0.333,
        "D": 0.167,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.167,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 66,
      "total_gols": 11
    },
    "dissociacao": {
      "indice": 0.36,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.05,
      "saldo_gols_norm": -0.09
    },
    "pressao": {
      "ratio_liga": 1.2,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.0,
        "avg_cc": 7.5,
        "delta_cp": 0.0,
        "delta_cc": 1.77,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 6.8,
        "avg_cc": 4.4,
        "delta_cp": 0.8,
        "delta_cc": -1.33,
        "n": 5
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -2.0,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 6.0,
        "saldo": 0.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 7.25,
        "cc_avg": 6.0,
        "saldo": 1.25
      }
    },
    "consistencia": {
      "indice": 0.61,
      "cp_std": 2.32,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 2.45,
      "avg_ft_cp": 6.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.64,
      "taxa_ht_4": 0.27
    },
    "split_ctx": 0.73
  },
  "BR::Fluminense": {
    "time": "Fluminense",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 6,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.92,
        "cc": 4.33,
        "saldo_cantos": 1.59,
        "gp": 1.75,
        "gc": 1.25,
        "saldo_gols": 0.5
      },
      "casa": {
        "cp": 5.5,
        "cc": 3.5,
        "saldo_cantos": 2.0,
        "gp": 1.83,
        "gc": 1.0,
        "saldo_gols": 0.83
      },
      "fora": {
        "cp": 6.33,
        "cc": 5.17,
        "saldo_cantos": 1.16,
        "gp": 1.67,
        "gc": 1.5,
        "saldo_gols": 0.17
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.083,
        "D": 0.417,
        "tv": 0.5
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.296,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 71,
      "total_gols": 21
    },
    "dissociacao": {
      "indice": 1.09,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.32,
      "saldo_gols_norm": 0.5
    },
    "pressao": {
      "ratio_liga": 1.18,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.71,
        "avg_cc": 4.43,
        "delta_cp": -1.21,
        "delta_cc": 0.1,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 8.0,
        "avg_cc": 4.0,
        "delta_cp": 2.08,
        "delta_cc": -0.33,
        "n": 3
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": 1.08,
        "n": 2
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 5.5,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.8,
        "cc_avg": 2.6,
        "saldo": 3.2
      }
    },
    "consistencia": {
      "indice": 0.53,
      "cp_std": 2.78,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 3.42,
      "avg_ft_cp": 5.92,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.5
    },
    "split_ctx": -0.83
  },
  "BR::Corinthians": {
    "time": "Corinthians",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 6,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.58,
        "cc": 5.25,
        "saldo_cantos": -0.67,
        "gp": 0.67,
        "gc": 0.92,
        "saldo_gols": -0.25
      },
      "casa": {
        "cp": 5.0,
        "cc": 4.67,
        "saldo_cantos": 0.33,
        "gp": 0.67,
        "gc": 1.0,
        "saldo_gols": -0.33
      },
      "fora": {
        "cp": 4.17,
        "cc": 5.83,
        "saldo_cantos": -1.66,
        "gp": 0.67,
        "gc": 0.83,
        "saldo_gols": -0.16
      }
    },
    "ved": {
      "geral": {
        "V": 0.417,
        "E": 0.083,
        "D": 0.5,
        "tv": 0.417
      },
      "casa": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.145,
      "perfil": "MÉDIO",
      "total_cantos_pro": 55,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -0.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.13,
      "saldo_gols_norm": -0.25
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.5,
        "avg_cc": 5.5,
        "delta_cp": -3.08,
        "delta_cc": 0.25,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 7.25,
        "avg_cc": 6.0,
        "delta_cp": 2.67,
        "delta_cc": 0.75,
        "n": 4
      },
      "empatou": {
        "avg_cp": 3.83,
        "delta_cp": -0.75,
        "n": 6
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 6.5,
        "cc_avg": 5.25,
        "saldo": 1.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 4.67,
        "saldo": 1.33
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 2.87,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.31,
      "avg_ht_cp": 1.42,
      "avg_ft_cp": 4.58,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 0.83
  },
  "BR::Chapecoense": {
    "time": "Chapecoense",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 10,
      "casa": 6,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.3,
        "cc": 6.6,
        "saldo_cantos": -2.3,
        "gp": 1.0,
        "gc": 1.8,
        "saldo_gols": -0.8
      },
      "casa": {
        "cp": 5.5,
        "cc": 5.33,
        "saldo_cantos": 0.17,
        "gp": 1.5,
        "gc": 1.83,
        "saldo_gols": -0.33
      },
      "fora": {
        "cp": 2.5,
        "cc": 8.5,
        "saldo_cantos": -6.0,
        "gp": 0.25,
        "gc": 1.75,
        "saldo_gols": -1.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.1,
        "D": 0.5,
        "tv": 0.4
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.233,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": -1.49,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.46,
      "saldo_gols_norm": -0.8
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.0,
        "avg_cc": 14.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.25,
        "avg_cc": 5.75,
        "delta_cp": -0.05,
        "delta_cc": -0.85,
        "n": 4
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.7,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.75,
        "cc_avg": 10.75,
        "saldo": -8.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 7.33,
        "cc_avg": 3.0,
        "saldo": 4.33
      }
    },
    "consistencia": {
      "indice": 0.28,
      "cp_std": 3.09,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.26,
      "avg_ht_cp": 1.1,
      "avg_ft_cp": 4.3,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.7,
      "taxa_ht_4": 0.3
    },
    "split_ctx": 3.0
  },
  "BR::Santos": {
    "time": "Santos",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 7,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.58,
        "cc": 4.83,
        "saldo_cantos": 0.75,
        "gp": 1.33,
        "gc": 1.58,
        "saldo_gols": -0.25
      },
      "casa": {
        "cp": 5.29,
        "cc": 5.0,
        "saldo_cantos": 0.29,
        "gp": 1.43,
        "gc": 1.14,
        "saldo_gols": 0.29
      },
      "fora": {
        "cp": 6.0,
        "cc": 4.6,
        "saldo_cantos": 1.4,
        "gp": 1.2,
        "gc": 2.2,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.583,
        "E": 0.0,
        "D": 0.417,
        "tv": 0.583
      },
      "casa": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.239,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 67,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": 1.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.15,
      "saldo_gols_norm": -0.25
    },
    "pressao": {
      "ratio_liga": 1.11,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.67,
        "avg_cc": 4.33,
        "delta_cp": 0.09,
        "delta_cc": -0.5,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 6.4,
        "avg_cc": 4.6,
        "delta_cp": 0.82,
        "delta_cc": -0.23,
        "n": 5
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": -1.08,
        "n": 4
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.67,
        "cc_avg": 5.0,
        "saldo": -0.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 8.25,
        "cc_avg": 3.5,
        "saldo": 4.75
      }
    },
    "consistencia": {
      "indice": 0.38,
      "cp_std": 3.48,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.6,
      "avg_ht_cp": 3.33,
      "avg_ft_cp": 5.58,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.75,
      "taxa_ht_4": 0.67
    },
    "split_ctx": -0.71
  },
  "BR::São Paulo": {
    "time": "São Paulo",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.91,
        "cc": 3.91,
        "saldo_cantos": 2.0,
        "gp": 1.36,
        "gc": 0.82,
        "saldo_gols": 0.54
      },
      "casa": {
        "cp": 6.4,
        "cc": 4.0,
        "saldo_cantos": 2.4,
        "gp": 2.0,
        "gc": 0.6,
        "saldo_gols": 1.4
      },
      "fora": {
        "cp": 5.5,
        "cc": 3.83,
        "saldo_cantos": 1.67,
        "gp": 0.83,
        "gc": 1.0,
        "saldo_gols": -0.17
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.091,
        "D": 0.364,
        "tv": 0.545
      },
      "casa": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.231,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 65,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": 1.45,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.4,
      "saldo_gols_norm": 0.54
    },
    "pressao": {
      "ratio_liga": 1.18,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.5,
        "avg_cc": 4.67,
        "delta_cp": -0.41,
        "delta_cc": 0.76,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 5.67,
        "avg_cc": 2.0,
        "delta_cp": -0.24,
        "delta_cc": -1.91,
        "n": 3
      },
      "empatou": {
        "avg_cp": 7.5,
        "delta_cp": 1.59,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 7.0,
        "cc_avg": 4.33,
        "saldo": 2.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.4,
        "cc_avg": 4.0,
        "saldo": 1.4
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 3.53,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 2.55,
      "avg_ft_cp": 5.91,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.64,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 0.9
  },
  "BR::Vasco": {
    "time": "Vasco",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 12,
      "casa": 7,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.5,
        "cc": 3.67,
        "saldo_cantos": 1.83,
        "gp": 1.5,
        "gc": 1.5,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.43,
        "cc": 3.29,
        "saldo_cantos": 3.14,
        "gp": 1.57,
        "gc": 1.29,
        "saldo_gols": 0.28
      },
      "fora": {
        "cp": 4.2,
        "cc": 4.2,
        "saldo_cantos": 0.0,
        "gp": 1.4,
        "gc": 1.8,
        "saldo_gols": -0.4
      }
    },
    "ved": {
      "geral": {
        "V": 0.583,
        "E": 0.167,
        "D": 0.25,
        "tv": 0.583
      },
      "casa": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "fora": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.273,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 66,
      "total_gols": 18
    },
    "dissociacao": {
      "indice": 1.83,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.37,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 4.25,
        "delta_cp": -0.5,
        "delta_cc": 0.58,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 4.0,
        "delta_cp": -1.0,
        "delta_cc": 0.33,
        "n": 4
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": 1.5,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 5.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.75,
        "cc_avg": 2.0,
        "saldo": 4.75
      }
    },
    "consistencia": {
      "indice": 0.34,
      "cp_std": 3.63,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 3.17,
      "avg_ft_cp": 5.5,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 2.23
  },
  "BR::Botafogo": {
    "time": "Botafogo",
    "liga": "BR",
    "liga_nome": "Brasileirão 2026",
    "n": {
      "geral": 10,
      "casa": 4,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.3,
        "cc": 5.2,
        "saldo_cantos": -1.9,
        "gp": 1.8,
        "gc": 2.1,
        "saldo_gols": -0.3
      },
      "casa": {
        "cp": 3.5,
        "cc": 5.75,
        "saldo_cantos": -2.25,
        "gp": 2.25,
        "gc": 1.75,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 3.17,
        "cc": 4.83,
        "saldo_cantos": -1.66,
        "gp": 1.5,
        "gc": 2.33,
        "saldo_gols": -0.83
      }
    },
    "ved": {
      "geral": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.167,
        "E": 0.0,
        "D": 0.833,
        "tv": 0.167
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.545,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 33,
      "total_gols": 18
    },
    "dissociacao": {
      "indice": -1.6,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.38,
      "saldo_gols_norm": -0.3
    },
    "pressao": {
      "ratio_liga": 0.66,
      "perfil": "BAIXO",
      "media_liga_ft": 5.01
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.25,
        "avg_cc": 7.25,
        "delta_cp": -0.05,
        "delta_cc": 2.05,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 2.6,
        "avg_cc": 3.8,
        "delta_cp": -0.7,
        "delta_cc": -1.4,
        "n": 5
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 1.75,
        "cc_avg": 5.5,
        "saldo": -3.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 4.0,
        "saldo": 0.5
      }
    },
    "consistencia": {
      "indice": 0.18,
      "cp_std": 2.71,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.3,
      "avg_ft_cp": 3.3,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.2
    },
    "split_ctx": 0.33
  },
  "ARG::Instituto": {
    "time": "Instituto",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.86,
        "cc": 3.64,
        "saldo_cantos": 1.22,
        "gp": 1.0,
        "gc": 1.14,
        "saldo_gols": -0.14
      },
      "casa": {
        "cp": 4.25,
        "cc": 3.62,
        "saldo_cantos": 0.63,
        "gp": 1.38,
        "gc": 1.0,
        "saldo_gols": 0.38
      },
      "fora": {
        "cp": 5.67,
        "cc": 3.67,
        "saldo_cantos": 2.0,
        "gp": 0.5,
        "gc": 1.33,
        "saldo_gols": -0.83
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.143,
        "D": 0.357,
        "tv": 0.5
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.206,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 68,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": 1.59,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.29,
      "saldo_gols_norm": -0.14
    },
    "pressao": {
      "ratio_liga": 1.15,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 5.4,
        "delta_cp": -0.86,
        "delta_cc": 1.76,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 5.57,
        "avg_cc": 3.0,
        "delta_cp": 0.71,
        "delta_cc": -0.64,
        "n": 7
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": -0.36,
        "n": 2
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 4.4,
        "saldo": -0.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.0,
        "cc_avg": 2.67,
        "saldo": 2.33
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 1.79,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.36,
      "avg_ft_cp": 4.86,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.36
    },
    "split_ctx": -1.42
  },
  "ARG::Velez Sarsfield": {
    "time": "Velez Sarsfield",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 3.5,
        "cc": 4.79,
        "saldo_cantos": -1.29,
        "gp": 1.07,
        "gc": 0.64,
        "saldo_gols": 0.43
      },
      "casa": {
        "cp": 4.17,
        "cc": 5.0,
        "saldo_cantos": -0.83,
        "gp": 1.0,
        "gc": 0.5,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 3.0,
        "cc": 4.62,
        "saldo_cantos": -1.62,
        "gp": 1.12,
        "gc": 0.75,
        "saldo_gols": 0.37
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.071,
        "D": 0.643,
        "tv": 0.286
      },
      "casa": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.306,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 49,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -1.96,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.31,
      "saldo_gols_norm": 0.43
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.29,
        "avg_cc": 6.0,
        "delta_cp": 0.79,
        "delta_cc": 1.21,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 2.0,
        "avg_cc": 3.0,
        "delta_cp": -1.5,
        "delta_cc": -1.79,
        "n": 2
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": -0.5,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.4,
        "cc_avg": 5.0,
        "saldo": -0.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 2.67,
        "cc_avg": 4.5,
        "saldo": -1.83
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.1,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 1.79,
      "avg_ft_cp": 3.5,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.21
    },
    "split_ctx": 1.17
  },
  "ARG::Union de Santa Fe": {
    "time": "Union de Santa Fe",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 13,
      "casa": 6,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.23,
        "cc": 3.85,
        "saldo_cantos": 0.38,
        "gp": 1.46,
        "gc": 1.0,
        "saldo_gols": 0.46
      },
      "casa": {
        "cp": 4.5,
        "cc": 2.33,
        "saldo_cantos": 2.17,
        "gp": 1.33,
        "gc": 0.17,
        "saldo_gols": 1.16
      },
      "fora": {
        "cp": 4.0,
        "cc": 5.14,
        "saldo_cantos": -1.14,
        "gp": 1.57,
        "gc": 1.71,
        "saldo_gols": -0.14
      }
    },
    "ved": {
      "geral": {
        "V": 0.538,
        "E": 0.0,
        "D": 0.462,
        "tv": 0.538
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.345,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 55,
      "total_gols": 19
    },
    "dissociacao": {
      "indice": -0.01,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.09,
      "saldo_gols_norm": 0.46
    },
    "pressao": {
      "ratio_liga": 1.01,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.4,
        "avg_cc": 3.4,
        "delta_cp": -0.83,
        "delta_cc": -0.45,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 6.33,
        "avg_cc": 4.67,
        "delta_cp": 2.1,
        "delta_cc": 0.82,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.8,
        "delta_cp": -0.43,
        "n": 5
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 5.0,
        "saldo": -1.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 3.86,
        "cc_avg": 3.57,
        "saldo": 0.29
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.42,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 1.92,
      "avg_ft_cp": 4.23,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.31,
      "taxa_ht_4": 0.31
    },
    "split_ctx": 0.5
  },
  "ARG::Platense": {
    "time": "Platense",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 3.93,
        "cc": 3.21,
        "saldo_cantos": 0.72,
        "gp": 0.71,
        "gc": 0.86,
        "saldo_gols": -0.15
      },
      "casa": {
        "cp": 4.17,
        "cc": 2.67,
        "saldo_cantos": 1.5,
        "gp": 0.67,
        "gc": 0.83,
        "saldo_gols": -0.16
      },
      "fora": {
        "cp": 3.75,
        "cc": 3.62,
        "saldo_cantos": 0.13,
        "gp": 0.75,
        "gc": 0.88,
        "saldo_gols": -0.13
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "casa": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "fora": {
        "V": 0.625,
        "E": 0.0,
        "D": 0.375,
        "tv": 0.625
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.182,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 55,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 1.01,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.17,
      "saldo_gols_norm": -0.15
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 3.0,
        "delta_cp": -0.93,
        "delta_cc": -0.21,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 3.75,
        "delta_cp": 0.57,
        "delta_cc": 0.54,
        "n": 4
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": 0.07,
        "n": 7
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.2,
        "cc_avg": 2.2,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.67,
        "cc_avg": 3.17,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.62,
      "cp_std": 1.49,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 1.93,
      "avg_ft_cp": 3.93,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 0.42
  },
  "ARG::Aldosivi": {
    "time": "Aldosivi",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 4.79,
        "saldo_cantos": -0.79,
        "gp": 0.21,
        "gc": 1.0,
        "saldo_gols": -0.79
      },
      "casa": {
        "cp": 3.86,
        "cc": 4.86,
        "saldo_cantos": -1.0,
        "gp": 0.14,
        "gc": 0.43,
        "saldo_gols": -0.29
      },
      "fora": {
        "cp": 4.14,
        "cc": 4.71,
        "saldo_cantos": -0.57,
        "gp": 0.29,
        "gc": 1.57,
        "saldo_gols": -1.28
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.143,
        "D": 0.5,
        "tv": 0.357
      },
      "casa": {
        "V": 0.286,
        "E": 0.286,
        "D": 0.429,
        "tv": 0.286
      },
      "fora": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.054,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 56,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": -0.15,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.19,
      "saldo_gols_norm": -0.79
    },
    "pressao": {
      "ratio_liga": 0.95,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 3.71,
        "avg_cc": 4.0,
        "delta_cp": -0.29,
        "delta_cc": -0.79,
        "n": 7
      },
      "empatou": {
        "avg_cp": 4.29,
        "delta_cp": 0.29,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.8,
        "cc_avg": 6.4,
        "saldo": -1.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.2,
        "cc_avg": 3.8,
        "saldo": 0.4
      }
    },
    "consistencia": {
      "indice": 0.55,
      "cp_std": 1.8,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.93,
      "avg_ft_cp": 4.0,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.36
    },
    "split_ctx": -0.28
  },
  "ARG::Defensa y Justicia": {
    "time": "Defensa y Justicia",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 4.21,
        "saldo_cantos": -0.21,
        "gp": 1.0,
        "gc": 0.93,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 4.71,
        "cc": 2.71,
        "saldo_cantos": 2.0,
        "gp": 1.0,
        "gc": 0.86,
        "saldo_gols": 0.14
      },
      "fora": {
        "cp": 3.29,
        "cc": 5.71,
        "saldo_cantos": -2.42,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.143,
        "D": 0.5,
        "tv": 0.357
      },
      "casa": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "fora": {
        "V": 0.0,
        "E": 0.286,
        "D": 0.714,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.25,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 56,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -0.32,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.05,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.95,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.33,
        "avg_cc": 6.33,
        "delta_cp": -0.67,
        "delta_cc": 2.12,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 5.33,
        "avg_cc": 4.33,
        "delta_cp": 1.33,
        "delta_cc": 0.12,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.75,
        "delta_cp": -0.25,
        "n": 8
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 5.5,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 3.43,
        "cc_avg": 4.0,
        "saldo": -0.57
      }
    },
    "consistencia": {
      "indice": 0.65,
      "cp_std": 1.41,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 2.14,
      "avg_ft_cp": 4.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 1.42
  },
  "ARG::Central Cordoba": {
    "time": "Central Cordoba",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.79,
        "cc": 4.79,
        "saldo_cantos": -1.0,
        "gp": 0.64,
        "gc": 1.36,
        "saldo_gols": -0.72
      },
      "casa": {
        "cp": 4.29,
        "cc": 3.43,
        "saldo_cantos": 0.86,
        "gp": 1.14,
        "gc": 1.0,
        "saldo_gols": 0.14
      },
      "fora": {
        "cp": 3.29,
        "cc": 6.14,
        "saldo_cantos": -2.85,
        "gp": 0.14,
        "gc": 1.71,
        "saldo_gols": -1.57
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.071,
        "D": 0.643,
        "tv": 0.286
      },
      "casa": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "fora": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.17,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 9
    },
    "dissociacao": {
      "indice": -0.47,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.24,
      "saldo_gols_norm": -0.72
    },
    "pressao": {
      "ratio_liga": 0.9,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 2.0,
        "avg_cc": 4.0,
        "delta_cp": -1.79,
        "delta_cc": -0.79,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 5.14,
        "avg_cc": 5.29,
        "delta_cp": 1.35,
        "delta_cc": 0.5,
        "n": 7
      },
      "empatou": {
        "avg_cp": 2.75,
        "delta_cp": -1.04,
        "n": 4
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.0,
        "cc_avg": 5.6,
        "saldo": -2.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.5,
        "cc_avg": 4.83,
        "saldo": 0.67
      }
    },
    "consistencia": {
      "indice": 0.17,
      "cp_std": 3.14,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 3.79,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 1.0
  },
  "ARG::Gimnasia Mendoza": {
    "time": "Gimnasia Mendoza",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.64,
        "cc": 5.07,
        "saldo_cantos": -1.43,
        "gp": 0.79,
        "gc": 1.14,
        "saldo_gols": -0.35
      },
      "casa": {
        "cp": 4.86,
        "cc": 3.29,
        "saldo_cantos": 1.57,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.43,
        "cc": 6.86,
        "saldo_cantos": -4.43,
        "gp": 0.57,
        "gc": 1.29,
        "saldo_gols": -0.72
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.071,
        "D": 0.571,
        "tv": 0.357
      },
      "casa": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.216,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 51,
      "total_gols": 11
    },
    "dissociacao": {
      "indice": -1.35,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.34,
      "saldo_gols_norm": -0.35
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 5.5,
        "delta_cp": 0.36,
        "delta_cc": 0.43,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 3.83,
        "avg_cc": 4.0,
        "delta_cp": 0.19,
        "delta_cc": -1.07,
        "n": 6
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": -0.64,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.0,
        "cc_avg": 5.6,
        "saldo": -2.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 4.57,
        "cc_avg": 4.57,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 1.74,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 1.71,
      "avg_ft_cp": 3.64,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 2.43
  },
  "ARG::Banfield": {
    "time": "Banfield",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.57,
        "cc": 5.14,
        "saldo_cantos": -1.57,
        "gp": 1.0,
        "gc": 1.21,
        "saldo_gols": -0.21
      },
      "casa": {
        "cp": 5.25,
        "cc": 3.25,
        "saldo_cantos": 2.0,
        "gp": 1.25,
        "gc": 0.75,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 1.33,
        "cc": 7.67,
        "saldo_cantos": -6.34,
        "gp": 0.67,
        "gc": 1.83,
        "saldo_gols": -1.16
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.875,
        "E": 0.0,
        "D": 0.125,
        "tv": 0.875
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.28,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 50,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -1.66,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.37,
      "saldo_gols_norm": -0.21
    },
    "pressao": {
      "ratio_liga": 0.85,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 3.75,
        "delta_cp": 0.43,
        "delta_cc": -1.39,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 6.5,
        "delta_cp": -0.57,
        "delta_cc": 1.36,
        "n": 8
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 1.43,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.0,
        "cc_avg": 5.75,
        "saldo": -3.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 5.0,
        "saldo": -1.17
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 2.53,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 1.86,
      "avg_ft_cp": 3.57,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 3.92
  },
  "ARG::Huracan": {
    "time": "Huracan",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.29,
        "cc": 4.29,
        "saldo_cantos": 0.0,
        "gp": 1.14,
        "gc": 0.79,
        "saldo_gols": 0.35
      },
      "casa": {
        "cp": 4.71,
        "cc": 3.43,
        "saldo_cantos": 1.28,
        "gp": 1.43,
        "gc": 0.86,
        "saldo_gols": 0.57
      },
      "fora": {
        "cp": 3.86,
        "cc": 5.14,
        "saldo_cantos": -1.28,
        "gp": 0.86,
        "gc": 0.71,
        "saldo_gols": 0.15
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.214,
        "D": 0.5,
        "tv": 0.286
      },
      "casa": {
        "V": 0.429,
        "E": 0.286,
        "D": 0.286,
        "tv": 0.429
      },
      "fora": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.267,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 60,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": -0.35,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": 0.35
    },
    "pressao": {
      "ratio_liga": 1.02,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 3.6,
        "delta_cp": 0.71,
        "delta_cc": -0.69,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 3.67,
        "avg_cc": 5.0,
        "delta_cp": -0.62,
        "delta_cc": 0.71,
        "n": 3
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.29,
        "n": 6
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 6.0,
        "cc_avg": 4.75,
        "saldo": 1.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 4.0,
        "cc_avg": 3.57,
        "saldo": 0.43
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 2.33,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.6,
      "avg_ht_cp": 2.57,
      "avg_ft_cp": 4.29,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 0.85
  },
  "ARG::Independiente": {
    "time": "Independiente",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 6.0,
        "cc": 3.93,
        "saldo_cantos": 2.07,
        "gp": 1.57,
        "gc": 1.21,
        "saldo_gols": 0.36
      },
      "casa": {
        "cp": 7.0,
        "cc": 3.88,
        "saldo_cantos": 3.12,
        "gp": 1.88,
        "gc": 1.12,
        "saldo_gols": 0.76
      },
      "fora": {
        "cp": 4.67,
        "cc": 4.0,
        "saldo_cantos": 0.67,
        "gp": 1.17,
        "gc": 1.33,
        "saldo_gols": -0.16
      }
    },
    "ved": {
      "geral": {
        "V": 0.643,
        "E": 0.071,
        "D": 0.286,
        "tv": 0.643
      },
      "casa": {
        "V": 0.875,
        "E": 0.0,
        "D": 0.125,
        "tv": 0.875
      },
      "fora": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.262,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 84,
      "total_gols": 22
    },
    "dissociacao": {
      "indice": 2.1,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.49,
      "saldo_gols_norm": 0.36
    },
    "pressao": {
      "ratio_liga": 1.43,
      "perfil": "ALTO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.2,
        "avg_cc": 3.2,
        "delta_cp": 0.2,
        "delta_cc": -0.73,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 7.67,
        "avg_cc": 3.67,
        "delta_cp": 1.67,
        "delta_cc": -0.26,
        "n": 3
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": -1.0,
        "n": 6
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.75,
        "cc_avg": 3.25,
        "saldo": 1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.33,
        "cc_avg": 4.17,
        "saldo": 2.16
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 2.94,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.61,
      "avg_ht_cp": 3.64,
      "avg_ft_cp": 6.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 2.33
  },
  "ARG::Estudiantes L.P.": {
    "time": "Estudiantes L.P.",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 4.93,
        "saldo_cantos": -0.43,
        "gp": 1.21,
        "gc": 0.5,
        "saldo_gols": 0.71
      },
      "casa": {
        "cp": 5.86,
        "cc": 5.0,
        "saldo_cantos": 0.86,
        "gp": 1.57,
        "gc": 0.57,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 3.14,
        "cc": 4.86,
        "saldo_cantos": -1.72,
        "gp": 0.86,
        "gc": 0.43,
        "saldo_gols": 0.43
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.071,
        "D": 0.571,
        "tv": 0.357
      },
      "casa": {
        "V": 0.429,
        "E": 0.143,
        "D": 0.429,
        "tv": 0.429
      },
      "fora": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.27,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 63,
      "total_gols": 17
    },
    "dissociacao": {
      "indice": -1.22,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.1,
      "saldo_gols_norm": 0.71
    },
    "pressao": {
      "ratio_liga": 1.07,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.12,
        "avg_cc": 4.88,
        "delta_cp": -0.38,
        "delta_cc": -0.05,
        "n": 8
      },
      "perdeu": {
        "avg_cp": 6.33,
        "avg_cc": 4.33,
        "delta_cp": 1.83,
        "delta_cc": -0.6,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.67,
        "delta_cp": -0.83,
        "n": 3
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 7.5,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 8,
        "cp_avg": 5.38,
        "cc_avg": 3.88,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 2.41,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 2.36,
      "avg_ft_cp": 4.5,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 2.72
  },
  "ARG::San Lorenzo": {
    "time": "San Lorenzo",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.79,
        "cc": 4.21,
        "saldo_cantos": -0.42,
        "gp": 0.86,
        "gc": 0.86,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.71,
        "cc": 4.29,
        "saldo_cantos": 0.42,
        "gp": 1.29,
        "gc": 1.29,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.86,
        "cc": 4.14,
        "saldo_cantos": -1.28,
        "gp": 0.43,
        "gc": 0.43,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.071,
        "D": 0.429,
        "tv": 0.5
      },
      "casa": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "fora": {
        "V": 0.429,
        "E": 0.143,
        "D": 0.429,
        "tv": 0.429
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.226,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 12
    },
    "dissociacao": {
      "indice": -0.5,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.1,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.9,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.5,
        "avg_cc": 4.25,
        "delta_cp": 0.71,
        "delta_cc": 0.04,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 5.67,
        "avg_cc": 3.67,
        "delta_cp": 1.88,
        "delta_cc": -0.54,
        "n": 3
      },
      "empatou": {
        "avg_cp": 2.57,
        "delta_cp": -1.22,
        "n": 7
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 1.5,
        "cc_avg": 4.75,
        "saldo": -3.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.33,
        "cc_avg": 3.83,
        "saldo": 0.5
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 2.55,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 3.79,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.21
    },
    "split_ctx": 1.85
  },
  "ARG::Lanus": {
    "time": "Lanus",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 4.14,
        "saldo_cantos": -0.43,
        "gp": 1.29,
        "gc": 1.07,
        "saldo_gols": 0.22
      },
      "casa": {
        "cp": 4.33,
        "cc": 2.33,
        "saldo_cantos": 2.0,
        "gp": 1.5,
        "gc": 0.83,
        "saldo_gols": 0.67
      },
      "fora": {
        "cp": 3.25,
        "cc": 5.5,
        "saldo_cantos": -2.25,
        "gp": 1.12,
        "gc": 1.25,
        "saldo_gols": -0.13
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.071,
        "D": 0.571,
        "tv": 0.357
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.25,
        "E": 0.125,
        "D": 0.625,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.346,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 52,
      "total_gols": 18
    },
    "dissociacao": {
      "indice": -0.73,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.1,
      "saldo_gols_norm": 0.22
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.33,
        "avg_cc": 4.17,
        "delta_cp": 1.62,
        "delta_cc": 0.03,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 2.75,
        "avg_cc": 5.25,
        "delta_cp": -0.96,
        "delta_cc": 1.11,
        "n": 4
      },
      "empatou": {
        "avg_cp": 2.25,
        "delta_cp": -1.46,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.17,
        "cc_avg": 4.5,
        "saldo": -1.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.67,
        "cc_avg": 4.0,
        "saldo": 0.67
      }
    },
    "consistencia": {
      "indice": 0.25,
      "cp_std": 2.79,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 1.64,
      "avg_ft_cp": 3.71,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.21,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 1.08
  },
  "ARG::Talleres Cordoba": {
    "time": "Talleres Cordoba",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.86,
        "cc": 4.57,
        "saldo_cantos": 0.29,
        "gp": 1.14,
        "gc": 0.86,
        "saldo_gols": 0.28
      },
      "casa": {
        "cp": 6.29,
        "cc": 4.57,
        "saldo_cantos": 1.72,
        "gp": 1.29,
        "gc": 0.71,
        "saldo_gols": 0.58
      },
      "fora": {
        "cp": 3.43,
        "cc": 4.57,
        "saldo_cantos": -1.14,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.643,
        "E": 0.0,
        "D": 0.357,
        "tv": 0.643
      },
      "casa": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "fora": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.235,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 68,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": 0.06,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.07,
      "saldo_gols_norm": 0.28
    },
    "pressao": {
      "ratio_liga": 1.15,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.14,
        "avg_cc": 6.43,
        "delta_cp": -0.72,
        "delta_cc": 1.86,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 5.25,
        "avg_cc": 3.0,
        "delta_cp": 0.39,
        "delta_cc": -1.57,
        "n": 4
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": 1.14,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 6.2,
        "saldo": -2.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.5,
        "cc_avg": 3.17,
        "saldo": 3.33
      }
    },
    "consistencia": {
      "indice": 0.32,
      "cp_std": 3.32,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 2.5,
      "avg_ft_cp": 4.86,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 2.86
  },
  "ARG::Newells Old Boys": {
    "time": "Newells Old Boys",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 13,
      "casa": 7,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.31,
        "cc": 4.46,
        "saldo_cantos": -1.15,
        "gp": 0.62,
        "gc": 1.54,
        "saldo_gols": -0.92
      },
      "casa": {
        "cp": 4.29,
        "cc": 3.86,
        "saldo_cantos": 0.43,
        "gp": 0.43,
        "gc": 0.86,
        "saldo_gols": -0.43
      },
      "fora": {
        "cp": 2.17,
        "cc": 5.17,
        "saldo_cantos": -3.0,
        "gp": 0.83,
        "gc": 2.33,
        "saldo_gols": -1.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.308,
        "E": 0.077,
        "D": 0.615,
        "tv": 0.308
      },
      "casa": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "fora": {
        "V": 0.0,
        "E": 0.167,
        "D": 0.833,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.186,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -0.45,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.27,
      "saldo_gols_norm": -0.92
    },
    "pressao": {
      "ratio_liga": 0.79,
      "perfil": "BAIXO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 4.0,
        "delta_cp": 0.69,
        "delta_cc": -0.46,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 1.67,
        "avg_cc": 5.83,
        "delta_cp": -1.64,
        "delta_cc": 1.37,
        "n": 6
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 1.69,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 4.75,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 2.5,
        "cc_avg": 3.83,
        "saldo": -1.33
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 2.21,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 1.46,
      "avg_ft_cp": 3.31,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.23,
      "taxa_ht_4": 0.23
    },
    "split_ctx": 2.12
  },
  "ARG::Ind. Rivadavia": {
    "time": "Ind. Rivadavia",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.79,
        "cc": 3.71,
        "saldo_cantos": 0.08,
        "gp": 1.64,
        "gc": 0.93,
        "saldo_gols": 0.71
      },
      "casa": {
        "cp": 4.0,
        "cc": 3.5,
        "saldo_cantos": 0.5,
        "gp": 1.75,
        "gc": 1.12,
        "saldo_gols": 0.63
      },
      "fora": {
        "cp": 3.5,
        "cc": 4.0,
        "saldo_cantos": -0.5,
        "gp": 1.5,
        "gc": 0.67,
        "saldo_gols": 0.83
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.143,
        "D": 0.357,
        "tv": 0.5
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.434,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 23
    },
    "dissociacao": {
      "indice": -0.61,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.02,
      "saldo_gols_norm": 0.71
    },
    "pressao": {
      "ratio_liga": 0.9,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.56,
        "avg_cc": 3.44,
        "delta_cp": -0.23,
        "delta_cc": -0.27,
        "n": 9
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 3.0,
        "delta_cp": 3.21,
        "delta_cc": -0.71,
        "n": 2
      },
      "empatou": {
        "avg_cp": 2.33,
        "delta_cp": -1.46,
        "n": 3
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.0,
        "cc_avg": 4.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 2.8,
        "saldo": 1.2
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 1.89,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.34,
      "avg_ht_cp": 1.29,
      "avg_ft_cp": 3.79,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.14,
      "taxa_ht_4": 0.14
    },
    "split_ctx": 0.5
  },
  "ARG::Atl. Tucuman": {
    "time": "Atl. Tucuman",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 5.14,
        "cc": 3.43,
        "saldo_cantos": 1.71,
        "gp": 0.93,
        "gc": 1.36,
        "saldo_gols": -0.43
      },
      "casa": {
        "cp": 6.71,
        "cc": 3.86,
        "saldo_cantos": 2.85,
        "gp": 1.0,
        "gc": 0.71,
        "saldo_gols": 0.29
      },
      "fora": {
        "cp": 3.57,
        "cc": 3.0,
        "saldo_cantos": 0.57,
        "gp": 0.86,
        "gc": 2.0,
        "saldo_gols": -1.14
      }
    },
    "ved": {
      "geral": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.181,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 72,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": 2.46,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.41,
      "saldo_gols_norm": -0.43
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.5,
        "avg_cc": 3.0,
        "delta_cp": 1.36,
        "delta_cc": -0.43,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 3.38,
        "delta_cp": -1.14,
        "delta_cc": -0.05,
        "n": 8
      },
      "empatou": {
        "avg_cp": 6.75,
        "delta_cp": 1.61,
        "n": 4
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.25,
        "cc_avg": 4.5,
        "saldo": -0.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.67,
        "cc_avg": 3.0,
        "saldo": 2.67
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.38,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 2.21,
      "avg_ft_cp": 5.14,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 3.14
  },
  "ARG::Barracas Central": {
    "time": "Barracas Central",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 1.93,
        "cc": 4.36,
        "saldo_cantos": -2.43,
        "gp": 0.93,
        "gc": 0.86,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 2.29,
        "cc": 3.57,
        "saldo_cantos": -1.28,
        "gp": 1.14,
        "gc": 0.86,
        "saldo_gols": 0.28
      },
      "fora": {
        "cp": 1.57,
        "cc": 5.14,
        "saldo_cantos": -3.57,
        "gp": 0.71,
        "gc": 0.86,
        "saldo_gols": -0.15
      }
    },
    "ved": {
      "geral": {
        "V": 0.071,
        "E": 0.071,
        "D": 0.857,
        "tv": 0.071
      },
      "casa": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.481,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 27,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": -2.96,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.58,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.46,
      "perfil": "BAIXO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.2,
        "avg_cc": 4.8,
        "delta_cp": -0.73,
        "delta_cc": 0.44,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 3.5,
        "delta_cp": 1.07,
        "delta_cc": -0.86,
        "n": 4
      },
      "empatou": {
        "avg_cp": 1.8,
        "delta_cp": -0.13,
        "n": 5
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 1.83,
        "cc_avg": 4.83,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 2.0,
        "cc_avg": 3.25,
        "saldo": -1.25
      }
    },
    "consistencia": {
      "indice": 0,
      "cp_std": 1.98,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 1.0,
      "avg_ft_cp": 1.93,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.14,
      "taxa_ht_4": 0.21
    },
    "split_ctx": 0.72
  },
  "ARG::River Plate": {
    "time": "River Plate",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 5.36,
        "cc": 3.57,
        "saldo_cantos": 1.79,
        "gp": 1.29,
        "gc": 0.43,
        "saldo_gols": 0.86
      },
      "casa": {
        "cp": 7.17,
        "cc": 2.17,
        "saldo_cantos": 5.0,
        "gp": 1.67,
        "gc": 0.33,
        "saldo_gols": 1.34
      },
      "fora": {
        "cp": 4.0,
        "cc": 4.62,
        "saldo_cantos": -0.62,
        "gp": 1.0,
        "gc": 0.5,
        "saldo_gols": 0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.286,
        "D": 0.143,
        "tv": 0.571
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.25,
        "E": 0.5,
        "D": 0.25,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.24,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 75,
      "total_gols": 18
    },
    "dissociacao": {
      "indice": 1.27,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.43,
      "saldo_gols_norm": 0.86
    },
    "pressao": {
      "ratio_liga": 1.27,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.12,
        "avg_cc": 4.12,
        "delta_cp": 0.76,
        "delta_cc": 0.55,
        "n": 8
      },
      "perdeu": {
        "avg_cp": 4.67,
        "avg_cc": 2.33,
        "delta_cp": -0.69,
        "delta_cc": -1.24,
        "n": 3
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -1.36,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.25,
        "cc_avg": 3.25,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 7.0,
        "cc_avg": 3.67,
        "saldo": 3.33
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 2.59,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 5.36,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 3.17
  },
  "ARG::Rosario Central": {
    "time": "Rosario Central",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.86,
        "cc": 3.57,
        "saldo_cantos": 1.29,
        "gp": 1.14,
        "gc": 0.93,
        "saldo_gols": 0.21
      },
      "casa": {
        "cp": 5.71,
        "cc": 2.43,
        "saldo_cantos": 3.28,
        "gp": 1.29,
        "gc": 0.86,
        "saldo_gols": 0.43
      },
      "fora": {
        "cp": 4.0,
        "cc": 4.71,
        "saldo_cantos": -0.71,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "casa": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "fora": {
        "V": 0.286,
        "E": 0.286,
        "D": 0.429,
        "tv": 0.286
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.235,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 68,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": 1.32,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.31,
      "saldo_gols_norm": 0.21
    },
    "pressao": {
      "ratio_liga": 1.15,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.43,
        "avg_cc": 2.43,
        "delta_cp": -0.43,
        "delta_cc": -1.14,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 5.5,
        "avg_cc": 4.5,
        "delta_cp": 0.64,
        "delta_cc": 0.93,
        "n": 4
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.14,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 5.33,
        "cc_avg": 4.67,
        "saldo": 0.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.67,
        "cc_avg": 2.83,
        "saldo": 1.84
      }
    },
    "consistencia": {
      "indice": 0.47,
      "cp_std": 2.6,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 2.07,
      "avg_ft_cp": 4.86,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.14
    },
    "split_ctx": 1.71
  },
  "ARG::Belgrano": {
    "time": "Belgrano",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 4.07,
        "saldo_cantos": -0.36,
        "gp": 0.93,
        "gc": 0.86,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 5.0,
        "cc": 2.33,
        "saldo_cantos": 2.67,
        "gp": 1.17,
        "gc": 0.67,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 2.75,
        "cc": 5.38,
        "saldo_cantos": -2.63,
        "gp": 0.75,
        "gc": 1.0,
        "saldo_gols": -0.25
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.071,
        "D": 0.571,
        "tv": 0.357
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.125,
        "E": 0.125,
        "D": 0.75,
        "tv": 0.125
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.25,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 52,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": -0.5,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.09,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 4.67,
        "delta_cp": 0.29,
        "delta_cc": 0.6,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 4.33,
        "delta_cp": 0.29,
        "delta_cc": 0.26,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.2,
        "delta_cp": -0.51,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 1.4,
        "cc_avg": 6.0,
        "saldo": -4.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.25,
        "cc_avg": 1.5,
        "saldo": 4.75
      }
    },
    "consistencia": {
      "indice": 0.16,
      "cp_std": 3.1,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.79,
      "avg_ft_cp": 3.71,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 2.25
  },
  "ARG::Gimnasia L.P.": {
    "time": "Gimnasia L.P.",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.21,
        "cc": 4.93,
        "saldo_cantos": -0.72,
        "gp": 1.14,
        "gc": 1.36,
        "saldo_gols": -0.22
      },
      "casa": {
        "cp": 4.0,
        "cc": 4.0,
        "saldo_cantos": 0.0,
        "gp": 1.29,
        "gc": 1.43,
        "saldo_gols": -0.14
      },
      "fora": {
        "cp": 4.43,
        "cc": 5.86,
        "saldo_cantos": -1.43,
        "gp": 1.0,
        "gc": 1.29,
        "saldo_gols": -0.29
      }
    },
    "ved": {
      "geral": {
        "V": 0.357,
        "E": 0.0,
        "D": 0.643,
        "tv": 0.357
      },
      "casa": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "fora": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.271,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 59,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": -0.64,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.17,
      "saldo_gols_norm": -0.22
    },
    "pressao": {
      "ratio_liga": 1.0,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.33,
        "avg_cc": 5.0,
        "delta_cp": -0.88,
        "delta_cc": 0.07,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 5.5,
        "avg_cc": 4.0,
        "delta_cp": 1.29,
        "delta_cc": -0.93,
        "n": 6
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": -1.21,
        "n": 2
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 4.75,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 4.0,
        "cc_avg": 5.43,
        "saldo": -1.43
      }
    },
    "consistencia": {
      "indice": 0.49,
      "cp_std": 2.15,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.64,
      "avg_ft_cp": 4.21,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -0.43
  },
  "ARG::Racing Club": {
    "time": "Racing Club",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 5,
      "fora": 9
    },
    "base": {
      "geral": {
        "cp": 4.43,
        "cc": 4.57,
        "saldo_cantos": -0.14,
        "gp": 1.0,
        "gc": 0.93,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 4.6,
        "cc": 2.8,
        "saldo_cantos": 1.8,
        "gp": 0.8,
        "gc": 1.0,
        "saldo_gols": -0.2
      },
      "fora": {
        "cp": 4.33,
        "cc": 5.56,
        "saldo_cantos": -1.23,
        "gp": 1.11,
        "gc": 0.89,
        "saldo_gols": 0.22
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.444,
        "E": 0.0,
        "D": 0.556,
        "tv": 0.444
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.226,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 62,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -0.24,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.03,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 1.05,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.5,
        "avg_cc": 6.0,
        "delta_cp": -0.93,
        "delta_cc": 1.43,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 3.8,
        "delta_cp": 0.57,
        "delta_cc": -0.77,
        "n": 5
      },
      "empatou": {
        "avg_cp": 4.6,
        "delta_cp": 0.17,
        "n": 5
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 7,
        "cp_avg": 4.14,
        "cc_avg": 4.71,
        "saldo": -0.57
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.8,
        "cc_avg": 4.2,
        "saldo": 0.6
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.03,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.64,
      "avg_ft_cp": 4.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 0.27
  },
  "ARG::Boca Juniors": {
    "time": "Boca Juniors",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.71,
        "cc": 3.79,
        "saldo_cantos": 0.92,
        "gp": 1.14,
        "gc": 0.57,
        "saldo_gols": 0.57
      },
      "casa": {
        "cp": 5.38,
        "cc": 2.62,
        "saldo_cantos": 2.76,
        "gp": 1.0,
        "gc": 0.38,
        "saldo_gols": 0.62
      },
      "fora": {
        "cp": 3.83,
        "cc": 5.33,
        "saldo_cantos": -1.5,
        "gp": 1.33,
        "gc": 0.83,
        "saldo_gols": 0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.071,
        "D": 0.429,
        "tv": 0.5
      },
      "casa": {
        "V": 0.625,
        "E": 0.125,
        "D": 0.25,
        "tv": 0.625
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.242,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 66,
      "total_gols": 16
    },
    "dissociacao": {
      "indice": 0.52,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.22,
      "saldo_gols_norm": 0.57
    },
    "pressao": {
      "ratio_liga": 1.12,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.33,
        "avg_cc": 4.67,
        "delta_cp": -0.38,
        "delta_cc": 0.88,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 3.5,
        "delta_cp": 2.29,
        "delta_cc": -0.29,
        "n": 2
      },
      "empatou": {
        "avg_cp": 4.33,
        "delta_cp": -0.38,
        "n": 6
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.2,
        "cc_avg": 4.4,
        "saldo": -1.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.5,
        "cc_avg": 3.5,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.24,
      "cp_std": 3.58,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.56,
      "avg_ht_cp": 2.64,
      "avg_ft_cp": 4.71,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 1.55
  },
  "ARG::Dep. Riestra": {
    "time": "Dep. Riestra",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.21,
        "cc": 4.29,
        "saldo_cantos": -0.08,
        "gp": 0.21,
        "gc": 0.86,
        "saldo_gols": -0.65
      },
      "casa": {
        "cp": 5.43,
        "cc": 3.57,
        "saldo_cantos": 1.86,
        "gp": 0.29,
        "gc": 0.57,
        "saldo_gols": -0.28
      },
      "fora": {
        "cp": 3.0,
        "cc": 5.0,
        "saldo_cantos": -2.0,
        "gp": 0.14,
        "gc": 1.14,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.643,
        "E": 0.071,
        "D": 0.286,
        "tv": 0.643
      },
      "casa": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "fora": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.051,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 59,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": 0.55,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.02,
      "saldo_gols_norm": -0.65
    },
    "pressao": {
      "ratio_liga": 1.0,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 3.86,
        "avg_cc": 5.57,
        "delta_cp": -0.35,
        "delta_cc": 1.28,
        "n": 7
      },
      "empatou": {
        "avg_cp": 4.57,
        "delta_cp": 0.36,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.5,
        "cc_avg": 7.5,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 3.71,
        "cc_avg": 2.86,
        "saldo": 0.85
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.52,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 1.71,
      "avg_ft_cp": 4.21,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 2.43
  },
  "ARG::Argentinos Jrs": {
    "time": "Argentinos Jrs",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 9,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.64,
        "cc": 2.14,
        "saldo_cantos": 3.5,
        "gp": 1.0,
        "gc": 0.57,
        "saldo_gols": 0.43
      },
      "casa": {
        "cp": 6.0,
        "cc": 1.89,
        "saldo_cantos": 4.11,
        "gp": 1.11,
        "gc": 0.44,
        "saldo_gols": 0.67
      },
      "fora": {
        "cp": 5.0,
        "cc": 2.6,
        "saldo_cantos": 2.4,
        "gp": 0.8,
        "gc": 0.8,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.786,
        "E": 0.143,
        "D": 0.071,
        "tv": 0.786
      },
      "casa": {
        "V": 0.778,
        "E": 0.222,
        "D": 0.0,
        "tv": 0.778
      },
      "fora": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.177,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 79,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": 3.73,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.83,
      "saldo_gols_norm": 0.43
    },
    "pressao": {
      "ratio_liga": 1.34,
      "perfil": "ALTO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.14,
        "avg_cc": 1.71,
        "delta_cp": 0.5,
        "delta_cc": -0.43,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 5.33,
        "delta_cp": -0.31,
        "n": 6
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.6,
        "cc_avg": 2.4,
        "saldo": 2.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.67,
        "cc_avg": 1.33,
        "saldo": 5.34
      }
    },
    "consistencia": {
      "indice": 0.59,
      "cp_std": 2.34,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.5,
      "avg_ft_cp": 5.64,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 1.0
  },
  "ARG::Sarmiento Junin": {
    "time": "Sarmiento Junin",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.64,
        "cc": 5.43,
        "saldo_cantos": -1.79,
        "gp": 0.86,
        "gc": 1.14,
        "saldo_gols": -0.28
      },
      "casa": {
        "cp": 5.14,
        "cc": 4.86,
        "saldo_cantos": 0.28,
        "gp": 1.14,
        "gc": 0.86,
        "saldo_gols": 0.28
      },
      "fora": {
        "cp": 2.14,
        "cc": 6.0,
        "saldo_cantos": -3.86,
        "gp": 0.57,
        "gc": 1.43,
        "saldo_gols": -0.86
      }
    },
    "ved": {
      "geral": {
        "V": 0.143,
        "E": 0.071,
        "D": 0.786,
        "tv": 0.143
      },
      "casa": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "fora": {
        "V": 0.0,
        "E": 0.143,
        "D": 0.857,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.235,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 51,
      "total_gols": 12
    },
    "dissociacao": {
      "indice": -1.85,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.43,
      "saldo_gols_norm": -0.28
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.8,
        "avg_cc": 5.2,
        "delta_cp": 1.16,
        "delta_cc": -0.23,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 5.75,
        "delta_cp": -0.64,
        "delta_cc": 0.32,
        "n": 8
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 6.17,
        "saldo": -2.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.4,
        "cc_avg": 5.0,
        "saldo": -0.6
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.34,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 1.79,
      "avg_ft_cp": 3.64,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 3.0
  },
  "ARG::Tigre": {
    "time": "Tigre",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 4.14,
        "saldo_cantos": -0.43,
        "gp": 0.93,
        "gc": 0.86,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 3.88,
        "cc": 4.0,
        "saldo_cantos": -0.12,
        "gp": 1.38,
        "gc": 1.0,
        "saldo_gols": 0.38
      },
      "fora": {
        "cp": 3.5,
        "cc": 4.33,
        "saldo_cantos": -0.83,
        "gp": 0.33,
        "gc": 0.67,
        "saldo_gols": -0.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "casa": {
        "V": 0.375,
        "E": 0.0,
        "D": 0.625,
        "tv": 0.375
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.25,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 52,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": -0.58,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.1,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 5.67,
        "delta_cp": 1.29,
        "delta_cc": 1.53,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 3.67,
        "avg_cc": 2.67,
        "delta_cp": -0.04,
        "delta_cc": -1.47,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.25,
        "delta_cp": -0.46,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.25,
        "cc_avg": 5.0,
        "saldo": -2.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.83,
        "cc_avg": 2.67,
        "saldo": 3.16
      }
    },
    "consistencia": {
      "indice": 0.27,
      "cp_std": 2.7,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.79,
      "avg_ft_cp": 3.71,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 0.38
  },
  "ARG::Estudiantes Rio Cuarto": {
    "time": "Estudiantes Rio Cuarto",
    "liga": "ARG",
    "liga_nome": "Liga Pro Argentina 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 4.86,
        "cc": 4.21,
        "saldo_cantos": 0.65,
        "gp": 0.29,
        "gc": 1.43,
        "saldo_gols": -1.14
      },
      "casa": {
        "cp": 4.83,
        "cc": 4.33,
        "saldo_cantos": 0.5,
        "gp": 0.5,
        "gc": 1.0,
        "saldo_gols": -0.5
      },
      "fora": {
        "cp": 4.88,
        "cc": 4.12,
        "saldo_cantos": 0.76,
        "gp": 0.12,
        "gc": 1.75,
        "saldo_gols": -1.63
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.625,
        "E": 0.0,
        "D": 0.375,
        "tv": 0.625
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.059,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 68,
      "total_gols": 4
    },
    "dissociacao": {
      "indice": 1.91,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.15,
      "saldo_gols_norm": -1.14
    },
    "pressao": {
      "ratio_liga": 1.15,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.21
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.64,
        "avg_cc": 3.82,
        "delta_cp": -0.22,
        "delta_cc": -0.39,
        "n": 11
      },
      "empatou": {
        "avg_cp": 5.5,
        "delta_cp": 0.64,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 6.67,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 6.0,
        "cc_avg": 3.57,
        "saldo": 2.43
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 2.8,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 4.86,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.5
    },
    "split_ctx": -0.05
  },
  "ARG_B::Colon Santa Fe": {
    "time": "Colon Santa Fe",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 3.56,
        "saldo_cantos": 1.44,
        "gp": 0.0,
        "gc": 0.22,
        "saldo_gols": -0.22
      },
      "casa": {
        "cp": 6.2,
        "cc": 3.2,
        "saldo_cantos": 3.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 4.0,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.5,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.111,
        "D": 0.333,
        "tv": 0.556
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 45,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.9,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.34,
      "saldo_gols_norm": -0.22
    },
    "pressao": {
      "ratio_liga": 1.17,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 2.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 5.38,
        "delta_cp": 0.38,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.0,
        "cc_avg": 4.5,
        "saldo": -0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 7.0,
        "cc_avg": 2.0,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 2.92,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.67,
      "avg_ft_cp": 5.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.44
    },
    "split_ctx": 2.7
  },
  "ARG_B::San Miguel": {
    "time": "San Miguel",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.89,
        "cc": 3.78,
        "saldo_cantos": 0.11,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 2.6,
        "saldo_cantos": 2.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.5,
        "cc": 5.25,
        "saldo_cantos": -2.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.0,
        "D": 0.556,
        "tv": 0.444
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 35,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.13,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.03,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.89,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.4,
        "cc_avg": 5.2,
        "saldo": -2.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 5.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.2,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.6,
      "avg_ht_cp": 2.33,
      "avg_ft_cp": 3.89,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 2.5
  },
  "ARG_B::Racing Cordoba": {
    "time": "Racing Cordoba",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 4.56,
        "saldo_cantos": 0.44,
        "gp": 0.33,
        "gc": 0.0,
        "saldo_gols": 0.33
      },
      "casa": {
        "cp": 6.2,
        "cc": 3.0,
        "saldo_cantos": 3.2,
        "gp": 0.6,
        "gc": 0.0,
        "saldo_gols": 0.6
      },
      "fora": {
        "cp": 3.5,
        "cc": 6.5,
        "saldo_cantos": -3.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.0,
        "D": 0.444,
        "tv": 0.556
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.067,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 45,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": 0.18,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.1,
      "saldo_gols_norm": 0.33
    },
    "pressao": {
      "ratio_liga": 1.17,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 9.0,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.5,
        "cc_avg": 3.0,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.58,
      "cp_std": 2.12,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 2.11,
      "avg_ft_cp": 5.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.56,
      "taxa_ht_4": 0.56
    },
    "split_ctx": 2.7
  },
  "ARG_B::Patronato": {
    "time": "Patronato",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.67,
        "cc": 5.33,
        "saldo_cantos": -0.66,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 6.0,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.4,
        "cc": 4.8,
        "saldo_cantos": -0.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.111,
        "D": 0.556,
        "tv": 0.333
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 42,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.77,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.15,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.09,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.67,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.2,
        "cc_avg": 5.6,
        "saldo": -1.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 3.0,
        "cc_avg": 0.0,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 1.73,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.57,
      "avg_ht_cp": 2.67,
      "avg_ft_cp": 4.67,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.78,
      "taxa_ht_4": 0.78
    },
    "split_ctx": 0.6
  },
  "ARG_B::San Telmo": {
    "time": "San Telmo",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.89,
        "cc": 3.89,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.8,
        "cc": 2.8,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.75,
        "cc": 5.25,
        "saldo_cantos": -2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.111,
        "D": 0.333,
        "tv": 0.556
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 35,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.89,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 3.25,
        "saldo": 1.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 4.25,
        "saldo": -0.5
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 1.9,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 2.11,
      "avg_ft_cp": 3.89,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 2.05
  },
  "ARG_B::Acassuso": {
    "time": "Acassuso",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.33,
        "cc": 5.33,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 2.75,
        "saldo_cantos": 2.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.0,
        "cc": 7.4,
        "saldo_cantos": -5.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.111,
        "D": 0.556,
        "tv": 0.333
      },
      "casa": {
        "V": 0.75,
        "E": 0.25,
        "D": 0.0,
        "tv": 0.75
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.33,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.47,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.33,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.4,
        "cc_avg": 7.0,
        "saldo": -4.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.0,
        "cc_avg": 3.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.3,
      "cp_std": 2.35,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.67,
      "avg_ft_cp": 3.33,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.56,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 3.0
  },
  "ARG_B::Ferro": {
    "time": "Ferro",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 3,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 6.11,
        "cc": 3.67,
        "saldo_cantos": 2.44,
        "gp": 0.11,
        "gc": 0.0,
        "saldo_gols": 0.11
      },
      "casa": {
        "cp": 9.67,
        "cc": 1.67,
        "saldo_cantos": 8.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 4.67,
        "saldo_cantos": -0.34,
        "gp": 0.17,
        "gc": 0.0,
        "saldo_gols": 0.17
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.111,
        "D": 0.444,
        "tv": 0.444
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.167,
        "E": 0.167,
        "D": 0.667,
        "tv": 0.167
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.018,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 55,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 2.74,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.57,
      "saldo_gols_norm": 0.11
    },
    "pressao": {
      "ratio_liga": 1.43,
      "perfil": "ALTO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.25,
        "delta_cp": 0.14,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 4.5,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 12.0,
        "cc_avg": 1.0,
        "saldo": 11.0
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 3.55,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.89,
      "avg_ft_cp": 6.11,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.44
    },
    "split_ctx": 5.34
  },
  "ARG_B::Central Norte": {
    "time": "Central Norte",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 3,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.67,
        "cc": 3.89,
        "saldo_cantos": -0.22,
        "gp": 0.0,
        "gc": 0.11,
        "saldo_gols": -0.11
      },
      "casa": {
        "cp": 3.33,
        "cc": 3.67,
        "saldo_cantos": -0.34,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.83,
        "cc": 4.0,
        "saldo_cantos": -0.17,
        "gp": 0.0,
        "gc": 0.17,
        "saldo_gols": -0.17
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.111,
        "D": 0.333,
        "tv": 0.556
      },
      "casa": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 33,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.15,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.05,
      "saldo_gols_norm": -0.11
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 3.38,
        "delta_cp": -0.29,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 4.25,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 5.0,
        "cc_avg": 3.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 1.8,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 1.89,
      "avg_ft_cp": 3.67,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -0.5
  },
  "ARG_B::Deportivo Madryn": {
    "time": "Deportivo Madryn",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 2.89,
        "cc": 5.56,
        "saldo_cantos": -2.67,
        "gp": 0.0,
        "gc": 0.11,
        "saldo_gols": -0.11
      },
      "casa": {
        "cp": 3.5,
        "cc": 3.75,
        "saldo_cantos": -0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.4,
        "cc": 7.0,
        "saldo_cantos": -4.6,
        "gp": 0.0,
        "gc": 0.2,
        "saldo_gols": -0.2
      }
    },
    "ved": {
      "geral": {
        "V": 0.111,
        "E": 0.111,
        "D": 0.778,
        "tv": 0.111
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -3.0,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.62,
      "saldo_gols_norm": -0.11
    },
    "pressao": {
      "ratio_liga": 0.67,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 10.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.62,
        "delta_cp": -0.27,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 1.8,
        "cc_avg": 4.8,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 5.5,
        "saldo": 0.5
      }
    },
    "consistencia": {
      "indice": 0.32,
      "cp_std": 1.96,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 1.22,
      "avg_ft_cp": 2.89,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 1.1
  },
  "ARG_B::Almirante Brown": {
    "time": "Almirante Brown",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.56,
        "cc": 4.33,
        "saldo_cantos": -0.77,
        "gp": 0.11,
        "gc": 0.0,
        "saldo_gols": 0.11
      },
      "casa": {
        "cp": 4.75,
        "cc": 4.0,
        "saldo_cantos": 0.75,
        "gp": 0.25,
        "gc": 0.0,
        "saldo_gols": 0.25
      },
      "fora": {
        "cp": 2.6,
        "cc": 4.6,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.0,
        "D": 0.556,
        "tv": 0.444
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.031,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 32,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -1.01,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.18,
      "saldo_gols_norm": 0.11
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 6.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.5,
        "delta_cp": -0.06,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 4.0,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 3.6,
        "cc_avg": 3.6,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.44,
      "cp_std": 2.01,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 1.56,
      "avg_ft_cp": 3.56,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.44
    },
    "split_ctx": 2.15
  },
  "ARG_B::Def. de Belgrano": {
    "time": "Def. de Belgrano",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.33,
        "cc": 4.56,
        "saldo_cantos": -1.23,
        "gp": 0.0,
        "gc": 0.33,
        "saldo_gols": -0.33
      },
      "casa": {
        "cp": 5.25,
        "cc": 3.75,
        "saldo_cantos": 1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 1.8,
        "cc": 5.2,
        "saldo_cantos": -3.4,
        "gp": 0.0,
        "gc": 0.6,
        "saldo_gols": -0.6
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.111,
        "D": 0.556,
        "tv": 0.333
      },
      "casa": {
        "V": 0.75,
        "E": 0.25,
        "D": 0.0,
        "tv": 0.75
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.1,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.29,
      "saldo_gols_norm": -0.33
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 3.38,
        "delta_cp": 0.05,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 4.5,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 4.67,
        "saldo": -2.0
      }
    },
    "consistencia": {
      "indice": 0.22,
      "cp_std": 2.6,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.57,
      "avg_ht_cp": 1.89,
      "avg_ft_cp": 3.33,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.11,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 3.45
  },
  "ARG_B::Ciudad Bolivar": {
    "time": "Ciudad Bolivar",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.0,
        "cc": 5.44,
        "saldo_cantos": -2.44,
        "gp": 0.11,
        "gc": 0.0,
        "saldo_gols": 0.11
      },
      "casa": {
        "cp": 4.75,
        "cc": 3.5,
        "saldo_cantos": 1.25,
        "gp": 0.25,
        "gc": 0.0,
        "saldo_gols": 0.25
      },
      "fora": {
        "cp": 1.6,
        "cc": 7.0,
        "saldo_cantos": -5.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.037,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 27,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -2.96,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.57,
      "saldo_gols_norm": 0.11
    },
    "pressao": {
      "ratio_liga": 0.7,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 10.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 2.12,
        "delta_cp": -0.88,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 5.67,
        "saldo": -3.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 3.5,
        "saldo": 0.5
      }
    },
    "consistencia": {
      "indice": 0.03,
      "cp_std": 2.92,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.59,
      "avg_ht_cp": 1.78,
      "avg_ft_cp": 3.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.56
    },
    "split_ctx": 3.15
  },
  "ARG_B::Atl. Rafaela": {
    "time": "Atl. Rafaela",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 5,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 5.0,
        "saldo_cantos": -0.5,
        "gp": 0.5,
        "gc": 0.12,
        "saldo_gols": 0.38
      },
      "casa": {
        "cp": 5.2,
        "cc": 4.2,
        "saldo_cantos": 1.0,
        "gp": 0.8,
        "gc": 0.2,
        "saldo_gols": 0.6
      },
      "fora": {
        "cp": 3.33,
        "cc": 6.33,
        "saldo_cantos": -3.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.111,
      "perfil": "MÉDIO",
      "total_cantos_pro": 36,
      "total_gols": 4
    },
    "dissociacao": {
      "indice": -0.96,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.12,
      "saldo_gols_norm": 0.38
    },
    "pressao": {
      "ratio_liga": 1.05,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.57,
        "delta_cp": 0.07,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 2.5,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 5.67,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 2.45,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.62,
      "avg_ft_cp": 4.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.25
    },
    "split_ctx": 1.87
  },
  "ARG_B::CA Mitre": {
    "time": "CA Mitre",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 3,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.62,
        "cc": 4.25,
        "saldo_cantos": 0.37,
        "gp": 0.0,
        "gc": 0.12,
        "saldo_gols": -0.12
      },
      "casa": {
        "cp": 7.0,
        "cc": 3.33,
        "saldo_cantos": 3.67,
        "gp": 0.0,
        "gc": 0.33,
        "saldo_gols": -0.33
      },
      "fora": {
        "cp": 3.2,
        "cc": 4.8,
        "saldo_cantos": -1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.25,
        "D": 0.375,
        "tv": 0.375
      },
      "casa": {
        "V": 0.667,
        "E": 0.333,
        "D": 0.0,
        "tv": 0.667
      },
      "fora": {
        "V": 0.2,
        "E": 0.2,
        "D": 0.6,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 37,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.55,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.09,
      "saldo_gols_norm": -0.12
    },
    "pressao": {
      "ratio_liga": 1.08,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.57,
        "delta_cp": -0.05,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 3.5,
        "cc_avg": 5.5,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.75,
        "cc_avg": 2.75,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.33,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 4.62,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 3.8
  },
  "ARG_B::CA Estudiantes": {
    "time": "CA Estudiantes",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.62,
        "cc": 3.25,
        "saldo_cantos": 0.37,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.5,
        "cc": 2.0,
        "saldo_cantos": 1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.75,
        "cc": 4.5,
        "saldo_cantos": -0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.125,
        "D": 0.5,
        "tv": 0.375
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.43,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.09,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.84,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.62,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.0,
        "cc_avg": 5.5,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 1.75,
        "saldo": 3.25
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.07,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 1.62,
      "avg_ft_cp": 3.62,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.25,
      "taxa_ht_4": 0.25
    },
    "split_ctx": -0.25
  },
  "ARG_B::Los Andes": {
    "time": "Los Andes",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 6,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.33,
        "cc": 4.0,
        "saldo_cantos": -0.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.33,
        "cc": 2.17,
        "saldo_cantos": 2.16,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 1.33,
        "cc": 7.67,
        "saldo_cantos": -6.34,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.0,
        "D": 0.444,
        "tv": 0.556
      },
      "casa": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.78,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.16,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.33,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 1.0,
        "cc_avg": 12.0,
        "saldo": -11.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 3.0,
        "saldo": 0.83
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.12,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.67,
      "avg_ft_cp": 3.33,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.11
    },
    "split_ctx": 3.0
  },
  "ARG_B::Godoy Cruz": {
    "time": "Godoy Cruz",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.67,
        "cc": 3.22,
        "saldo_cantos": 2.45,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.2,
        "cc": 3.2,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 6.25,
        "cc": 3.25,
        "saldo_cantos": 3.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.111,
        "D": 0.222,
        "tv": 0.667
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 51,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 2.86,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.57,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.32,
      "perfil": "ALTO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.67,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 3.0,
        "cc_avg": 9.0,
        "saldo": -6.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.8,
        "cc_avg": 2.6,
        "saldo": 3.2
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 2.12,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 2.33,
      "avg_ft_cp": 5.67,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -1.05
  },
  "ARG_B::Deportivo Moron": {
    "time": "Deportivo Moron",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.11,
        "cc": 3.22,
        "saldo_cantos": 0.89,
        "gp": 0.22,
        "gc": 0.0,
        "saldo_gols": 0.22
      },
      "casa": {
        "cp": 4.0,
        "cc": 2.8,
        "saldo_cantos": 1.2,
        "gp": 0.4,
        "gc": 0.0,
        "saldo_gols": 0.4
      },
      "fora": {
        "cp": 4.25,
        "cc": 3.75,
        "saldo_cantos": 0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.111,
        "D": 0.333,
        "tv": 0.556
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.054,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 37,
      "total_gols": 2
    },
    "dissociacao": {
      "indice": 0.82,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.21,
      "saldo_gols_norm": 0.22
    },
    "pressao": {
      "ratio_liga": 0.96,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 2.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.12,
        "delta_cp": 0.01,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 2.0,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 2.25,
        "saldo": 2.25
      }
    },
    "consistencia": {
      "indice": 0.69,
      "cp_std": 1.27,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.59,
      "avg_ht_cp": 2.44,
      "avg_ft_cp": 4.11,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.11,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -0.25
  },
  "ARG_B::Almagro": {
    "time": "Almagro",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 5.0,
        "saldo_cantos": 0.0,
        "gp": 0.11,
        "gc": 0.67,
        "saldo_gols": -0.56
      },
      "casa": {
        "cp": 5.75,
        "cc": 4.5,
        "saldo_cantos": 1.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.4,
        "cc": 5.4,
        "saldo_cantos": -1.0,
        "gp": 0.2,
        "gc": 1.2,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.022,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 45,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 0.56,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": -0.56
    },
    "pressao": {
      "ratio_liga": 1.17,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 11.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.25,
        "delta_cp": -0.75,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 5.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.0,
        "cc_avg": 5.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.34,
      "cp_std": 3.32,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 2.11,
      "avg_ft_cp": 5.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.78
    },
    "split_ctx": 1.35
  },
  "ARG_B::Chaco For Ever": {
    "time": "Chaco For Ever",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.89,
        "cc": 4.89,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.5,
        "cc": 5.0,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.4,
        "cc": 4.8,
        "saldo_cantos": -1.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.222,
        "E": 0.111,
        "D": 0.667,
        "tv": 0.222
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.2,
        "E": 0.2,
        "D": 0.6,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 35,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.17,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.23,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.89,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 5.0,
        "saldo": -2.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 3.0,
        "cc_avg": 5.5,
        "saldo": -2.5
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.47,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 2.11,
      "avg_ft_cp": 3.89,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 1.1
  },
  "ARG_B::Deportivo Maipu": {
    "time": "Deportivo Maipu",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.89,
        "cc": 5.0,
        "saldo_cantos": -0.11,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.75,
        "saldo_cantos": 1.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.8,
        "cc": 6.0,
        "saldo_cantos": -1.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.222,
        "D": 0.444,
        "tv": 0.333
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.2,
        "E": 0.2,
        "D": 0.6,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 44,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.13,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.03,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.14,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.89,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.67,
        "cc_avg": 6.17,
        "saldo": -2.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.0,
        "cc_avg": 4.0,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.45,
      "cp_std": 2.71,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.89,
      "avg_ft_cp": 4.89,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.78,
      "taxa_ht_4": 0.44
    },
    "split_ctx": 0.2
  },
  "ARG_B::San Martin T.": {
    "time": "San Martin T.",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 2.78,
        "saldo_cantos": 1.22,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 2.2,
        "saldo_cantos": 2.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.75,
        "cc": 3.5,
        "saldo_cantos": -0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.111,
        "D": 0.333,
        "tv": 0.556
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.28,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 1.0,
        "cc_avg": 2.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 3.8,
        "cc_avg": 2.6,
        "saldo": 1.2
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.55,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.22,
      "avg_ht_cp": 0.89,
      "avg_ft_cp": 4.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.11
    },
    "split_ctx": 2.25
  },
  "ARG_B::All Boys": {
    "time": "All Boys",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.89,
        "cc": 2.44,
        "saldo_cantos": 3.45,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.8,
        "cc": 1.8,
        "saldo_cantos": 5.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.75,
        "cc": 3.25,
        "saldo_cantos": 1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.889,
        "E": 0.0,
        "D": 0.111,
        "tv": 0.889
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 4.02,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.8,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.37,
      "perfil": "ALTO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.89,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 2.0,
        "saldo": 3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.17,
        "cc_avg": 2.67,
        "saldo": 3.5
      }
    },
    "consistencia": {
      "indice": 0.7,
      "cp_std": 1.76,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 3.0,
      "avg_ft_cp": 5.89,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 2.05
  },
  "ARG_B::Temperley": {
    "time": "Temperley",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 3,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.22,
        "cc": 4.89,
        "saldo_cantos": -1.67,
        "gp": 0.11,
        "gc": 0.11,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 2.67,
        "cc": 4.67,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.0,
        "saldo_cantos": -1.5,
        "gp": 0.17,
        "gc": 0.17,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.034,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -1.95,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.39,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.75,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.22,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.2,
        "cc_avg": 6.0,
        "saldo": -2.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 3.33,
        "saldo": -0.66
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.05,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.56,
      "avg_ft_cp": 3.22,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.22
    },
    "split_ctx": -0.83
  },
  "ARG_B::Colegiales": {
    "time": "Colegiales",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.33,
        "cc": 4.33,
        "saldo_cantos": 1.0,
        "gp": 0.11,
        "gc": 0.11,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.5,
        "cc": 4.5,
        "saldo_cantos": 2.0,
        "gp": 0.25,
        "gc": 0.25,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.4,
        "cc": 4.2,
        "saldo_cantos": 0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.222,
        "D": 0.333,
        "tv": 0.444
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.2,
        "E": 0.4,
        "D": 0.4,
        "tv": 0.2
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.021,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 1.17,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.23,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.24,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.33,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 4.67,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.0,
        "cc_avg": 5.0,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 2.78,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.56,
      "avg_ft_cp": 5.33,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 2.1
  },
  "ARG_B::San Martin S.J.": {
    "time": "San Martin S.J.",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.56,
        "cc": 4.56,
        "saldo_cantos": 0.0,
        "gp": 0.22,
        "gc": 0.22,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.5,
        "cc": 5.5,
        "saldo_cantos": 1.0,
        "gp": 0.25,
        "gc": 0.5,
        "saldo_gols": -0.25
      },
      "fora": {
        "cp": 3.0,
        "cc": 3.8,
        "saldo_cantos": -0.8,
        "gp": 0.2,
        "gc": 0.0,
        "saldo_gols": 0.2
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.111,
        "D": 0.444,
        "tv": 0.444
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.049,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 41,
      "total_gols": 2
    },
    "dissociacao": {
      "indice": 0.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.06,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 7.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.86,
        "delta_cp": 0.3,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.0,
        "cc_avg": 5.0,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.0,
        "cc_avg": 4.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.1,
      "cp_std": 4.13,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 2.11,
      "avg_ft_cp": 4.56,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 3.5
  },
  "ARG_B::Agropecuario": {
    "time": "Agropecuario",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.11,
        "cc": 3.22,
        "saldo_cantos": 1.89,
        "gp": 0.11,
        "gc": 0.44,
        "saldo_gols": -0.33
      },
      "casa": {
        "cp": 5.6,
        "cc": 3.2,
        "saldo_cantos": 2.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.5,
        "cc": 3.25,
        "saldo_cantos": 1.25,
        "gp": 0.25,
        "gc": 1.0,
        "saldo_gols": -0.75
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.022,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 46,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 2.53,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.44,
      "saldo_gols_norm": -0.33
    },
    "pressao": {
      "ratio_liga": 1.19,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 5.38,
        "delta_cp": 0.27,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 0.0,
        "cc_avg": 7.0,
        "saldo": -7.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 6.4,
        "cc_avg": 2.4,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 3.22,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.89,
      "avg_ft_cp": 5.11,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 1.1
  },
  "ARG_B::Midland": {
    "time": "Midland",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 5,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.88,
        "cc": 3.12,
        "saldo_cantos": 1.76,
        "gp": 0.0,
        "gc": 0.12,
        "saldo_gols": -0.12
      },
      "casa": {
        "cp": 5.0,
        "cc": 1.2,
        "saldo_cantos": 3.8,
        "gp": 0.0,
        "gc": 0.2,
        "saldo_gols": -0.2
      },
      "fora": {
        "cp": 4.67,
        "cc": 6.33,
        "saldo_cantos": -1.66,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 39,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 2.17,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.41,
      "saldo_gols_norm": -0.12
    },
    "pressao": {
      "ratio_liga": 1.14,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 1.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.86,
        "delta_cp": -0.02,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 2.0,
        "cc_avg": 0.0,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 7.33,
        "cc_avg": 3.0,
        "saldo": 4.33
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 2.36,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 2.5,
      "avg_ft_cp": 4.88,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 0.33
  },
  "ARG_B::Atletico Atlanta": {
    "time": "Atletico Atlanta",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 6,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.22,
        "cc": 3.89,
        "saldo_cantos": 1.33,
        "gp": 0.33,
        "gc": 0.11,
        "saldo_gols": 0.22
      },
      "casa": {
        "cp": 5.5,
        "cc": 3.67,
        "saldo_cantos": 1.83,
        "gp": 0.17,
        "gc": 0.0,
        "saldo_gols": 0.17
      },
      "fora": {
        "cp": 4.67,
        "cc": 4.33,
        "saldo_cantos": 0.34,
        "gp": 0.67,
        "gc": 0.33,
        "saldo_gols": 0.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.778,
        "E": 0.0,
        "D": 0.222,
        "tv": 0.778
      },
      "casa": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.064,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": 1.33,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.31,
      "saldo_gols_norm": 0.22
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.5,
        "avg_cc": 6.5,
        "delta_cp": 0.28,
        "delta_cc": 2.61,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.14,
        "delta_cp": -0.08,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 4.33,
        "saldo": 0.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 3.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 2.28,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.56,
      "avg_ft_cp": 5.22,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.56
    },
    "split_ctx": 0.83
  },
  "ARG_B::Nueva Chicago": {
    "time": "Nueva Chicago",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 3,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 2.0,
        "cc": 7.0,
        "saldo_cantos": -5.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.0,
        "cc": 5.33,
        "saldo_cantos": -2.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 1.4,
        "cc": 8.0,
        "saldo_cantos": -6.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.125,
        "D": 0.875,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.333,
        "D": 0.667,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 16,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -5.83,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -1.17,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.47,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.6,
        "cc_avg": 6.6,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 1.0,
        "cc_avg": 7.67,
        "saldo": -6.67
      }
    },
    "consistencia": {
      "indice": 0.35,
      "cp_std": 1.31,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 0.88,
      "avg_ft_cp": 2.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 1.6
  },
  "ARG_B::Gimnasia y Tiro": {
    "time": "Gimnasia y Tiro",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 6,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 3.78,
        "saldo_cantos": 1.22,
        "gp": 0.11,
        "gc": 0.11,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.0,
        "cc": 3.67,
        "saldo_cantos": 2.33,
        "gp": 0.17,
        "gc": 0.17,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 4.0,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.111,
        "D": 0.222,
        "tv": 0.667
      },
      "casa": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "fora": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.022,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 45,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 1.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.28,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.17,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.0,
        "cc_avg": 2.5,
        "saldo": 1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.5,
        "cc_avg": 4.5,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 2.6,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 2.89,
      "avg_ft_cp": 5.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 3.0
  },
  "ARG_B::Chacarita Juniors": {
    "time": "Chacarita Juniors",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.33,
        "cc": 3.33,
        "saldo_cantos": 1.0,
        "gp": 0.0,
        "gc": 0.11,
        "saldo_gols": -0.11
      },
      "casa": {
        "cp": 3.2,
        "cc": 4.0,
        "saldo_cantos": -0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.75,
        "cc": 2.5,
        "saldo_cantos": 3.25,
        "gp": 0.0,
        "gc": 0.25,
        "saldo_gols": -0.25
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 39,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.28,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.23,
      "saldo_gols_norm": -0.11
    },
    "pressao": {
      "ratio_liga": 1.01,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.33,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.25,
        "cc_avg": 1.75,
        "saldo": 2.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 7.0,
        "cc_avg": 5.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.6,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.56,
      "avg_ft_cp": 4.33,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -2.55
  },
  "ARG_B::Club A. Guemes": {
    "time": "Club A. Guemes",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.22,
        "cc": 5.89,
        "saldo_cantos": -1.67,
        "gp": 0.11,
        "gc": 0.11,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.4,
        "cc": 3.2,
        "saldo_cantos": 1.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 9.25,
        "saldo_cantos": -5.25,
        "gp": 0.25,
        "gc": 0.25,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.222,
        "E": 0.0,
        "D": 0.778,
        "tv": 0.222
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.026,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 38,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -1.95,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.39,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.98,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.22,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 5.5,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 5.5,
        "cc_avg": 3.0,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.31,
      "cp_std": 2.91,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 1.89,
      "avg_ft_cp": 4.22,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.56,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 0.4
  },
  "ARG_B::Quilmes": {
    "time": "Quilmes",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 4,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.33,
        "cc": 3.89,
        "saldo_cantos": -0.56,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.75,
        "cc": 4.75,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 3.2,
        "saldo_cantos": -0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.65,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.13,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.33,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 3.5,
        "cc_avg": 5.5,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.0,
        "cc_avg": 2.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.31,
      "cp_std": 2.29,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 1.44,
      "avg_ft_cp": 3.33,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.22,
      "taxa_ht_4": 0.22
    },
    "split_ctx": 0.75
  },
  "ARG_B::Tristan Suarez": {
    "time": "Tristan Suarez",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.12,
        "cc": 4.5,
        "saldo_cantos": -1.38,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.0,
        "cc": 3.75,
        "saldo_cantos": -0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.25,
        "cc": 5.25,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.25,
        "E": 0.125,
        "D": 0.625,
        "tv": 0.25
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 25,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.61,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.32,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.73,
      "perfil": "BAIXO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.12,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 7.5,
        "saldo": -5.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 3.0,
        "saldo": 0.75
      }
    },
    "consistencia": {
      "indice": 0.6,
      "cp_std": 1.25,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.5,
      "avg_ft_cp": 3.12,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.25
    },
    "split_ctx": -0.25
  },
  "ARG_B::Gimnasia Jujuy": {
    "time": "Gimnasia Jujuy",
    "liga": "ARG_B",
    "liga_nome": "Primera Nacional Argentina",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.78,
        "cc": 5.11,
        "saldo_cantos": 0.67,
        "gp": 0.67,
        "gc": 0.11,
        "saldo_gols": 0.56
      },
      "casa": {
        "cp": 5.8,
        "cc": 6.4,
        "saldo_cantos": -0.6,
        "gp": 1.2,
        "gc": 0.2,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 5.75,
        "cc": 3.5,
        "saldo_cantos": 2.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.111,
        "D": 0.222,
        "tv": 0.667
      },
      "casa": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.115,
      "perfil": "MÉDIO",
      "total_cantos_pro": 52,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 0.22,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.16,
      "saldo_gols_norm": 0.56
    },
    "pressao": {
      "ratio_liga": 1.35,
      "perfil": "ALTO",
      "media_liga_ft": 4.29
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 11.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.12,
        "delta_cp": 0.34,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 5.75,
        "cc_avg": 4.75,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.5,
        "cc_avg": 4.0,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.6,
      "cp_std": 2.33,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 3.11,
      "avg_ft_cp": 5.78,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.78,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 0.05
  },
  "BUN::Union Berlin": {
    "time": "Union Berlin",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.72,
        "cc": 4.41,
        "saldo_cantos": 0.31,
        "gp": 0.03,
        "gc": 0.1,
        "saldo_gols": -0.07
      },
      "casa": {
        "cp": 4.79,
        "cc": 4.07,
        "saldo_cantos": 0.72,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.67,
        "cc": 4.73,
        "saldo_cantos": -0.06,
        "gp": 0.07,
        "gc": 0.2,
        "saldo_gols": -0.13
      }
    },
    "ved": {
      "geral": {
        "V": 0.448,
        "E": 0.172,
        "D": 0.379,
        "tv": 0.448
      },
      "casa": {
        "V": 0.429,
        "E": 0.214,
        "D": 0.357,
        "tv": 0.429
      },
      "fora": {
        "V": 0.467,
        "E": 0.133,
        "D": 0.4,
        "tv": 0.467
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.007,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 137,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 0.39,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": -0.07
    },
    "pressao": {
      "ratio_liga": 0.98,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.75,
        "avg_cc": 6.25,
        "delta_cp": -0.97,
        "delta_cc": 1.84,
        "n": 8
      },
      "perdeu": {
        "avg_cp": 5.14,
        "avg_cc": 4.21,
        "delta_cp": 0.42,
        "delta_cc": -0.2,
        "n": 14
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.28,
        "n": 7
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 5.45,
        "cc_avg": 5.09,
        "saldo": 0.36
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 5.0,
        "cc_avg": 4.09,
        "saldo": 0.91
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.67,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.28,
      "avg_ft_cp": 4.72,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.55
    },
    "split_ctx": 0.12
  },
  "BUN::Bayern Munich": {
    "time": "Bayern Munich",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 6.14,
        "cc": 3.24,
        "saldo_cantos": 2.9,
        "gp": 0.17,
        "gc": 0.0,
        "saldo_gols": 0.17
      },
      "casa": {
        "cp": 7.14,
        "cc": 2.93,
        "saldo_cantos": 4.21,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.2,
        "cc": 3.53,
        "saldo_cantos": 1.67,
        "gp": 0.33,
        "gc": 0.0,
        "saldo_gols": 0.33
      }
    },
    "ved": {
      "geral": {
        "V": 0.759,
        "E": 0.034,
        "D": 0.207,
        "tv": 0.759
      },
      "casa": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "fora": {
        "V": 0.667,
        "E": 0.067,
        "D": 0.267,
        "tv": 0.667
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.028,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 178,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": 2.85,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.6,
      "saldo_gols_norm": 0.17
    },
    "pressao": {
      "ratio_liga": 1.28,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.08,
        "avg_cc": 3.36,
        "delta_cp": -0.06,
        "delta_cc": 0.12,
        "n": 25
      },
      "perdeu": {
        "avg_cp": 9.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 5.67,
        "delta_cp": -0.47,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 9,
        "cp_avg": 5.22,
        "cc_avg": 4.22,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 6.82,
        "cc_avg": 2.64,
        "saldo": 4.18
      }
    },
    "consistencia": {
      "indice": 0.57,
      "cp_std": 2.67,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 2.52,
      "avg_ft_cp": 6.14,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.48,
      "taxa_ht_4": 0.34
    },
    "split_ctx": 1.94
  },
  "BUN::Freiburg": {
    "time": "Freiburg",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.45,
        "cc": 4.21,
        "saldo_cantos": 0.24,
        "gp": 0.03,
        "gc": 0.0,
        "saldo_gols": 0.03
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.64,
        "saldo_cantos": 1.36,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.93,
        "cc": 4.73,
        "saldo_cantos": -0.8,
        "gp": 0.07,
        "gc": 0.0,
        "saldo_gols": 0.07
      }
    },
    "ved": {
      "geral": {
        "V": 0.414,
        "E": 0.172,
        "D": 0.414,
        "tv": 0.414
      },
      "casa": {
        "V": 0.5,
        "E": 0.214,
        "D": 0.286,
        "tv": 0.5
      },
      "fora": {
        "V": 0.333,
        "E": 0.133,
        "D": 0.533,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.008,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 129,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 0.22,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.05,
      "saldo_gols_norm": 0.03
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.18,
        "avg_cc": 3.45,
        "delta_cp": -0.27,
        "delta_cc": -0.76,
        "n": 11
      },
      "perdeu": {
        "avg_cp": 4.64,
        "avg_cc": 5.0,
        "delta_cp": 0.19,
        "delta_cc": 0.79,
        "n": 11
      },
      "empatou": {
        "avg_cp": 4.57,
        "delta_cp": 0.12,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 10,
        "cp_avg": 4.7,
        "cc_avg": 4.3,
        "saldo": 0.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 4.36,
        "cc_avg": 4.36,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 2.13,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.24,
      "avg_ft_cp": 4.45,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.41,
      "taxa_ht_4": 0.34
    },
    "split_ctx": 1.07
  },
  "BUN::Bayer Leverkusen": {
    "time": "Bayer Leverkusen",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 5.28,
        "cc": 4.17,
        "saldo_cantos": 1.11,
        "gp": 0.03,
        "gc": 0.0,
        "saldo_gols": 0.03
      },
      "casa": {
        "cp": 6.29,
        "cc": 3.29,
        "saldo_cantos": 3.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 5.0,
        "saldo_cantos": -0.67,
        "gp": 0.07,
        "gc": 0.0,
        "saldo_gols": 0.07
      }
    },
    "ved": {
      "geral": {
        "V": 0.586,
        "E": 0.138,
        "D": 0.276,
        "tv": 0.586
      },
      "casa": {
        "V": 0.643,
        "E": 0.143,
        "D": 0.214,
        "tv": 0.643
      },
      "fora": {
        "V": 0.533,
        "E": 0.133,
        "D": 0.333,
        "tv": 0.533
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.007,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 153,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 1.13,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.23,
      "saldo_gols_norm": 0.03
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.47,
        "avg_cc": 4.67,
        "delta_cp": 0.19,
        "delta_cc": 0.5,
        "n": 15
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 4.57,
        "delta_cp": 0.72,
        "delta_cc": 0.4,
        "n": 7
      },
      "empatou": {
        "avg_cp": 4.14,
        "delta_cp": -1.14,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 8,
        "cp_avg": 5.88,
        "cc_avg": 3.88,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 5.91,
        "cc_avg": 4.18,
        "saldo": 1.73
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 2.83,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.9,
      "avg_ft_cp": 5.28,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.48
    },
    "split_ctx": 1.96
  },
  "BUN::Hamburger SV": {
    "time": "Hamburger SV",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 3.76,
        "cc": 5.59,
        "saldo_cantos": -1.83,
        "gp": 0.0,
        "gc": 0.14,
        "saldo_gols": -0.14
      },
      "casa": {
        "cp": 3.87,
        "cc": 5.67,
        "saldo_cantos": -1.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.64,
        "cc": 5.5,
        "saldo_cantos": -1.86,
        "gp": 0.0,
        "gc": 0.29,
        "saldo_gols": -0.29
      }
    },
    "ved": {
      "geral": {
        "V": 0.241,
        "E": 0.069,
        "D": 0.69,
        "tv": 0.241
      },
      "casa": {
        "V": 0.267,
        "E": 0.067,
        "D": 0.667,
        "tv": 0.267
      },
      "fora": {
        "V": 0.214,
        "E": 0.071,
        "D": 0.714,
        "tv": 0.214
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 109,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.77,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.38,
      "saldo_gols_norm": -0.14
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 6.43,
        "delta_cp": 0.24,
        "delta_cc": 0.84,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 3.67,
        "avg_cc": 4.83,
        "delta_cp": -0.09,
        "delta_cc": -0.76,
        "n": 12
      },
      "empatou": {
        "avg_cp": 3.7,
        "delta_cp": -0.06,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 10,
        "cp_avg": 3.1,
        "cc_avg": 6.7,
        "saldo": -3.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 12,
        "cp_avg": 4.42,
        "cc_avg": 5.67,
        "saldo": -1.25
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 2.39,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.79,
      "avg_ft_cp": 3.76,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.41,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 0.23
  },
  "BUN::RB Leipzig": {
    "time": "RB Leipzig",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 5.41,
        "cc": 4.31,
        "saldo_cantos": 1.1,
        "gp": 0.03,
        "gc": 0.0,
        "saldo_gols": 0.03
      },
      "casa": {
        "cp": 5.8,
        "cc": 4.47,
        "saldo_cantos": 1.33,
        "gp": 0.07,
        "gc": 0.0,
        "saldo_gols": 0.07
      },
      "fora": {
        "cp": 5.0,
        "cc": 4.14,
        "saldo_cantos": 0.86,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.586,
        "E": 0.103,
        "D": 0.31,
        "tv": 0.586
      },
      "casa": {
        "V": 0.6,
        "E": 0.067,
        "D": 0.333,
        "tv": 0.6
      },
      "fora": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.006,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 157,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": 1.12,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.23,
      "saldo_gols_norm": 0.03
    },
    "pressao": {
      "ratio_liga": 1.13,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.53,
        "avg_cc": 3.88,
        "delta_cp": 0.12,
        "delta_cc": -0.43,
        "n": 17
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 5.57,
        "delta_cp": -0.41,
        "delta_cc": 1.26,
        "n": 7
      },
      "empatou": {
        "avg_cp": 5.6,
        "delta_cp": 0.19,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 9,
        "cp_avg": 4.78,
        "cc_avg": 5.33,
        "saldo": -0.55
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 13,
        "cp_avg": 5.69,
        "cc_avg": 4.31,
        "saldo": 1.38
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 3.11,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.52,
      "avg_ft_cp": 5.41,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.52,
      "taxa_ht_4": 0.41
    },
    "split_ctx": 0.8
  },
  "BUN::Werder Bremen": {
    "time": "Werder Bremen",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.52,
        "cc": 4.76,
        "saldo_cantos": -0.24,
        "gp": 0.03,
        "gc": 0.1,
        "saldo_gols": -0.07
      },
      "casa": {
        "cp": 4.57,
        "cc": 3.36,
        "saldo_cantos": 1.21,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.47,
        "cc": 6.07,
        "saldo_cantos": -1.6,
        "gp": 0.07,
        "gc": 0.2,
        "saldo_gols": -0.13
      }
    },
    "ved": {
      "geral": {
        "V": 0.448,
        "E": 0.069,
        "D": 0.483,
        "tv": 0.448
      },
      "casa": {
        "V": 0.643,
        "E": 0.0,
        "D": 0.357,
        "tv": 0.643
      },
      "fora": {
        "V": 0.267,
        "E": 0.133,
        "D": 0.6,
        "tv": 0.267
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.008,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 131,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -0.18,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.05,
      "saldo_gols_norm": -0.07
    },
    "pressao": {
      "ratio_liga": 0.94,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.14,
        "avg_cc": 4.29,
        "delta_cp": 0.62,
        "delta_cc": -0.47,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 4.27,
        "avg_cc": 5.13,
        "delta_cp": -0.25,
        "delta_cc": 0.37,
        "n": 15
      },
      "empatou": {
        "avg_cp": 4.43,
        "delta_cp": -0.09,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 9,
        "cp_avg": 3.78,
        "cc_avg": 6.11,
        "saldo": -2.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 12,
        "cp_avg": 5.42,
        "cc_avg": 4.83,
        "saldo": 0.59
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 3.01,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 4.52,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.52
    },
    "split_ctx": 0.1
  },
  "BUN::B. Monchengladbach": {
    "time": "B. Monchengladbach",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.07,
        "cc": 4.79,
        "saldo_cantos": -0.72,
        "gp": 0.0,
        "gc": 0.03,
        "saldo_gols": -0.03
      },
      "casa": {
        "cp": 3.79,
        "cc": 3.93,
        "saldo_cantos": -0.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 5.6,
        "saldo_cantos": -1.27,
        "gp": 0.0,
        "gc": 0.07,
        "saldo_gols": -0.07
      }
    },
    "ved": {
      "geral": {
        "V": 0.345,
        "E": 0.172,
        "D": 0.483,
        "tv": 0.345
      },
      "casa": {
        "V": 0.357,
        "E": 0.214,
        "D": 0.429,
        "tv": 0.357
      },
      "fora": {
        "V": 0.333,
        "E": 0.133,
        "D": 0.533,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 118,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.72,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.15,
      "saldo_gols_norm": -0.03
    },
    "pressao": {
      "ratio_liga": 0.85,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.43,
        "avg_cc": 4.57,
        "delta_cp": -0.64,
        "delta_cc": -0.22,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 4.54,
        "avg_cc": 5.54,
        "delta_cp": 0.47,
        "delta_cc": 0.75,
        "n": 13
      },
      "empatou": {
        "avg_cp": 3.89,
        "delta_cp": -0.18,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 10,
        "cp_avg": 3.4,
        "cc_avg": 5.9,
        "saldo": -2.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 10,
        "cp_avg": 3.5,
        "cc_avg": 4.1,
        "saldo": -0.6
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.45,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 2.07,
      "avg_ft_cp": 4.07,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.34
    },
    "split_ctx": -0.54
  },
  "BUN::Dortmund": {
    "time": "Dortmund",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 5.55,
        "cc": 4.55,
        "saldo_cantos": 1.0,
        "gp": 0.0,
        "gc": 0.03,
        "saldo_gols": -0.03
      },
      "casa": {
        "cp": 7.47,
        "cc": 3.73,
        "saldo_cantos": 3.74,
        "gp": 0.0,
        "gc": 0.07,
        "saldo_gols": -0.07
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.43,
        "saldo_cantos": -1.93,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.414,
        "E": 0.138,
        "D": 0.448,
        "tv": 0.414
      },
      "casa": {
        "V": 0.6,
        "E": 0.267,
        "D": 0.133,
        "tv": 0.6
      },
      "fora": {
        "V": 0.214,
        "E": 0.0,
        "D": 0.786,
        "tv": 0.214
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 161,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.07,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.21,
      "saldo_gols_norm": -0.03
    },
    "pressao": {
      "ratio_liga": 1.16,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.53,
        "avg_cc": 4.68,
        "delta_cp": 0.98,
        "delta_cc": 0.13,
        "n": 19
      },
      "perdeu": {
        "avg_cp": 4.33,
        "avg_cc": 3.67,
        "delta_cp": -1.22,
        "delta_cc": -0.88,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.43,
        "delta_cp": -2.12,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 9,
        "cp_avg": 4.0,
        "cc_avg": 5.33,
        "saldo": -1.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 13,
        "cp_avg": 7.62,
        "cc_avg": 3.92,
        "saldo": 3.7
      }
    },
    "consistencia": {
      "indice": 0.32,
      "cp_std": 3.77,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 2.28,
      "avg_ft_cp": 5.55,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.52,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 3.97
  },
  "BUN::Eintracht Frankfurt": {
    "time": "Eintracht Frankfurt",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.52,
        "cc": 4.28,
        "saldo_cantos": 0.24,
        "gp": 0.07,
        "gc": 0.03,
        "saldo_gols": 0.04
      },
      "casa": {
        "cp": 5.21,
        "cc": 3.57,
        "saldo_cantos": 1.64,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.87,
        "cc": 4.93,
        "saldo_cantos": -1.06,
        "gp": 0.13,
        "gc": 0.07,
        "saldo_gols": 0.06
      }
    },
    "ved": {
      "geral": {
        "V": 0.414,
        "E": 0.138,
        "D": 0.448,
        "tv": 0.414
      },
      "casa": {
        "V": 0.571,
        "E": 0.071,
        "D": 0.357,
        "tv": 0.571
      },
      "fora": {
        "V": 0.267,
        "E": 0.2,
        "D": 0.533,
        "tv": 0.267
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.015,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 131,
      "total_gols": 2
    },
    "dissociacao": {
      "indice": 0.21,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.05,
      "saldo_gols_norm": 0.04
    },
    "pressao": {
      "ratio_liga": 0.94,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.27,
        "avg_cc": 4.45,
        "delta_cp": -0.25,
        "delta_cc": 0.17,
        "n": 11
      },
      "perdeu": {
        "avg_cp": 4.22,
        "avg_cc": 4.89,
        "delta_cp": -0.3,
        "delta_cc": 0.61,
        "n": 9
      },
      "empatou": {
        "avg_cp": 5.11,
        "delta_cp": 0.59,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 9,
        "cp_avg": 4.11,
        "cc_avg": 5.22,
        "saldo": -1.11
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 12,
        "cp_avg": 5.5,
        "cc_avg": 4.08,
        "saldo": 1.42
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 3.03,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.17,
      "avg_ft_cp": 4.52,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 1.34
  },
  "BUN::Augsburg": {
    "time": "Augsburg",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 4.48,
        "cc": 5.41,
        "saldo_cantos": -0.93,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.13,
        "cc": 5.33,
        "saldo_cantos": -0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.79,
        "cc": 5.5,
        "saldo_cantos": -1.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.276,
        "E": 0.241,
        "D": 0.483,
        "tv": 0.276
      },
      "casa": {
        "V": 0.333,
        "E": 0.267,
        "D": 0.4,
        "tv": 0.333
      },
      "fora": {
        "V": 0.214,
        "E": 0.214,
        "D": 0.571,
        "tv": 0.214
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 130,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.97,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.19,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.78,
        "avg_cc": 5.78,
        "delta_cp": 1.3,
        "delta_cc": 0.37,
        "n": 9
      },
      "perdeu": {
        "avg_cp": 3.71,
        "avg_cc": 4.79,
        "delta_cp": -0.77,
        "delta_cc": -0.62,
        "n": 14
      },
      "empatou": {
        "avg_cp": 4.33,
        "delta_cp": -0.15,
        "n": 6
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 3.91,
        "cc_avg": 5.91,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 4.36,
        "cc_avg": 4.82,
        "saldo": -0.46
      }
    },
    "consistencia": {
      "indice": 0.44,
      "cp_std": 2.52,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.21,
      "avg_ft_cp": 4.48,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.52,
      "taxa_ht_4": 0.59
    },
    "split_ctx": 1.34
  },
  "BUN::FC Koln": {
    "time": "FC Koln",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 4.62,
        "cc": 5.66,
        "saldo_cantos": -1.04,
        "gp": 0.1,
        "gc": 0.03,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 4.93,
        "cc": 4.73,
        "saldo_cantos": 0.2,
        "gp": 0.2,
        "gc": 0.07,
        "saldo_gols": 0.13
      },
      "fora": {
        "cp": 4.29,
        "cc": 6.64,
        "saldo_cantos": -2.35,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.379,
        "E": 0.103,
        "D": 0.517,
        "tv": 0.379
      },
      "casa": {
        "V": 0.467,
        "E": 0.133,
        "D": 0.4,
        "tv": 0.467
      },
      "fora": {
        "V": 0.286,
        "E": 0.071,
        "D": 0.643,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.022,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 134,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": -1.15,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.22,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.96,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.86,
        "avg_cc": 5.86,
        "delta_cp": 0.24,
        "delta_cc": 0.2,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 5.08,
        "avg_cc": 6.08,
        "delta_cp": 0.46,
        "delta_cc": 0.42,
        "n": 13
      },
      "empatou": {
        "avg_cp": 3.78,
        "delta_cp": -0.84,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 10,
        "cp_avg": 4.9,
        "cc_avg": 7.8,
        "saldo": -2.9
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 10,
        "cp_avg": 5.1,
        "cc_avg": 3.7,
        "saldo": 1.4
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 2.48,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.03,
      "avg_ft_cp": 4.62,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.48,
      "taxa_ht_4": 0.48
    },
    "split_ctx": 0.64
  },
  "BUN::Hoffenheim": {
    "time": "Hoffenheim",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 5.62,
        "cc": 5.0,
        "saldo_cantos": 0.62,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.64,
        "cc": 4.57,
        "saldo_cantos": 2.07,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.67,
        "cc": 5.4,
        "saldo_cantos": -0.73,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.379,
        "E": 0.241,
        "D": 0.379,
        "tv": 0.379
      },
      "casa": {
        "V": 0.5,
        "E": 0.286,
        "D": 0.214,
        "tv": 0.5
      },
      "fora": {
        "V": 0.267,
        "E": 0.2,
        "D": 0.533,
        "tv": 0.267
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 163,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.65,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.13,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.17,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.57,
        "avg_cc": 5.07,
        "delta_cp": -1.05,
        "delta_cc": 0.07,
        "n": 14
      },
      "perdeu": {
        "avg_cp": 6.11,
        "avg_cc": 5.11,
        "delta_cp": 0.49,
        "delta_cc": 0.11,
        "n": 9
      },
      "empatou": {
        "avg_cp": 7.33,
        "delta_cp": 1.71,
        "n": 6
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 8,
        "cp_avg": 3.75,
        "cc_avg": 5.12,
        "saldo": -1.37
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 12,
        "cp_avg": 7.17,
        "cc_avg": 3.83,
        "saldo": 3.34
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 3.18,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.97,
      "avg_ft_cp": 5.62,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.66,
      "taxa_ht_4": 0.62
    },
    "split_ctx": 1.97
  },
  "BUN::Wolfsburg": {
    "time": "Wolfsburg",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 4.03,
        "cc": 7.76,
        "saldo_cantos": -3.73,
        "gp": 0.03,
        "gc": 0.07,
        "saldo_gols": -0.04
      },
      "casa": {
        "cp": 5.2,
        "cc": 6.33,
        "saldo_cantos": -1.13,
        "gp": 0.07,
        "gc": 0.13,
        "saldo_gols": -0.06
      },
      "fora": {
        "cp": 2.79,
        "cc": 9.29,
        "saldo_cantos": -6.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.276,
        "E": 0.069,
        "D": 0.655,
        "tv": 0.276
      },
      "casa": {
        "V": 0.4,
        "E": 0.133,
        "D": 0.467,
        "tv": 0.4
      },
      "fora": {
        "V": 0.143,
        "E": 0.0,
        "D": 0.857,
        "tv": 0.143
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.009,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 117,
      "total_gols": 1
    },
    "dissociacao": {
      "indice": -3.84,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.78,
      "saldo_gols_norm": -0.04
    },
    "pressao": {
      "ratio_liga": 0.84,
      "perfil": "BAIXO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.2,
        "avg_cc": 6.8,
        "delta_cp": -0.83,
        "delta_cc": -0.96,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 4.17,
        "avg_cc": 7.5,
        "delta_cp": 0.14,
        "delta_cc": -0.26,
        "n": 18
      },
      "empatou": {
        "avg_cp": 4.33,
        "delta_cp": 0.3,
        "n": 6
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 3.64,
        "cc_avg": 7.82,
        "saldo": -4.18
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 10,
        "cp_avg": 5.2,
        "cc_avg": 5.9,
        "saldo": -0.7
      }
    },
    "consistencia": {
      "indice": 0.38,
      "cp_std": 2.51,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.48,
      "avg_ft_cp": 4.03,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.76,
      "taxa_ht_4": 0.52
    },
    "split_ctx": 2.41
  },
  "BUN::Stuttgart": {
    "time": "Stuttgart",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 5.45,
        "cc": 4.0,
        "saldo_cantos": 1.45,
        "gp": 0.14,
        "gc": 0.0,
        "saldo_gols": 0.14
      },
      "casa": {
        "cp": 5.27,
        "cc": 4.0,
        "saldo_cantos": 1.27,
        "gp": 0.27,
        "gc": 0.0,
        "saldo_gols": 0.27
      },
      "fora": {
        "cp": 5.64,
        "cc": 4.0,
        "saldo_cantos": 1.64,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.586,
        "E": 0.172,
        "D": 0.241,
        "tv": 0.586
      },
      "casa": {
        "V": 0.533,
        "E": 0.133,
        "D": 0.333,
        "tv": 0.533
      },
      "fora": {
        "V": 0.643,
        "E": 0.214,
        "D": 0.143,
        "tv": 0.643
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.025,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 158,
      "total_gols": 4
    },
    "dissociacao": {
      "indice": 1.37,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.3,
      "saldo_gols_norm": 0.14
    },
    "pressao": {
      "ratio_liga": 1.13,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.94,
        "avg_cc": 3.76,
        "delta_cp": 0.49,
        "delta_cc": -0.24,
        "n": 17
      },
      "perdeu": {
        "avg_cp": 5.14,
        "avg_cc": 4.57,
        "delta_cp": -0.31,
        "delta_cc": 0.57,
        "n": 7
      },
      "empatou": {
        "avg_cp": 4.2,
        "delta_cp": -1.25,
        "n": 5
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 7,
        "cp_avg": 4.14,
        "cc_avg": 3.71,
        "saldo": 0.43
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 14,
        "cp_avg": 5.43,
        "cc_avg": 3.93,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.52,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.9,
      "avg_ft_cp": 5.45,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.55
    },
    "split_ctx": -0.37
  },
  "BUN::Mainz": {
    "time": "Mainz",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 4.52,
        "saldo_cantos": 0.48,
        "gp": 0.0,
        "gc": 0.03,
        "saldo_gols": -0.03
      },
      "casa": {
        "cp": 6.27,
        "cc": 3.47,
        "saldo_cantos": 2.8,
        "gp": 0.0,
        "gc": 0.07,
        "saldo_gols": -0.07
      },
      "fora": {
        "cp": 3.64,
        "cc": 5.64,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.483,
        "E": 0.034,
        "D": 0.483,
        "tv": 0.483
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.143,
        "E": 0.071,
        "D": 0.786,
        "tv": 0.143
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 145,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.53,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.1,
      "saldo_gols_norm": -0.03
    },
    "pressao": {
      "ratio_liga": 1.04,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.88,
        "avg_cc": 4.5,
        "delta_cp": 0.88,
        "delta_cc": -0.02,
        "n": 8
      },
      "perdeu": {
        "avg_cp": 4.58,
        "avg_cc": 5.0,
        "delta_cp": -0.42,
        "delta_cc": 0.48,
        "n": 12
      },
      "empatou": {
        "avg_cp": 4.78,
        "delta_cp": -0.22,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 3.64,
        "cc_avg": 5.64,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 11,
        "cp_avg": 7.45,
        "cc_avg": 3.73,
        "saldo": 3.72
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 3.14,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.86,
      "avg_ft_cp": 5.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.52,
      "taxa_ht_4": 0.41
    },
    "split_ctx": 2.63
  },
  "BUN::St. Pauli": {
    "time": "St. Pauli",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 14,
      "fora": 15
    },
    "base": {
      "geral": {
        "cp": 4.38,
        "cc": 5.0,
        "saldo_cantos": -0.62,
        "gp": 0.0,
        "gc": 0.17,
        "saldo_gols": -0.17
      },
      "casa": {
        "cp": 5.43,
        "cc": 3.79,
        "saldo_cantos": 1.64,
        "gp": 0.0,
        "gc": 0.36,
        "saldo_gols": -0.36
      },
      "fora": {
        "cp": 3.4,
        "cc": 6.13,
        "saldo_cantos": -2.73,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.414,
        "E": 0.138,
        "D": 0.448,
        "tv": 0.414
      },
      "casa": {
        "V": 0.714,
        "E": 0.071,
        "D": 0.214,
        "tv": 0.714
      },
      "fora": {
        "V": 0.133,
        "E": 0.2,
        "D": 0.667,
        "tv": 0.133
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 127,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.48,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.13,
      "saldo_gols_norm": -0.17
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.14,
        "avg_cc": 5.86,
        "delta_cp": -0.24,
        "delta_cc": 0.86,
        "n": 7
      },
      "perdeu": {
        "avg_cp": 4.47,
        "avg_cc": 4.6,
        "delta_cp": 0.09,
        "delta_cc": -0.4,
        "n": 15
      },
      "empatou": {
        "avg_cp": 4.43,
        "delta_cp": 0.05,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 5.0,
        "cc_avg": 5.73,
        "saldo": -0.73
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 9,
        "cp_avg": 4.44,
        "cc_avg": 4.22,
        "saldo": 0.22
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.48,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.1,
      "avg_ft_cp": 4.38,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.52,
      "taxa_ht_4": 0.41
    },
    "split_ctx": 2.03
  },
  "BUN::Heidenheim": {
    "time": "Heidenheim",
    "liga": "BUN",
    "liga_nome": "Bundesliga 2026",
    "n": {
      "geral": 29,
      "casa": 15,
      "fora": 14
    },
    "base": {
      "geral": {
        "cp": 4.45,
        "cc": 4.79,
        "saldo_cantos": -0.34,
        "gp": 0.1,
        "gc": 0.03,
        "saldo_gols": 0.07
      },
      "casa": {
        "cp": 4.47,
        "cc": 4.47,
        "saldo_cantos": 0.0,
        "gp": 0.2,
        "gc": 0.07,
        "saldo_gols": 0.13
      },
      "fora": {
        "cp": 4.43,
        "cc": 5.14,
        "saldo_cantos": -0.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.414,
        "E": 0.069,
        "D": 0.517,
        "tv": 0.414
      },
      "casa": {
        "V": 0.533,
        "E": 0.0,
        "D": 0.467,
        "tv": 0.533
      },
      "fora": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.023,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 129,
      "total_gols": 3
    },
    "dissociacao": {
      "indice": -0.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.07,
      "saldo_gols_norm": 0.07
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.8
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.75,
        "avg_cc": 4.5,
        "delta_cp": 0.3,
        "delta_cc": -0.29,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 4.28,
        "avg_cc": 4.83,
        "delta_cp": -0.17,
        "delta_cc": 0.04,
        "n": 18
      },
      "empatou": {
        "avg_cp": 4.71,
        "delta_cp": 0.26,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 11,
        "cp_avg": 2.82,
        "cc_avg": 5.18,
        "saldo": -2.36
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 10,
        "cp_avg": 6.1,
        "cc_avg": 4.4,
        "saldo": 1.7
      }
    },
    "consistencia": {
      "indice": 0.27,
      "cp_std": 3.26,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.38,
      "avg_ht_cp": 1.69,
      "avg_ft_cp": 4.45,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.28
    },
    "split_ctx": 0.04
  },
  "ALE::Macarthur FC": {
    "time": "Macarthur FC",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 5.57,
        "cc": 4.21,
        "saldo_cantos": 1.36,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.57,
        "cc": 3.71,
        "saldo_cantos": 2.86,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.57,
        "cc": 4.71,
        "saldo_cantos": -0.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.143,
        "D": 0.357,
        "tv": 0.5
      },
      "casa": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "fora": {
        "V": 0.286,
        "E": 0.286,
        "D": 0.429,
        "tv": 0.286
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 78,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.33,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.27,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.09,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.57,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.67,
        "cc_avg": 4.67,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 5.71,
        "cc_avg": 3.86,
        "saldo": 1.85
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 2.71,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.93,
      "avg_ft_cp": 5.57,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 2.0
  },
  "ALE::Newcastle Jets": {
    "time": "Newcastle Jets",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 4.79,
        "cc": 5.93,
        "saldo_cantos": -1.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.83,
        "cc": 4.67,
        "saldo_cantos": 0.16,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.75,
        "cc": 6.88,
        "saldo_cantos": -2.13,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.071,
        "D": 0.5,
        "tv": 0.429
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.25,
        "E": 0.125,
        "D": 0.625,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 67,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.11,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.22,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.94,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.79,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 5.0,
        "cc_avg": 6.8,
        "saldo": -1.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.75,
        "cc_avg": 3.0,
        "saldo": 1.75
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 1.76,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 2.79,
      "avg_ft_cp": 4.79,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.64,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 0.08
  },
  "ALE::Adelaide United": {
    "time": "Adelaide United",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 5.64,
        "cc": 3.93,
        "saldo_cantos": 1.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.43,
        "cc": 3.14,
        "saldo_cantos": 3.29,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.86,
        "cc": 4.71,
        "saldo_cantos": 0.15,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.643,
        "E": 0.071,
        "D": 0.286,
        "tv": 0.643
      },
      "casa": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "fora": {
        "V": 0.429,
        "E": 0.143,
        "D": 0.429,
        "tv": 0.429
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 79,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.67,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.33,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.64,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 3.0,
        "saldo": 1.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 6.0,
        "cc_avg": 4.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.84,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 5.64,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 1.57
  },
  "ALE::Sydney FC": {
    "time": "Sydney FC",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 15,
      "casa": 8,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.93,
        "cc": 5.6,
        "saldo_cantos": -0.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.62,
        "cc": 5.5,
        "saldo_cantos": 0.12,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.14,
        "cc": 5.71,
        "saldo_cantos": -1.57,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.133,
        "D": 0.533,
        "tv": 0.333
      },
      "casa": {
        "V": 0.375,
        "E": 0.125,
        "D": 0.5,
        "tv": 0.375
      },
      "fora": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 74,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.65,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.13,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.96,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.93,
        "delta_cp": 0.0,
        "n": 15
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.67,
        "cc_avg": 7.67,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 4.67,
        "saldo": -1.34
      }
    },
    "consistencia": {
      "indice": 0.43,
      "cp_std": 2.79,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.4,
      "avg_ft_cp": 4.93,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.53,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 1.48
  },
  "ALE::Auckland FC": {
    "time": "Auckland FC",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 15,
      "casa": 7,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 5.27,
        "cc": 4.73,
        "saldo_cantos": 0.54,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.29,
        "cc": 4.43,
        "saldo_cantos": 2.86,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.0,
        "saldo_cantos": -1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.533,
        "E": 0.067,
        "D": 0.4,
        "tv": 0.533
      },
      "casa": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "fora": {
        "V": 0.25,
        "E": 0.125,
        "D": 0.625,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 79,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.53,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.03,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.27,
        "delta_cp": 0.0,
        "n": 15
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 6.0,
        "cc_avg": 5.33,
        "saldo": 0.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 8,
        "cp_avg": 5.25,
        "cc_avg": 4.12,
        "saldo": 1.13
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 2.76,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 2.87,
      "avg_ft_cp": 5.27,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.53,
      "taxa_ht_4": 0.53
    },
    "split_ctx": 3.79
  },
  "ALE::Melbourne City": {
    "time": "Melbourne City",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.57,
        "cc": 4.43,
        "saldo_cantos": 1.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.5,
        "cc": 4.75,
        "saldo_cantos": 0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.67,
        "cc": 4.0,
        "saldo_cantos": 1.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.643,
        "E": 0.143,
        "D": 0.214,
        "tv": 0.643
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "label_geral": "DOMINANTE",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 78,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.11,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.22,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.09,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.57,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 5.0,
        "cc_avg": 4.5,
        "saldo": 0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.33,
        "cc_avg": 3.17,
        "saldo": 3.16
      }
    },
    "consistencia": {
      "indice": 0.66,
      "cp_std": 1.91,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 5.57,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.64
    },
    "split_ctx": -0.17
  },
  "ALE::Wellington Phoenix": {
    "time": "Wellington Phoenix",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 13,
      "casa": 6,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 5.69,
        "cc": 5.15,
        "saldo_cantos": 0.54,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.33,
        "cc": 4.17,
        "saldo_cantos": 1.16,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 6.0,
        "cc": 6.0,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.462,
        "E": 0.077,
        "D": 0.462,
        "tv": 0.462
      },
      "casa": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "fora": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 74,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.53,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.11,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.69,
        "delta_cp": 0.0,
        "n": 13
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 6.0,
        "cc_avg": 5.83,
        "saldo": 0.17
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 6.0,
        "cc_avg": 5.6,
        "saldo": 0.4
      }
    },
    "consistencia": {
      "indice": 0.59,
      "cp_std": 2.32,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.69,
      "avg_ft_cp": 5.69,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.69,
      "taxa_ht_4": 0.54
    },
    "split_ctx": -0.67
  },
  "ALE::WS Wanderers": {
    "time": "WS Wanderers",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 5.36,
        "cc": 4.93,
        "saldo_cantos": 0.43,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.14,
        "cc": 5.29,
        "saldo_cantos": 0.85,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.57,
        "cc": 4.57,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.071,
        "D": 0.5,
        "tv": 0.429
      },
      "casa": {
        "V": 0.429,
        "E": 0.143,
        "D": 0.429,
        "tv": 0.429
      },
      "fora": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 75,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.08,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.05,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.36,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 6.83,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 7.0,
        "cc_avg": 3.71,
        "saldo": 3.29
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 3.37,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.36,
      "avg_ft_cp": 5.36,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.71,
      "taxa_ht_4": 0.64
    },
    "split_ctx": 1.57
  },
  "ALE::Central Coast Mariners": {
    "time": "Central Coast Mariners",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 7,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.43,
        "cc": 6.71,
        "saldo_cantos": -3.28,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.0,
        "cc": 7.0,
        "saldo_cantos": -4.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.86,
        "cc": 6.43,
        "saldo_cantos": -2.57,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "fora": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -3.2,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.64,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.67,
      "perfil": "BAIXO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.43,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 7,
        "cp_avg": 3.43,
        "cc_avg": 8.0,
        "saldo": -4.57
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 3.8,
        "cc_avg": 5.6,
        "saldo": -1.8
      }
    },
    "consistencia": {
      "indice": 0.47,
      "cp_std": 1.83,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.21,
      "avg_ft_cp": 3.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.43
    },
    "split_ctx": -0.86
  },
  "ALE::Perth Glory": {
    "time": "Perth Glory",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 6,
      "fora": 8
    },
    "base": {
      "geral": {
        "cp": 3.79,
        "cc": 5.93,
        "saldo_cantos": -2.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.67,
        "cc": 4.67,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.12,
        "cc": 6.88,
        "saldo_cantos": -3.76,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.214,
        "E": 0.071,
        "D": 0.714,
        "tv": 0.214
      },
      "casa": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.09,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.42,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.74,
      "perfil": "BAIXO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.79,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.2,
        "cc_avg": 5.4,
        "saldo": -3.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.8,
        "cc_avg": 6.2,
        "saldo": -0.4
      }
    },
    "consistencia": {
      "indice": 0.47,
      "cp_std": 2.01,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.4,
      "avg_ht_cp": 1.5,
      "avg_ft_cp": 3.79,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 1.55
  },
  "ALE::Brisbane Roar": {
    "time": "Brisbane Roar",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 13,
      "casa": 7,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.46,
        "cc": 5.08,
        "saldo_cantos": -0.62,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.0,
        "cc": 5.29,
        "saldo_cantos": -1.29,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 4.83,
        "saldo_cantos": 0.17,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.385,
        "E": 0.154,
        "D": 0.462,
        "tv": 0.385
      },
      "casa": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "fora": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 58,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.61,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.12,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.87,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.46,
        "delta_cp": 0.0,
        "n": 13
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 4.67,
        "saldo": -0.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 5.0,
        "cc_avg": 3.86,
        "saldo": 1.14
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 3.15,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.62,
      "avg_ft_cp": 4.46,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.54,
      "taxa_ht_4": 0.38
    },
    "split_ctx": -1.0
  },
  "ALE::Melbourne Victory": {
    "time": "Melbourne Victory",
    "liga": "ALE",
    "liga_nome": "A-League 2026",
    "n": {
      "geral": 14,
      "casa": 8,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 6.93,
        "cc": 4.79,
        "saldo_cantos": 2.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.0,
        "cc": 3.38,
        "saldo_cantos": 3.62,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 6.83,
        "cc": 6.67,
        "saldo_cantos": 0.16,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "casa": {
        "V": 0.75,
        "E": 0.125,
        "D": 0.125,
        "tv": 0.75
      },
      "fora": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 97,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 2.09,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.42,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.35,
      "perfil": "ALTO",
      "media_liga_ft": 5.12
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.93,
        "delta_cp": 0.0,
        "n": 14
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 3.75,
        "saldo": -0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 9.5,
        "cc_avg": 4.5,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 3.38,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 2.93,
      "avg_ft_cp": 6.93,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.71,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 0.17
  },
  "CHI::Colo Colo": {
    "time": "Colo Colo",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 9,
      "casa": 5,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.56,
        "cc": 3.56,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.2,
        "cc": 2.6,
        "saldo_cantos": 3.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.75,
        "cc": 4.75,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.556,
        "E": 0.222,
        "D": 0.222,
        "tv": 0.556
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.25,
        "E": 0.5,
        "D": 0.25,
        "tv": 0.25
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 50,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 2.17,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.43,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.21,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.56,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 2.67,
        "saldo": 0.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 6.0,
        "cc_avg": 4.2,
        "saldo": 1.8
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 2.7,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.6,
      "avg_ht_cp": 3.33,
      "avg_ft_cp": 5.56,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.56,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 1.45
  },
  "CHI::Huachipato": {
    "time": "Huachipato",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.27,
        "cc": 4.64,
        "saldo_cantos": -1.37,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.17,
        "cc": 3.5,
        "saldo_cantos": -0.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.4,
        "cc": 6.0,
        "saldo_cantos": -2.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.273,
        "E": 0.0,
        "D": 0.727,
        "tv": 0.273
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.49,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.3,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.71,
      "perfil": "BAIXO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.27,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 4.83,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 5.33,
        "saldo": -2.0
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.1,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.27,
      "avg_ft_cp": 3.27,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.36
    },
    "split_ctx": -0.23
  },
  "CHI::D. Concepcion": {
    "time": "D. Concepcion",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 9,
      "casa": 3,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 3.67,
        "saldo_cantos": 1.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.67,
        "cc": 4.0,
        "saldo_cantos": 3.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.67,
        "cc": 3.5,
        "saldo_cantos": 0.17,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.444,
        "E": 0.333,
        "D": 0.222,
        "tv": 0.444
      },
      "casa": {
        "V": 0.667,
        "E": 0.333,
        "D": 0.0,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 45,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.44,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.29,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.09,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.0,
        "n": 9
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 5.33,
        "cc_avg": 4.67,
        "saldo": 0.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 2.75,
        "saldo": 1.75
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 2.92,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 2.89,
      "avg_ft_cp": 5.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.44,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 4.0
  },
  "CHI::Coquimbo": {
    "time": "Coquimbo",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.8,
        "cc": 4.0,
        "saldo_cantos": 0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.0,
        "cc": 3.8,
        "saldo_cantos": 3.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.6,
        "cc": 4.2,
        "saldo_cantos": -1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.1,
        "D": 0.3,
        "tv": 0.6
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.87,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.17,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.04,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.8,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 6.6,
        "cc_avg": 3.2,
        "saldo": 3.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.0,
        "cc_avg": 4.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 3.01,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 2.3,
      "avg_ft_cp": 4.8,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 4.4
  },
  "CHI::U. De Chile": {
    "time": "U. De Chile",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 5.64,
        "cc": 4.73,
        "saldo_cantos": 0.91,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 8.0,
        "cc": 4.2,
        "saldo_cantos": 3.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.67,
        "cc": 5.17,
        "saldo_cantos": -1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.455,
        "E": 0.0,
        "D": 0.545,
        "tv": 0.455
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.167,
        "E": 0.0,
        "D": 0.833,
        "tv": 0.167
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 62,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.99,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.2,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.64,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 1.67,
        "cc_avg": 5.67,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.67,
        "cc_avg": 4.83,
        "saldo": 0.84
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 4.01,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.56,
      "avg_ht_cp": 3.18,
      "avg_ft_cp": 5.64,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.55
    },
    "split_ctx": 4.33
  },
  "CHI::A. Italiano": {
    "time": "A. Italiano",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 7,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.91,
        "cc": 4.27,
        "saldo_cantos": -0.36,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.71,
        "cc": 4.14,
        "saldo_cantos": -0.43,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.25,
        "cc": 4.5,
        "saldo_cantos": -0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.364,
        "E": 0.182,
        "D": 0.455,
        "tv": 0.364
      },
      "casa": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "fora": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.39,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.08,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.85,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.91,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 3.5,
        "saldo": 0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.75,
        "cc_avg": 3.75,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.57,
      "cp_std": 1.7,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.36,
      "avg_ft_cp": 3.91,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.18
    },
    "split_ctx": -0.54
  },
  "CHI::O'Higgins": {
    "time": "O'Higgins",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 7,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.55,
        "cc": 4.91,
        "saldo_cantos": -0.36,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.29,
        "cc": 4.43,
        "saldo_cantos": 0.86,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.25,
        "cc": 5.75,
        "saldo_cantos": -2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.364,
        "E": 0.273,
        "D": 0.364,
        "tv": 0.364
      },
      "casa": {
        "V": 0.429,
        "E": 0.429,
        "D": 0.143,
        "tv": 0.429
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 50,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.39,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.08,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.55,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.67,
        "cc_avg": 5.0,
        "saldo": -1.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 5.17,
        "cc_avg": 4.67,
        "saldo": 0.5
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.25,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 2.09,
      "avg_ft_cp": 4.55,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.55
    },
    "split_ctx": 2.04
  },
  "CHI::Union La Calera": {
    "time": "Union La Calera",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.5,
        "cc": 5.2,
        "saldo_cantos": 0.3,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.4,
        "cc": 4.2,
        "saldo_cantos": 1.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.6,
        "cc": 6.2,
        "saldo_cantos": -0.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.1,
        "D": 0.4,
        "tv": 0.5
      },
      "casa": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 55,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.33,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.07,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.19,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.5,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 9.33,
        "saldo": -7.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 7,
        "cp_avg": 6.86,
        "cc_avg": 3.43,
        "saldo": 3.43
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 3.5,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.6,
      "avg_ft_cp": 5.5,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.6,
      "taxa_ht_4": 0.7
    },
    "split_ctx": -0.2
  },
  "CHI::Everton": {
    "time": "Everton",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.82,
        "cc": 5.73,
        "saldo_cantos": -1.91,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.8,
        "cc": 3.6,
        "saldo_cantos": 1.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 7.5,
        "saldo_cantos": -4.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.273,
        "E": 0.0,
        "D": 0.727,
        "tv": 0.273
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 42,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.07,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.41,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.82,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 3.0,
        "cc_avg": 9.5,
        "saldo": -6.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 4.17,
        "cc_avg": 5.0,
        "saldo": -0.83
      }
    },
    "consistencia": {
      "indice": 0.39,
      "cp_std": 2.32,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 1.55,
      "avg_ft_cp": 3.82,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 1.8
  },
  "CHI::Limache": {
    "time": "Limache",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 12,
      "casa": 5,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 3.83,
        "cc": 5.33,
        "saldo_cantos": -1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.0,
        "cc": 5.2,
        "saldo_cantos": -2.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.43,
        "cc": 5.43,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "casa": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "fora": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 46,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.63,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.33,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.83,
        "delta_cp": 0.0,
        "n": 12
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.0,
        "cc_avg": 4.83,
        "saldo": -0.83
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.2,
        "cc_avg": 4.6,
        "saldo": -0.4
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 1.9,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.33,
      "avg_ft_cp": 3.83,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.42
    },
    "split_ctx": -1.43
  },
  "CHI::U. Catolica": {
    "time": "U. Catolica",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.73,
        "cc": 3.73,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.0,
        "cc": 5.0,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 2.67,
        "saldo_cantos": 0.83,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.455,
        "E": 0.091,
        "D": 0.455,
        "tv": 0.455
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 41,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.81,
      "perfil": "BAIXO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.73,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.5,
        "cc_avg": 5.25,
        "saldo": -2.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 3.83,
        "cc_avg": 2.83,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 1.79,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.56,
      "avg_ht_cp": 2.09,
      "avg_ft_cp": 3.73,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.27,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 0.5
  },
  "CHI::Palestino": {
    "time": "Palestino",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.45,
        "cc": 3.73,
        "saldo_cantos": 1.72,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.0,
        "cc": 3.5,
        "saldo_cantos": 2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.8,
        "cc": 4.0,
        "saldo_cantos": 0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.636,
        "E": 0.0,
        "D": 0.364,
        "tv": 0.636
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 60,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.87,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.37,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.18,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.45,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 4.0,
        "saldo": -0.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 6,
        "cp_avg": 6.5,
        "cc_avg": 3.83,
        "saldo": 2.67
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 2.42,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.55,
      "avg_ht_cp": 3.0,
      "avg_ft_cp": 5.45,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.36,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 1.2
  },
  "CHI::Cobresal": {
    "time": "Cobresal",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 4.2,
        "saldo_cantos": 0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.0,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 5.4,
        "saldo_cantos": -0.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.7,
        "E": 0.1,
        "D": 0.2,
        "tv": 0.7
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 50,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.87,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.17,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.09,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 6.67,
        "saldo": -2.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.75,
        "cc_avg": 3.25,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.69,
      "cp_std": 1.56,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 2.7,
      "avg_ft_cp": 5.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.7
    },
    "split_ctx": 0.0
  },
  "CHI::U. De Concepcion": {
    "time": "U. De Concepcion",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.09,
        "cc": 4.45,
        "saldo_cantos": 0.64,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.67,
        "cc": 3.33,
        "saldo_cantos": 2.34,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.4,
        "cc": 5.8,
        "saldo_cantos": -1.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.0,
        "D": 0.455,
        "tv": 0.545
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 56,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.69,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.14,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.11,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.09,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 5.4,
        "cc_avg": 5.2,
        "saldo": 0.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.2,
        "cc_avg": 3.0,
        "saldo": 2.2
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 2.63,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.57,
      "avg_ht_cp": 2.91,
      "avg_ft_cp": 5.09,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.64
    },
    "split_ctx": 1.27
  },
  "CHI::Nublense": {
    "time": "Nublense",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.73,
        "cc": 5.36,
        "saldo_cantos": -0.63,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.8,
        "cc": 4.8,
        "saldo_cantos": 1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.83,
        "cc": 5.83,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.364,
        "E": 0.0,
        "D": 0.636,
        "tv": 0.364
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.167,
        "E": 0.0,
        "D": 0.833,
        "tv": 0.167
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 52,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.68,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.14,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.03,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.73,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 7.0,
        "saldo": -3.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.25,
        "cc_avg": 4.5,
        "saldo": 1.75
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 3.35,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.65,
      "avg_ht_cp": 3.09,
      "avg_ft_cp": 4.73,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.55
    },
    "split_ctx": 1.97
  },
  "CHI::La Serena": {
    "time": "La Serena",
    "liga": "CHI",
    "liga_nome": "Primera División Chile 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.27,
        "cc": 5.73,
        "saldo_cantos": -1.46,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.2,
        "cc": 5.0,
        "saldo_cantos": -0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 6.33,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.364,
        "E": 0.182,
        "D": 0.455,
        "tv": 0.364
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.167,
        "E": 0.333,
        "D": 0.5,
        "tv": 0.167
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.58,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.32,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.93,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.61
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.27,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 6.33,
        "saldo": -1.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 5.25,
        "saldo": -0.25
      }
    },
    "consistencia": {
      "indice": 0.27,
      "cp_std": 3.1,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.27,
      "avg_ft_cp": 4.27,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.55
    },
    "split_ctx": -0.13
  },
  "ECU::Ind. del Valle": {
    "time": "Ind. del Valle",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.88,
        "cc": 2.75,
        "saldo_cantos": 3.13,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.75,
        "cc": 3.0,
        "saldo_cantos": 3.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 2.5,
        "saldo_cantos": 2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.75,
        "E": 0.125,
        "D": 0.125,
        "tv": 0.75
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.75,
        "E": 0.25,
        "D": 0.0,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 3.43,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.69,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.29,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.88,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 5.33,
        "cc_avg": 4.67,
        "saldo": 0.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 7.0,
        "cc_avg": 2.0,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 2.17,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.75,
      "avg_ft_cp": 5.88,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 1.75
  },
  "ECU::Orense": {
    "time": "Orense",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.43,
        "cc": 6.14,
        "saldo_cantos": -2.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.67,
        "cc": 5.0,
        "saldo_cantos": -1.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.25,
        "cc": 7.0,
        "saldo_cantos": -3.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 24,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.97,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.59,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.75,
      "perfil": "BAIXO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.43,
        "delta_cp": 0.0,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 2.8,
        "cc_avg": 5.4,
        "saldo": -2.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 10.0,
        "saldo": -4.0
      }
    },
    "consistencia": {
      "indice": 0.53,
      "cp_std": 1.62,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.54,
      "avg_ht_cp": 1.86,
      "avg_ft_cp": 3.43,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 0.42
  },
  "ECU::Dep. Cuenca": {
    "time": "Dep. Cuenca",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.12,
        "cc": 5.38,
        "saldo_cantos": -1.26,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.25,
        "cc": 5.25,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 5.5,
        "saldo_cantos": -2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.125,
        "D": 0.5,
        "tv": 0.375
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 33,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.38,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.28,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.9,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.12,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 6.75,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 4.5,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 1.81,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 2.12,
      "avg_ft_cp": 4.12,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 2.25
  },
  "ECU::Tecnico U.": {
    "time": "Tecnico U.",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 5.38,
        "saldo_cantos": -0.88,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 5.5,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 5.25,
        "saldo_cantos": -1.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.125,
        "D": 0.5,
        "tv": 0.375
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.97,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.19,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 4.75,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.5,
        "cc_avg": 6.0,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.35,
      "cp_std": 2.93,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.61,
      "avg_ht_cp": 2.75,
      "avg_ft_cp": 4.5,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.38
    },
    "split_ctx": 1.0
  },
  "ECU::Emelec": {
    "time": "Emelec",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 4.25,
        "saldo_cantos": 0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.5,
        "cc": 2.75,
        "saldo_cantos": 2.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.75,
        "saldo_cantos": -2.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.25,
        "D": 0.375,
        "tv": 0.375
      },
      "casa": {
        "V": 0.5,
        "E": 0.5,
        "D": 0.0,
        "tv": 0.5
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.27,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.05,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.5,
        "cc_avg": 6.5,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.33,
        "cc_avg": 2.33,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.62,
      "cp_std": 1.69,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 1.88,
      "avg_ft_cp": 4.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.25,
      "taxa_ht_4": 0.12
    },
    "split_ctx": 2.0
  },
  "ECU::Aucas": {
    "time": "Aucas",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 5,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.62,
        "cc": 4.0,
        "saldo_cantos": 2.62,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.6,
        "cc": 3.4,
        "saldo_cantos": 3.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 6.67,
        "cc": 5.0,
        "saldo_cantos": 1.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.625,
        "E": 0.25,
        "D": 0.125,
        "tv": 0.625
      },
      "casa": {
        "V": 0.6,
        "E": 0.4,
        "D": 0.0,
        "tv": 0.6
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 2.87,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.57,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.45,
      "perfil": "ALTO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.62,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 8.33,
        "cc_avg": 4.67,
        "saldo": 3.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.0,
        "cc_avg": 2.75,
        "saldo": 3.25
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 3.02,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 3.12,
      "avg_ft_cp": 6.62,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.75,
      "taxa_ht_4": 0.5
    },
    "split_ctx": -0.07
  },
  "ECU::Manta": {
    "time": "Manta",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 3,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.62,
        "cc": 4.62,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.33,
        "cc": 2.67,
        "saldo_cantos": 1.66,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.8,
        "cc": 5.8,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.0,
        "D": 0.625,
        "tv": 0.375
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 37,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.0,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.01,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.62,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 5.5,
        "saldo": -1.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 3.0,
        "saldo": 3.33
      }
    },
    "consistencia": {
      "indice": 0.34,
      "cp_std": 3.07,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.32,
      "avg_ht_cp": 1.5,
      "avg_ft_cp": 4.62,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.62,
      "taxa_ht_4": 0.5
    },
    "split_ctx": -0.47
  },
  "ECU::Mushuc Runa": {
    "time": "Mushuc Runa",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.12,
        "cc": 4.5,
        "saldo_cantos": 0.62,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.75,
        "cc": 4.25,
        "saldo_cantos": 1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.5,
        "cc": 4.75,
        "saldo_cantos": -0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.625,
        "E": 0.0,
        "D": 0.375,
        "tv": 0.625
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 41,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.68,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.14,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.12,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.12,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 5.2,
        "cc_avg": 5.0,
        "saldo": 0.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 2.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.66,
      "cp_std": 1.73,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.88,
      "avg_ft_cp": 5.12,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 1.25
  },
  "ECU::Guayaquil City": {
    "time": "Guayaquil City",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.38,
        "cc": 4.75,
        "saldo_cantos": -1.37,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.75,
        "cc": 5.0,
        "saldo_cantos": -1.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 4.5,
        "saldo_cantos": -1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.0,
        "D": 0.625,
        "tv": 0.375
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 27,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.5,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.3,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.74,
      "perfil": "BAIXO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.38,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.0,
        "cc_avg": 7.33,
        "saldo": -5.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.0,
        "cc_avg": 2.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.45,
      "cp_std": 1.85,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.62,
      "avg_ft_cp": 3.38,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.25,
      "taxa_ht_4": 0.12
    },
    "split_ctx": 0.75
  },
  "ECU::U. Catolica": {
    "time": "U. Catolica",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.0,
        "cc": 4.29,
        "saldo_cantos": 0.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.0,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 6.0,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 35,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.78,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.16,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": 0.0,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 5.0,
        "cc_avg": 5.5,
        "saldo": -0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 5.0,
        "cc_avg": 3.8,
        "saldo": 1.2
      }
    },
    "consistencia": {
      "indice": 0.88,
      "cp_std": 0.58,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 5.0,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 0.0
  },
  "ECU::Barcelona SC": {
    "time": "Barcelona SC",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.29,
        "cc": 5.0,
        "saldo_cantos": -1.71,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.0,
        "cc": 5.0,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.75,
        "cc": 5.0,
        "saldo_cantos": -2.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 23,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.88,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.38,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.29,
        "delta_cp": 0.0,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.5,
        "cc_avg": 5.75,
        "saldo": -3.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 4.0,
        "saldo": 0.33
      }
    },
    "consistencia": {
      "indice": 0.45,
      "cp_std": 1.8,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 1.57,
      "avg_ft_cp": 3.29,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 1.25
  },
  "ECU::LDU Quito": {
    "time": "LDU Quito",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.67,
        "cc": 2.67,
        "saldo_cantos": 4.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.0,
        "cc": 3.33,
        "saldo_cantos": 2.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 7.33,
        "cc": 2.0,
        "saldo_cantos": 5.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 40,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 4.39,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.88,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.46,
      "perfil": "ALTO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.67,
        "delta_cp": 0.0,
        "n": 6
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 2.0,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.0,
        "cc_avg": 2.0,
        "saldo": 6.0
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 3.27,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 3.17,
      "avg_ft_cp": 6.67,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.67
    },
    "split_ctx": -1.33
  },
  "ECU::Leones del Norte": {
    "time": "Leones del Norte",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.14,
        "cc": 5.57,
        "saldo_cantos": -2.43,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 2.33,
        "cc": 5.0,
        "saldo_cantos": -2.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.75,
        "cc": 6.0,
        "saldo_cantos": -2.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "casa": {
        "V": 0.0,
        "E": 0.333,
        "D": 0.667,
        "tv": 0.0
      },
      "fora": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 22,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.67,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.53,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.69,
      "perfil": "BAIXO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.14,
        "delta_cp": 0.0,
        "n": 7
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 6.0,
        "saldo": -3.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 3.0,
        "cc_avg": 6.5,
        "saldo": -3.5
      }
    },
    "consistencia": {
      "indice": 0.33,
      "cp_std": 2.12,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.57,
      "avg_ft_cp": 3.14,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -1.42
  },
  "ECU::Delfin": {
    "time": "Delfin",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 5,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.75,
        "cc": 4.25,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.6,
        "cc": 4.4,
        "saldo_cantos": 0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.33,
        "cc": 4.0,
        "saldo_cantos": -1.67,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.25,
        "D": 0.375,
        "tv": 0.375
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.0,
        "E": 0.667,
        "D": 0.333,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.55,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.82,
      "perfil": "BAIXO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.75,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.0,
        "cc_avg": 6.0,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 3.0,
        "saldo": -0.33
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 2.66,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.88,
      "avg_ft_cp": 3.75,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.25,
      "taxa_ht_4": 0.25
    },
    "split_ctx": 2.27
  },
  "ECU::Macara": {
    "time": "Macara",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 5.0,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.75,
        "cc": 5.5,
        "saldo_cantos": -0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.25,
        "cc": 4.5,
        "saldo_cantos": -0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.375,
        "E": 0.125,
        "D": 0.5,
        "tv": 0.375
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.55,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 4.0,
        "saldo": 0.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 6.0,
        "saldo": -1.5
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.07,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.28,
      "avg_ht_cp": 1.25,
      "avg_ft_cp": 4.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 0.5
  },
  "ECU::Libertad": {
    "time": "Libertad",
    "liga": "ECU",
    "liga_nome": "Liga Pro Ecuador 2026",
    "n": {
      "geral": 8,
      "casa": 4,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 4.25,
        "saldo_cantos": 0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.5,
        "cc": 3.75,
        "saldo_cantos": 0.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.5,
        "cc": 4.75,
        "saldo_cantos": -0.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 36,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.27,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.05,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.56
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": 0.0,
        "n": 8
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 4.0,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.25,
        "cc_avg": 3.0,
        "saldo": 2.25
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.88,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.25,
      "avg_ft_cp": 4.5,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.38,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 0.0
  },
  "J1::Mito": {
    "time": "Mito",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 4,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 3.4,
        "cc": 3.9,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.25,
        "cc": 5.0,
        "saldo_cantos": -1.75,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 3.17,
        "saldo_cantos": 0.33,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "casa": {
        "V": 0.0,
        "E": 0.5,
        "D": 0.5,
        "tv": 0.0
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 34,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.53,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.4,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.2,
        "cc_avg": 4.6,
        "saldo": -1.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 2.5,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.72,
      "cp_std": 0.97,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.7,
      "avg_ft_cp": 3.4,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.1,
      "taxa_ht_4": 0.2
    },
    "split_ctx": -0.25
  },
  "J1::Kashima Antlers": {
    "time": "Kashima Antlers",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.9,
        "cc": 5.6,
        "saldo_cantos": 0.3,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.2,
        "cc": 4.0,
        "saldo_cantos": 2.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.6,
        "cc": 7.2,
        "saldo_cantos": -1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "casa": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 59,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.32,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.25,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.9,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 6.75,
        "saldo": -2.75
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 7.67,
        "cc_avg": 5.0,
        "saldo": 2.67
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 2.18,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.32,
      "avg_ht_cp": 1.9,
      "avg_ft_cp": 5.9,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.8,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 0.6
  },
  "J1::Kawasaki Frontale": {
    "time": "Kawasaki Frontale",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 6,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.1,
        "cc": 5.0,
        "saldo_cantos": 0.1,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.83,
        "cc": 4.67,
        "saldo_cantos": 1.16,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 5.5,
        "saldo_cantos": -1.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.1,
        "D": 0.5,
        "tv": 0.4
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 51,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.11,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.02,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.08,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.1,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.5,
        "cc_avg": 5.33,
        "saldo": -0.83
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 5.33,
        "saldo": 0.67
      }
    },
    "consistencia": {
      "indice": 0.49,
      "cp_std": 2.6,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 2.6,
      "avg_ft_cp": 5.1,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.6,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 1.83
  },
  "J1::Chiba": {
    "time": "Chiba",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 6,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.6,
        "cc": 6.2,
        "saldo_cantos": -1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.67,
        "cc": 6.17,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.0,
        "cc": 6.25,
        "saldo_cantos": -3.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.2,
        "E": 0.1,
        "D": 0.7,
        "tv": 0.2
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 46,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.69,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.34,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.97,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.6,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.2,
        "cc_avg": 6.8,
        "saldo": -3.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 9.0,
        "cc_avg": 8.0,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 3.27,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 2.1,
      "avg_ft_cp": 4.6,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 2.67
  },
  "J1::Machida": {
    "time": "Machida",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.73,
        "cc": 2.82,
        "saldo_cantos": 0.91,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.17,
        "cc": 2.83,
        "saldo_cantos": 1.34,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.2,
        "cc": 2.8,
        "saldo_cantos": 0.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.545,
        "E": 0.182,
        "D": 0.273,
        "tv": 0.545
      },
      "casa": {
        "V": 0.5,
        "E": 0.333,
        "D": 0.167,
        "tv": 0.5
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 41,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.96,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.19,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.79,
      "perfil": "BAIXO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.73,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.17,
        "cc_avg": 2.33,
        "saldo": 1.84
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 3.33,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 1.95,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.34,
      "avg_ht_cp": 1.27,
      "avg_ft_cp": 3.73,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.09,
      "taxa_ht_4": 0.09
    },
    "split_ctx": 0.97
  },
  "J1::FC Tokyo": {
    "time": "FC Tokyo",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 11,
      "casa": 5,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.73,
        "cc": 4.45,
        "saldo_cantos": 0.28,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.4,
        "cc": 4.8,
        "saldo_cantos": 0.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.17,
        "cc": 4.17,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.455,
        "E": 0.273,
        "D": 0.273,
        "tv": 0.455
      },
      "casa": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "fora": {
        "V": 0.333,
        "E": 0.5,
        "D": 0.167,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 52,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.3,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.0,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.73,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 6,
        "cp_avg": 4.33,
        "cc_avg": 4.33,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 5.33,
        "saldo": 0.67
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 3.0,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.36,
      "avg_ft_cp": 4.73,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.27,
      "taxa_ht_4": 0.36
    },
    "split_ctx": 1.23
  },
  "J1::Verdy": {
    "time": "Verdy",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.2,
        "cc": 5.2,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.8,
        "cc": 4.4,
        "saldo_cantos": -0.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.6,
        "cc": 6.0,
        "saldo_cantos": -1.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.3,
        "E": 0.0,
        "D": 0.7,
        "tv": 0.3
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 42,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.06,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.21,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.89,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.2,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.8,
        "cc_avg": 5.0,
        "saldo": -1.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 5.67,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.35,
      "cp_std": 2.74,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.4,
      "avg_ht_cp": 1.7,
      "avg_ft_cp": 4.2,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.2
    },
    "split_ctx": -0.8
  },
  "J1::Urawa Reds": {
    "time": "Urawa Reds",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.8,
        "cc": 5.8,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.8,
        "cc": 4.6,
        "saldo_cantos": 0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.8,
        "cc": 7.0,
        "saldo_cantos": -2.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.3,
        "E": 0.0,
        "D": 0.7,
        "tv": 0.3
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.06,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.21,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.01,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.8,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 5.0,
        "cc_avg": 5.8,
        "saldo": -0.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 5.67,
        "saldo": 0.33
      }
    },
    "consistencia": {
      "indice": 0.69,
      "cp_std": 1.48,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.1,
      "avg_ft_cp": 4.8,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.5
    },
    "split_ctx": 0.0
  },
  "J1::Kashiwa Reysol": {
    "time": "Kashiwa Reysol",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 4,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.7,
        "cc": 3.1,
        "saldo_cantos": 1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.0,
        "cc": 2.75,
        "saldo_cantos": 1.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.17,
        "cc": 3.33,
        "saldo_cantos": 1.84,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.833,
        "E": 0.0,
        "D": 0.167,
        "tv": 0.833
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.69,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.34,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.7,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.4,
        "cc_avg": 3.2,
        "saldo": 0.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 3.33,
        "saldo": 2.67
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.36,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.34,
      "avg_ht_cp": 1.6,
      "avg_ft_cp": 4.7,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.2,
      "taxa_ht_4": 0.1
    },
    "split_ctx": -1.17
  },
  "J1::Yokohama F. Marinos": {
    "time": "Yokohama F. Marinos",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.8,
        "cc": 4.0,
        "saldo_cantos": 0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.6,
        "cc": 2.8,
        "saldo_cantos": 2.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 5.2,
        "saldo_cantos": -1.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.1,
        "D": 0.4,
        "tv": 0.5
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.85,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.17,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.01,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.8,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 4.2,
        "saldo": -0.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 3.0,
        "saldo": 3.33
      }
    },
    "consistencia": {
      "indice": 0.71,
      "cp_std": 1.4,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.4,
      "avg_ht_cp": 1.9,
      "avg_ft_cp": 4.8,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.3,
      "taxa_ht_4": 0.3
    },
    "split_ctx": 1.6
  },
  "J1::Vissel Kobe": {
    "time": "Vissel Kobe",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 11,
      "casa": 6,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.18,
        "cc": 4.91,
        "saldo_cantos": 0.27,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.17,
        "cc": 3.17,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.2,
        "cc": 7.0,
        "saldo_cantos": -1.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.364,
        "E": 0.182,
        "D": 0.455,
        "tv": 0.364
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.0,
        "E": 0.4,
        "D": 0.6,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 57,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.29,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.18,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.25,
        "cc_avg": 6.5,
        "saldo": -3.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.75,
        "cc_avg": 4.25,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.6,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 2.55,
      "avg_ft_cp": 5.18,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.55,
      "taxa_ht_4": 0.64
    },
    "split_ctx": -0.03
  },
  "J1::Shimizu S-Pulse": {
    "time": "Shimizu S-Pulse",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 11,
      "casa": 4,
      "fora": 7
    },
    "base": {
      "geral": {
        "cp": 4.82,
        "cc": 4.55,
        "saldo_cantos": 0.27,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.5,
        "cc": 5.5,
        "saldo_cantos": 1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.86,
        "cc": 4.0,
        "saldo_cantos": -0.14,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.273,
        "E": 0.364,
        "D": 0.364,
        "tv": 0.273
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.143,
        "E": 0.429,
        "D": 0.429,
        "tv": 0.143
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 53,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.29,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.02,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.82,
        "delta_cp": 0.0,
        "n": 11
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 5.4,
        "cc_avg": 4.2,
        "saldo": 1.2
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.75,
        "cc_avg": 4.75,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.23,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.27,
      "avg_ft_cp": 4.82,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.45,
      "taxa_ht_4": 0.45
    },
    "split_ctx": 2.64
  },
  "J1::Okayama": {
    "time": "Okayama",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 6.2,
        "cc": 4.4,
        "saldo_cantos": 1.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.0,
        "cc": 3.4,
        "saldo_cantos": 3.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.4,
        "cc": 5.4,
        "saldo_cantos": 0.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.3,
        "D": 0.2,
        "tv": 0.5
      },
      "casa": {
        "V": 0.6,
        "E": 0.4,
        "D": 0.0,
        "tv": 0.6
      },
      "fora": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 62,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 1.9,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.38,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.31,
      "perfil": "ALTO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.2,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 6.33,
        "saldo": -1.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 7.0,
        "cc_avg": 3.2,
        "saldo": 3.8
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 3.08,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.7,
      "avg_ft_cp": 6.2,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.7,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 1.6
  },
  "J1::Nagoya Grampus": {
    "time": "Nagoya Grampus",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 5.1,
        "cc": 5.6,
        "saldo_cantos": -0.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.8,
        "cc": 4.4,
        "saldo_cantos": 2.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.4,
        "cc": 6.8,
        "saldo_cantos": -3.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.1,
        "D": 0.5,
        "tv": 0.4
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 51,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.53,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.11,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.08,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 5.1,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.8,
        "cc_avg": 5.8,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.25,
        "cc_avg": 6.0,
        "saldo": 0.25
      }
    },
    "consistencia": {
      "indice": 0.53,
      "cp_std": 2.38,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.7,
      "avg_ft_cp": 5.1,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.7,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 3.4
  },
  "J1::Sanfrecce Hiroshima": {
    "time": "Sanfrecce Hiroshima",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 6.1,
        "cc": 2.9,
        "saldo_cantos": 3.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 7.0,
        "cc": 2.6,
        "saldo_cantos": 4.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.2,
        "cc": 3.2,
        "saldo_cantos": 2.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.9,
        "E": 0.0,
        "D": 0.1,
        "tv": 0.9
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 61,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 3.38,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.68,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.29,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 6.1,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 2.0,
        "saldo": 3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 7.75,
        "cc_avg": 2.75,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.65,
      "cp_std": 2.13,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.44,
      "avg_ht_cp": 2.7,
      "avg_ft_cp": 6.1,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.3,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 1.8
  },
  "J1::Cerezo Osaka": {
    "time": "Cerezo Osaka",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.7,
        "cc": 5.6,
        "saldo_cantos": -0.9,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.4,
        "cc": 5.4,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 5.8,
        "saldo_cantos": -0.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.3,
        "E": 0.0,
        "D": 0.7,
        "tv": 0.3
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 47,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.95,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.19,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.7,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 5.5,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.75,
        "cc_avg": 5.5,
        "saldo": -0.75
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.83,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 1.7,
      "avg_ft_cp": 4.7,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.6
    },
    "split_ctx": -0.6
  },
  "J1::Gamba Osaka": {
    "time": "Gamba Osaka",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 4.6,
        "saldo_cantos": -0.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.2,
        "cc": 2.4,
        "saldo_cantos": 2.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.8,
        "cc": 6.8,
        "saldo_cantos": -4.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.1,
        "D": 0.4,
        "tv": 0.5
      },
      "casa": {
        "V": 0.8,
        "E": 0.2,
        "D": 0.0,
        "tv": 0.8
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 40,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -0.63,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.13,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.85,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.0,
        "cc_avg": 7.5,
        "saldo": -4.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.25,
        "cc_avg": 2.25,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.49,
      "cp_std": 2.05,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.33,
      "avg_ht_cp": 1.3,
      "avg_ft_cp": 4.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.3,
      "taxa_ht_4": 0.3
    },
    "split_ctx": 2.4
  },
  "J1::Avispa Fukuoka": {
    "time": "Avispa Fukuoka",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 6,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.3,
        "cc": 4.1,
        "saldo_cantos": 0.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 5.0,
        "cc": 2.5,
        "saldo_cantos": 2.5,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.25,
        "cc": 6.5,
        "saldo_cantos": -3.25,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": 0.21,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.04,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.91,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.3,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 4.0,
        "cc_avg": 4.5,
        "saldo": -0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 4.8,
        "cc_avg": 4.2,
        "saldo": 0.6
      }
    },
    "consistencia": {
      "indice": 0.64,
      "cp_std": 1.57,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 1.6,
      "avg_ft_cp": 4.3,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.3,
      "taxa_ht_4": 0.1
    },
    "split_ctx": 1.75
  },
  "J1::V-Varen Nagasaki": {
    "time": "V-Varen Nagasaki",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 3.4,
        "cc": 5.6,
        "saldo_cantos": -2.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 4.2,
        "cc": 3.8,
        "saldo_cantos": 0.4,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.6,
        "cc": 7.4,
        "saldo_cantos": -4.8,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.2,
        "E": 0.2,
        "D": 0.6,
        "tv": 0.2
      },
      "casa": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "fora": {
        "V": 0.0,
        "E": 0.2,
        "D": 0.8,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 34,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -2.33,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.47,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.4,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 2.75,
        "cc_avg": 5.75,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.67,
        "cc_avg": 5.0,
        "saldo": -1.33
      }
    },
    "consistencia": {
      "indice": 0.25,
      "cp_std": 2.55,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.7,
      "avg_ft_cp": 3.4,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.6,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 1.6
  },
  "J1::Kyoto": {
    "time": "Kyoto",
    "liga": "J1",
    "liga_nome": "J1 League 2026",
    "n": {
      "geral": 10,
      "casa": 5,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.9,
        "cc": 6.5,
        "saldo_cantos": -1.6,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 6.6,
        "cc": 7.6,
        "saldo_cantos": -1.0,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.2,
        "cc": 5.4,
        "saldo_cantos": -2.2,
        "gp": 0.0,
        "gc": 0.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.3,
        "E": 0.1,
        "D": 0.6,
        "tv": 0.3
      },
      "casa": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "fora": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.0,
      "perfil": "INEFICIENTE",
      "total_cantos_pro": 49,
      "total_gols": 0
    },
    "dissociacao": {
      "indice": -1.69,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.34,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.04,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.73
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 4.9,
        "delta_cp": 0.0,
        "n": 10
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": false
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.4,
        "cc_avg": 7.4,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 3.67,
        "cc_avg": 5.33,
        "saldo": -1.66
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 2.38,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.47,
      "avg_ht_cp": 2.3,
      "avg_ft_cp": 4.9,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.7,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 3.4
  },
  "MLS::San Diego FC": {
    "time": "San Diego FC",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.86,
        "cc": 4.14,
        "saldo_cantos": 0.72,
        "gp": 2.0,
        "gc": 1.43,
        "saldo_gols": 0.57
      },
      "casa": {
        "cp": 5.75,
        "cc": 4.25,
        "saldo_cantos": 1.5,
        "gp": 2.5,
        "gc": 1.0,
        "saldo_gols": 1.5
      },
      "fora": {
        "cp": 3.67,
        "cc": 4.0,
        "saldo_cantos": -0.33,
        "gp": 1.33,
        "gc": 2.0,
        "saldo_gols": -0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.412,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 34,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": 0.13,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.14,
      "saldo_gols_norm": 0.57
    },
    "pressao": {
      "ratio_liga": 0.95,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.0,
        "avg_cc": 2.0,
        "delta_cp": 1.14,
        "delta_cc": -2.14,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 6.0,
        "delta_cp": -0.36,
        "delta_cc": 1.86,
        "n": 2
      },
      "empatou": {
        "avg_cp": 3.5,
        "delta_cp": -1.36,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 4.5,
        "saldo": 1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 3.0,
        "saldo": 0.75
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.41,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.56,
      "avg_ht_cp": 2.71,
      "avg_ft_cp": 4.86,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 2.08
  },
  "MLS::Real Salt Lake": {
    "time": "Real Salt Lake",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.67,
        "cc": 5.5,
        "saldo_cantos": 0.17,
        "gp": 2.0,
        "gc": 1.33,
        "saldo_gols": 0.67
      },
      "casa": {
        "cp": 6.33,
        "cc": 5.0,
        "saldo_cantos": 1.33,
        "gp": 2.33,
        "gc": 1.0,
        "saldo_gols": 1.33
      },
      "fora": {
        "cp": 5.0,
        "cc": 6.0,
        "saldo_cantos": -1.0,
        "gp": 1.67,
        "gc": 1.67,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.353,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 34,
      "total_gols": 12
    },
    "dissociacao": {
      "indice": -0.5,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.03,
      "saldo_gols_norm": 0.67
    },
    "pressao": {
      "ratio_liga": 1.1,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.25,
        "avg_cc": 4.75,
        "delta_cp": -0.42,
        "delta_cc": -0.75,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 7.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 8.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 7.0,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.33,
        "cc_avg": 5.0,
        "saldo": 1.33
      }
    },
    "consistencia": {
      "indice": 0.62,
      "cp_std": 2.16,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 3.0,
      "avg_ft_cp": 5.67,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 1.33
  },
  "MLS::Portland Timbers": {
    "time": "Portland Timbers",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 8.57,
        "saldo_cantos": -4.86,
        "gp": 1.57,
        "gc": 2.29,
        "saldo_gols": -0.72
      },
      "casa": {
        "cp": 3.0,
        "cc": 7.75,
        "saldo_cantos": -4.75,
        "gp": 1.75,
        "gc": 2.0,
        "saldo_gols": -0.25
      },
      "fora": {
        "cp": 4.67,
        "cc": 9.67,
        "saldo_cantos": -5.0,
        "gp": 1.33,
        "gc": 2.67,
        "saldo_gols": -1.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.423,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 11
    },
    "dissociacao": {
      "indice": -4.01,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.95,
      "saldo_gols_norm": -0.72
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.5,
        "avg_cc": 7.5,
        "delta_cp": -0.21,
        "delta_cc": -1.07,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 4.25,
        "avg_cc": 9.0,
        "delta_cp": 0.54,
        "delta_cc": 0.43,
        "n": 4
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.8,
        "cc_avg": 8.2,
        "saldo": -4.4
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 12.0,
        "saldo": -6.0
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 2.21,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.86,
      "avg_ft_cp": 3.71,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.71,
      "taxa_ht_4": 0.71
    },
    "split_ctx": -1.67
  },
  "MLS::Los Angeles Galaxy": {
    "time": "Los Angeles Galaxy",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.14,
        "cc": 2.86,
        "saldo_cantos": 3.28,
        "gp": 1.43,
        "gc": 1.57,
        "saldo_gols": -0.14
      },
      "casa": {
        "cp": 6.0,
        "cc": 2.5,
        "saldo_cantos": 3.5,
        "gp": 1.5,
        "gc": 1.25,
        "saldo_gols": 0.25
      },
      "fora": {
        "cp": 6.33,
        "cc": 3.33,
        "saldo_cantos": 3.0,
        "gp": 1.33,
        "gc": 2.0,
        "saldo_gols": -0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.233,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 3.33,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.64,
      "saldo_gols_norm": -0.14
    },
    "pressao": {
      "ratio_liga": 1.19,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.5,
        "avg_cc": 5.5,
        "delta_cp": -1.64,
        "delta_cc": 2.64,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 8.0,
        "avg_cc": 1.67,
        "delta_cp": 1.86,
        "delta_cc": -1.19,
        "n": 3
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": -1.14,
        "n": 2
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 7.6,
        "cc_avg": 2.6,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 3.29,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.37,
      "avg_ht_cp": 2.29,
      "avg_ft_cp": 6.14,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -0.33
  },
  "MLS::Minnesota United": {
    "time": "Minnesota United",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 2,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.43,
        "cc": 6.71,
        "saldo_cantos": -2.28,
        "gp": 1.14,
        "gc": 1.86,
        "saldo_gols": -0.72
      },
      "casa": {
        "cp": 4.5,
        "cc": 9.5,
        "saldo_cantos": -5.0,
        "gp": 0.5,
        "gc": 0.0,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 4.4,
        "cc": 5.6,
        "saldo_cantos": -1.2,
        "gp": 1.4,
        "gc": 2.6,
        "saldo_gols": -1.2
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.258,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 31,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -1.5,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.44,
      "saldo_gols_norm": -0.72
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.33,
        "avg_cc": 8.33,
        "delta_cp": -1.1,
        "delta_cc": 1.62,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 4.0,
        "delta_cp": 0.07,
        "delta_cc": -2.71,
        "n": 2
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": 1.57,
        "n": 2
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.0,
        "cc_avg": 8.0,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 7.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.38,
      "cp_std": 2.76,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.57,
      "avg_ft_cp": 4.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 0.1
  },
  "MLS::Seattle Sounders": {
    "time": "Seattle Sounders",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 6,
      "casa": 1,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.83,
        "cc": 7.83,
        "saldo_cantos": -3.0,
        "gp": 1.0,
        "gc": 0.33,
        "saldo_gols": 0.67
      },
      "casa": {
        "cp": 8.0,
        "cc": 4.0,
        "saldo_cantos": 4.0,
        "gp": 2.0,
        "gc": 0.0,
        "saldo_gols": 2.0
      },
      "fora": {
        "cp": 4.2,
        "cc": 8.6,
        "saldo_cantos": -4.4,
        "gp": 0.8,
        "gc": 0.4,
        "saldo_gols": 0.4
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.207,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": -3.59,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.58,
      "saldo_gols_norm": 0.67
    },
    "pressao": {
      "ratio_liga": 0.94,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 9.5,
        "delta_cp": -1.83,
        "delta_cc": 1.67,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 10.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 1.33,
        "cc_avg": 11.33,
        "saldo": -10.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.5,
        "cc_avg": 4.0,
        "saldo": 3.5
      }
    },
    "consistencia": {
      "indice": 0.16,
      "cp_std": 4.07,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.55,
      "avg_ht_cp": 2.67,
      "avg_ft_cp": 4.83,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.83,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 3.8
  },
  "MLS::FC Cincinnati": {
    "time": "FC Cincinnati",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.71,
        "cc": 3.71,
        "saldo_cantos": 2.0,
        "gp": 1.43,
        "gc": 2.29,
        "saldo_gols": -0.86
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.67,
        "saldo_cantos": 1.33,
        "gp": 2.0,
        "gc": 1.33,
        "saldo_gols": 0.67
      },
      "fora": {
        "cp": 6.25,
        "cc": 3.75,
        "saldo_cantos": 2.5,
        "gp": 1.0,
        "gc": 3.0,
        "saldo_gols": -2.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "casa": {
        "V": 0.667,
        "E": 0.333,
        "D": 0.0,
        "tv": 0.667
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.25,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 40,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 2.81,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.39,
      "saldo_gols_norm": -0.86
    },
    "pressao": {
      "ratio_liga": 1.11,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.5,
        "avg_cc": 2.0,
        "delta_cp": -2.21,
        "delta_cc": -1.71,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 7.25,
        "avg_cc": 3.75,
        "delta_cp": 1.54,
        "delta_cc": 0.04,
        "n": 4
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 2.0,
        "saldo": 4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 2.67,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.4,
      "cp_std": 3.4,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.4,
      "avg_ht_cp": 2.29,
      "avg_ft_cp": 5.71,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": -1.25
  },
  "MLS::CF Montreal": {
    "time": "CF Montreal",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 1,
      "fora": 6
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 5.14,
        "saldo_cantos": -1.14,
        "gp": 1.14,
        "gc": 2.71,
        "saldo_gols": -1.57
      },
      "casa": {
        "cp": 2.0,
        "cc": 4.0,
        "saldo_cantos": -2.0,
        "gp": 1.0,
        "gc": 2.0,
        "saldo_gols": -1.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 5.33,
        "saldo_cantos": -1.0,
        "gp": 1.17,
        "gc": 2.83,
        "saldo_gols": -1.66
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.143,
        "D": 0.571,
        "tv": 0.286
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.286,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 28,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": 0.46,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.22,
      "saldo_gols_norm": -1.57
    },
    "pressao": {
      "ratio_liga": 0.78,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 11.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 4.17,
        "delta_cp": 0.0,
        "delta_cc": -0.97,
        "n": 6
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 5.67,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.0,
        "cc_avg": 4.67,
        "saldo": 1.33
      }
    },
    "consistencia": {
      "indice": 0.28,
      "cp_std": 2.89,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.57,
      "avg_ht_cp": 2.29,
      "avg_ft_cp": 4.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -2.33
  },
  "MLS::New York City": {
    "time": "New York City",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.14,
        "cc": 5.0,
        "saldo_cantos": -0.86,
        "gp": 2.0,
        "gc": 1.29,
        "saldo_gols": 0.71
      },
      "casa": {
        "cp": 4.5,
        "cc": 4.25,
        "saldo_cantos": 0.25,
        "gp": 2.75,
        "gc": 1.25,
        "saldo_gols": 1.5
      },
      "fora": {
        "cp": 3.67,
        "cc": 6.0,
        "saldo_cantos": -2.33,
        "gp": 1.0,
        "gc": 1.33,
        "saldo_gols": -0.33
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.286,
        "D": 0.429,
        "tv": 0.286
      },
      "casa": {
        "V": 0.25,
        "E": 0.5,
        "D": 0.25,
        "tv": 0.25
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.483,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -1.55,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.17,
      "saldo_gols_norm": 0.71
    },
    "pressao": {
      "ratio_liga": 0.81,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.33,
        "avg_cc": 3.67,
        "delta_cp": 0.19,
        "delta_cc": -1.33,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 9.5,
        "delta_cp": 1.86,
        "delta_cc": 4.5,
        "n": 2
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": -2.14,
        "n": 2
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 4.0,
        "cc_avg": 5.8,
        "saldo": -1.8
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 3.0,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.57,
      "cp_std": 1.77,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.43,
      "avg_ft_cp": 4.14,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 0.83
  },
  "MLS::Inter Miami": {
    "time": "Inter Miami",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 2,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 6.14,
        "cc": 4.29,
        "saldo_cantos": 1.85,
        "gp": 1.86,
        "gc": 1.71,
        "saldo_gols": 0.15
      },
      "casa": {
        "cp": 9.5,
        "cc": 3.0,
        "saldo_cantos": 6.5,
        "gp": 2.0,
        "gc": 2.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.8,
        "cc": 4.8,
        "saldo_cantos": 0.0,
        "gp": 1.8,
        "gc": 1.6,
        "saldo_gols": 0.2
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.302,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 43,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": 1.65,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.36,
      "saldo_gols_norm": 0.15
    },
    "pressao": {
      "ratio_liga": 1.19,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.33,
        "avg_cc": 5.67,
        "delta_cp": -0.81,
        "delta_cc": 1.38,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 8.0,
        "delta_cp": 1.86,
        "n": 3
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 12.0,
        "cc_avg": 3.0,
        "saldo": 9.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.5,
        "cc_avg": 2.5,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 3.58,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.51,
      "avg_ht_cp": 3.14,
      "avg_ft_cp": 6.14,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 4.7
  },
  "MLS::Vancouver Whitecaps": {
    "time": "Vancouver Whitecaps",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 6,
      "fora": 1
    },
    "base": {
      "geral": {
        "cp": 6.29,
        "cc": 4.0,
        "saldo_cantos": 2.29,
        "gp": 2.71,
        "gc": 0.57,
        "saldo_gols": 2.14
      },
      "casa": {
        "cp": 6.17,
        "cc": 4.17,
        "saldo_cantos": 2.0,
        "gp": 2.5,
        "gc": 0.5,
        "saldo_gols": 2.0
      },
      "fora": {
        "cp": 7.0,
        "cc": 3.0,
        "saldo_cantos": 4.0,
        "gp": 4.0,
        "gc": 1.0,
        "saldo_gols": 3.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.432,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 44,
      "total_gols": 19
    },
    "dissociacao": {
      "indice": 0.09,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.45,
      "saldo_gols_norm": 2.14
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.83,
        "avg_cc": 3.83,
        "delta_cp": 0.54,
        "delta_cc": -0.17,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 3.0,
        "cc_avg": 5.0,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 4.0,
        "saldo": 1.67
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 3.09,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.48,
      "avg_ht_cp": 3.0,
      "avg_ft_cp": 6.29,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.43
    },
    "split_ctx": -0.83
  },
  "MLS::San Jose Earthquakes": {
    "time": "San Jose Earthquakes",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 8.0,
        "cc": 4.0,
        "saldo_cantos": 4.0,
        "gp": 1.86,
        "gc": 0.29,
        "saldo_gols": 1.57
      },
      "casa": {
        "cp": 11.5,
        "cc": 3.0,
        "saldo_cantos": 8.5,
        "gp": 2.0,
        "gc": 0.25,
        "saldo_gols": 1.75
      },
      "fora": {
        "cp": 3.33,
        "cc": 5.33,
        "saldo_cantos": -2.0,
        "gp": 1.67,
        "gc": 0.33,
        "saldo_gols": 1.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.232,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 56,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": 2.32,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.78,
      "saldo_gols_norm": 1.57
    },
    "pressao": {
      "ratio_liga": 1.56,
      "perfil": "ALTO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.5,
        "avg_cc": 4.67,
        "delta_cp": -1.5,
        "delta_cc": 0.67,
        "n": 6
      },
      "perdeu": {
        "avg_cp": 17.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 3.0,
        "cc_avg": 7.0,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 12.0,
        "cc_avg": 1.67,
        "saldo": 10.33
      }
    },
    "consistencia": {
      "indice": 0.27,
      "cp_std": 5.86,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.34,
      "avg_ht_cp": 2.71,
      "avg_ft_cp": 8.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.71,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 8.17
  },
  "MLS::Austin FC": {
    "time": "Austin FC",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.43,
        "cc": 6.71,
        "saldo_cantos": -1.28,
        "gp": 1.14,
        "gc": 1.57,
        "saldo_gols": -0.43
      },
      "casa": {
        "cp": 7.0,
        "cc": 5.25,
        "saldo_cantos": 1.75,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.33,
        "cc": 8.67,
        "saldo_cantos": -5.34,
        "gp": 1.33,
        "gc": 2.33,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.211,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 38,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -0.81,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.25,
      "saldo_gols_norm": -0.43
    },
    "pressao": {
      "ratio_liga": 1.06,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 10.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.33,
        "avg_cc": 8.0,
        "delta_cp": -1.1,
        "delta_cc": 1.29,
        "n": 3
      },
      "empatou": {
        "avg_cp": 5.0,
        "delta_cp": -0.43,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 6.0,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 7.0,
        "cc_avg": 8.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.54,
      "cp_std": 2.51,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.71,
      "avg_ft_cp": 5.43,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.86,
      "taxa_ht_4": 0.71
    },
    "split_ctx": 3.67
  },
  "MLS::Los Angeles FC": {
    "time": "Los Angeles FC",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 5.71,
        "cc": 5.14,
        "saldo_cantos": 0.57,
        "gp": 2.14,
        "gc": 0.29,
        "saldo_gols": 1.85
      },
      "casa": {
        "cp": 5.25,
        "cc": 6.5,
        "saldo_cantos": -1.25,
        "gp": 3.0,
        "gc": 0.0,
        "saldo_gols": 3.0
      },
      "fora": {
        "cp": 6.33,
        "cc": 3.33,
        "saldo_cantos": 3.0,
        "gp": 1.0,
        "gc": 0.67,
        "saldo_gols": 0.33
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.375,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 40,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -1.3,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": 1.85
    },
    "pressao": {
      "ratio_liga": 1.11,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.8,
        "avg_cc": 6.0,
        "delta_cp": 0.09,
        "delta_cc": 0.86,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 1.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 5.33,
        "saldo": 0.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.75,
        "cc_avg": 5.0,
        "saldo": 0.75
      }
    },
    "consistencia": {
      "indice": 0.67,
      "cp_std": 1.89,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.6,
      "avg_ht_cp": 3.43,
      "avg_ft_cp": 5.71,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -1.08
  },
  "MLS::FC Dallas": {
    "time": "FC Dallas",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 5,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 4.43,
        "cc": 5.43,
        "saldo_cantos": -1.0,
        "gp": 2.14,
        "gc": 1.43,
        "saldo_gols": 0.71
      },
      "casa": {
        "cp": 4.2,
        "cc": 5.6,
        "saldo_cantos": -1.4,
        "gp": 2.2,
        "gc": 1.8,
        "saldo_gols": 0.4
      },
      "fora": {
        "cp": 5.0,
        "cc": 5.0,
        "saldo_cantos": 0.0,
        "gp": 2.0,
        "gc": 0.5,
        "saldo_gols": 1.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.429,
        "E": 0.0,
        "D": 0.571,
        "tv": 0.429
      },
      "casa": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.484,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 31,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -1.68,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.19,
      "saldo_gols_norm": 0.71
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 7.0,
        "delta_cp": -0.43,
        "delta_cc": 1.57,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.43,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 5.5,
        "cc_avg": 9.0,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 1.62,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.71,
      "avg_ft_cp": 4.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -0.8
  },
  "MLS::Houston Dynamo": {
    "time": "Houston Dynamo",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 6,
      "casa": 4,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 6.33,
        "cc": 5.0,
        "saldo_cantos": 1.33,
        "gp": 1.67,
        "gc": 2.67,
        "saldo_gols": -1.0
      },
      "casa": {
        "cp": 6.5,
        "cc": 5.5,
        "saldo_cantos": 1.0,
        "gp": 1.25,
        "gc": 1.5,
        "saldo_gols": -0.25
      },
      "fora": {
        "cp": 6.0,
        "cc": 4.0,
        "saldo_cantos": 2.0,
        "gp": 2.5,
        "gc": 5.0,
        "saldo_gols": -2.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.263,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 38,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 2.29,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.26,
      "saldo_gols_norm": -1.0
    },
    "pressao": {
      "ratio_liga": 1.23,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.5,
        "avg_cc": 5.5,
        "delta_cp": 0.17,
        "delta_cc": 0.5,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 6.25,
        "avg_cc": 4.75,
        "delta_cp": -0.08,
        "delta_cc": -0.25,
        "n": 4
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 6.8,
        "cc_avg": 4.4,
        "saldo": 2.4
      }
    },
    "consistencia": {
      "indice": 0.52,
      "cp_std": 3.01,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.45,
      "avg_ht_cp": 2.83,
      "avg_ft_cp": 6.33,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.83
    },
    "split_ctx": 0.5
  },
  "MLS::Sporting Kansas City": {
    "time": "Sporting Kansas City",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.0,
        "cc": 7.14,
        "saldo_cantos": -4.14,
        "gp": 1.0,
        "gc": 2.43,
        "saldo_gols": -1.43
      },
      "casa": {
        "cp": 3.5,
        "cc": 4.5,
        "saldo_cantos": -1.0,
        "gp": 1.0,
        "gc": 2.5,
        "saldo_gols": -1.5
      },
      "fora": {
        "cp": 2.33,
        "cc": 10.67,
        "saldo_cantos": -8.34,
        "gp": 1.0,
        "gc": 2.33,
        "saldo_gols": -1.33
      }
    },
    "ved": {
      "geral": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.333,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 21,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -2.6,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.81,
      "saldo_gols_norm": -1.43
    },
    "pressao": {
      "ratio_liga": 0.58,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 10.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 2.8,
        "avg_cc": 7.2,
        "delta_cp": -0.2,
        "delta_cc": 0.06,
        "n": 5
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.0,
        "cc_avg": 8.25,
        "saldo": -5.25
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 4.0,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 1.63,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 1.57,
      "avg_ft_cp": 3.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 1.17
  },
  "MLS::Colorado Rapids": {
    "time": "Colorado Rapids",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.57,
        "cc": 5.71,
        "saldo_cantos": -1.14,
        "gp": 2.71,
        "gc": 1.71,
        "saldo_gols": 1.0
      },
      "casa": {
        "cp": 5.33,
        "cc": 5.0,
        "saldo_cantos": 0.33,
        "gp": 4.0,
        "gc": 1.0,
        "saldo_gols": 3.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 6.25,
        "saldo_cantos": -2.25,
        "gp": 1.75,
        "gc": 2.25,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.143,
        "E": 0.143,
        "D": 0.714,
        "tv": 0.143
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.594,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 32,
      "total_gols": 19
    },
    "dissociacao": {
      "indice": -2.11,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.22,
      "saldo_gols_norm": 1.0
    },
    "pressao": {
      "ratio_liga": 0.89,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.0,
        "avg_cc": 5.25,
        "delta_cp": 0.43,
        "delta_cc": -0.46,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 6.33,
        "delta_cp": -0.57,
        "delta_cc": 0.62,
        "n": 3
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.0,
        "cc_avg": 4.5,
        "saldo": -2.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 6.67,
        "cc_avg": 6.67,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.25,
      "cp_std": 3.41,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 4.57,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 1.33
  },
  "MLS::St. Louis City": {
    "time": "St. Louis City",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 6.43,
        "cc": 3.43,
        "saldo_cantos": 3.0,
        "gp": 0.86,
        "gc": 1.29,
        "saldo_gols": -0.43
      },
      "casa": {
        "cp": 6.67,
        "cc": 1.67,
        "saldo_cantos": 5.0,
        "gp": 1.33,
        "gc": 1.0,
        "saldo_gols": 0.33
      },
      "fora": {
        "cp": 6.25,
        "cc": 4.75,
        "saldo_cantos": 1.5,
        "gp": 0.5,
        "gc": 1.5,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.857,
        "E": 0.0,
        "D": 0.143,
        "tv": 0.857
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.133,
      "perfil": "MÉDIO",
      "total_cantos_pro": 45,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 3.35,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.58,
      "saldo_gols_norm": -0.43
    },
    "pressao": {
      "ratio_liga": 1.25,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.33,
        "avg_cc": 4.33,
        "delta_cp": -0.1,
        "delta_cc": 0.9,
        "n": 3
      },
      "empatou": {
        "avg_cp": 6.67,
        "delta_cp": 0.24,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 8.0,
        "cc_avg": 3.0,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 2.82,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.4,
      "avg_ht_cp": 2.57,
      "avg_ft_cp": 6.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.14
    },
    "split_ctx": 0.42
  },
  "MLS::New England Revolution": {
    "time": "New England Revolution",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 2.5,
        "cc": 4.33,
        "saldo_cantos": -1.83,
        "gp": 2.0,
        "gc": 1.5,
        "saldo_gols": 0.5
      },
      "casa": {
        "cp": 1.33,
        "cc": 3.67,
        "saldo_cantos": -2.34,
        "gp": 3.33,
        "gc": 0.33,
        "saldo_gols": 3.0
      },
      "fora": {
        "cp": 3.67,
        "cc": 5.0,
        "saldo_cantos": -1.33,
        "gp": 0.67,
        "gc": 2.67,
        "saldo_gols": -2.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.167,
        "D": 0.833,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.333,
        "D": 0.667,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.8,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 15,
      "total_gols": 12
    },
    "dissociacao": {
      "indice": -2.28,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.36,
      "saldo_gols_norm": 0.5
    },
    "pressao": {
      "ratio_liga": 0.49,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.33,
        "avg_cc": 3.67,
        "delta_cp": -1.17,
        "delta_cc": -0.66,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 3.67,
        "avg_cc": 5.0,
        "delta_cp": 1.17,
        "delta_cc": 0.67,
        "n": 3
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 5.0,
        "saldo": -1.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 1.0,
        "cc_avg": 5.0,
        "saldo": -4.0
      }
    },
    "consistencia": {
      "indice": 0.25,
      "cp_std": 1.87,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.33,
      "avg_ht_cp": 0.83,
      "avg_ft_cp": 2.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.17,
      "taxa_ht_4": 0.17
    },
    "split_ctx": -2.34
  },
  "MLS::Atlanta Utd": {
    "time": "Atlanta Utd",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.57,
        "cc": 5.43,
        "saldo_cantos": -0.86,
        "gp": 0.86,
        "gc": 1.71,
        "saldo_gols": -0.85
      },
      "casa": {
        "cp": 3.75,
        "cc": 5.0,
        "saldo_cantos": -1.25,
        "gp": 1.5,
        "gc": 1.75,
        "saldo_gols": -0.25
      },
      "fora": {
        "cp": 5.67,
        "cc": 6.0,
        "saldo_cantos": -0.33,
        "gp": 0.0,
        "gc": 1.67,
        "saldo_gols": -1.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.188,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 32,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 0.01,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.17,
      "saldo_gols_norm": -0.85
    },
    "pressao": {
      "ratio_liga": 0.89,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 6.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 5.6,
        "delta_cp": 0.43,
        "delta_cc": 0.17,
        "n": 5
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.5,
        "cc_avg": 6.5,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 11.0,
        "cc_avg": 6.0,
        "saldo": 5.0
      }
    },
    "consistencia": {
      "indice": 0.36,
      "cp_std": 2.94,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 2.43,
      "avg_ft_cp": 4.57,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -1.92
  },
  "MLS::DC United": {
    "time": "DC United",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.43,
        "cc": 4.0,
        "saldo_cantos": 0.43,
        "gp": 0.57,
        "gc": 1.29,
        "saldo_gols": -0.72
      },
      "casa": {
        "cp": 5.0,
        "cc": 3.0,
        "saldo_cantos": 2.0,
        "gp": 0.67,
        "gc": 2.0,
        "saldo_gols": -1.33
      },
      "fora": {
        "cp": 4.0,
        "cc": 4.75,
        "saldo_cantos": -0.75,
        "gp": 0.5,
        "gc": 0.75,
        "saldo_gols": -0.25
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.0,
        "D": 0.286,
        "tv": 0.714
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.129,
      "perfil": "MÉDIO",
      "total_cantos_pro": 31,
      "total_gols": 4
    },
    "dissociacao": {
      "indice": 1.14,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.08,
      "saldo_gols_norm": -0.72
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 4.5,
        "delta_cp": -1.43,
        "delta_cc": 0.5,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 5.25,
        "avg_cc": 4.0,
        "delta_cp": 0.82,
        "delta_cc": 0.0,
        "n": 4
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 3.0,
        "saldo": 1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 4.5,
        "cc_avg": 4.75,
        "saldo": -0.25
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.23,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.57,
      "avg_ft_cp": 4.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.14,
      "taxa_ht_4": 0.14
    },
    "split_ctx": 1.0
  },
  "MLS::Charlotte": {
    "time": "Charlotte",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 5,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 4.43,
        "cc": 5.29,
        "saldo_cantos": -0.86,
        "gp": 1.86,
        "gc": 1.29,
        "saldo_gols": 0.57
      },
      "casa": {
        "cp": 5.0,
        "cc": 5.4,
        "saldo_cantos": -0.4,
        "gp": 2.4,
        "gc": 1.0,
        "saldo_gols": 1.4
      },
      "fora": {
        "cp": 3.0,
        "cc": 5.0,
        "saldo_cantos": -2.0,
        "gp": 0.5,
        "gc": 2.0,
        "saldo_gols": -1.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.2,
        "E": 0.0,
        "D": 0.8,
        "tv": 0.2
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.419,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 31,
      "total_gols": 13
    },
    "dissociacao": {
      "indice": -1.41,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.17,
      "saldo_gols_norm": 0.57
    },
    "pressao": {
      "ratio_liga": 0.86,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.67,
        "avg_cc": 6.0,
        "delta_cp": 2.24,
        "delta_cc": 0.71,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 3.5,
        "avg_cc": 4.0,
        "delta_cp": -0.93,
        "delta_cc": -1.29,
        "n": 2
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": -2.43,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 3.4,
        "cc_avg": 6.0,
        "saldo": -2.6
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 12.0,
        "cc_avg": 3.0,
        "saldo": 9.0
      }
    },
    "consistencia": {
      "indice": 0.15,
      "cp_std": 3.78,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.39,
      "avg_ht_cp": 1.71,
      "avg_ft_cp": 4.43,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.43
    },
    "split_ctx": 2.0
  },
  "MLS::New York Red Bulls": {
    "time": "New York Red Bulls",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 7.14,
        "cc": 5.71,
        "saldo_cantos": 1.43,
        "gp": 1.57,
        "gc": 2.14,
        "saldo_gols": -0.57
      },
      "casa": {
        "cp": 6.33,
        "cc": 5.33,
        "saldo_cantos": 1.0,
        "gp": 1.67,
        "gc": 1.67,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 7.75,
        "cc": 6.0,
        "saldo_cantos": 1.75,
        "gp": 1.5,
        "gc": 2.5,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "casa": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.22,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 50,
      "total_gols": 11
    },
    "dissociacao": {
      "indice": 1.96,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.28,
      "saldo_gols_norm": -0.57
    },
    "pressao": {
      "ratio_liga": 1.39,
      "perfil": "ALTO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.67,
        "avg_cc": 5.67,
        "delta_cp": -1.47,
        "delta_cc": -0.04,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 9.5,
        "avg_cc": 3.0,
        "delta_cp": 2.36,
        "delta_cc": -2.71,
        "n": 2
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": -0.14,
        "n": 2
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 9.0,
        "saldo": -6.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 8.67,
        "cc_avg": 5.0,
        "saldo": 3.67
      }
    },
    "consistencia": {
      "indice": 0.49,
      "cp_std": 3.63,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 4.14,
      "avg_ft_cp": 7.14,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.86,
      "taxa_ht_4": 0.86
    },
    "split_ctx": -1.42
  },
  "MLS::Nashville SC": {
    "time": "Nashville SC",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 3.14,
        "saldo_cantos": 0.57,
        "gp": 2.14,
        "gc": 0.57,
        "saldo_gols": 1.57
      },
      "casa": {
        "cp": 4.33,
        "cc": 3.0,
        "saldo_cantos": 1.33,
        "gp": 4.0,
        "gc": 0.67,
        "saldo_gols": 3.33
      },
      "fora": {
        "cp": 3.25,
        "cc": 3.25,
        "saldo_cantos": 0.0,
        "gp": 0.75,
        "gc": 0.5,
        "saldo_gols": 0.25
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.143,
        "D": 0.286,
        "tv": 0.571
      },
      "casa": {
        "V": 0.667,
        "E": 0.333,
        "D": 0.0,
        "tv": 0.667
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.577,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 15
    },
    "dissociacao": {
      "indice": -1.02,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": 1.57
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 3.4,
        "delta_cp": 0.29,
        "delta_cc": 0.26,
        "n": 5
      },
      "perdeu": {
        "avg_cp": 3.0,
        "avg_cc": 1.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 3.0,
        "cc_avg": 6.0,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 5,
        "cp_avg": 3.8,
        "cc_avg": 2.8,
        "saldo": 1.0
      }
    },
    "consistencia": {
      "indice": 0.74,
      "cp_std": 0.95,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.58,
      "avg_ht_cp": 2.14,
      "avg_ft_cp": 3.71,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.14,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 1.08
  },
  "MLS::Orlando City": {
    "time": "Orlando City",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 3.71,
        "cc": 7.57,
        "saldo_cantos": -3.86,
        "gp": 0.86,
        "gc": 3.43,
        "saldo_gols": -2.57
      },
      "casa": {
        "cp": 3.67,
        "cc": 9.0,
        "saldo_cantos": -5.33,
        "gp": 1.67,
        "gc": 2.33,
        "saldo_gols": -0.66
      },
      "fora": {
        "cp": 3.75,
        "cc": 6.5,
        "saldo_cantos": -2.75,
        "gp": 0.25,
        "gc": 4.25,
        "saldo_gols": -4.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.143,
        "D": 0.857,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.25,
        "D": 0.75,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.231,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": -1.18,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.75,
      "saldo_gols_norm": -2.57
    },
    "pressao": {
      "ratio_liga": 0.72,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 10.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.2,
        "avg_cc": 7.0,
        "delta_cp": 0.49,
        "delta_cc": -0.57,
        "n": 5
      },
      "empatou": {
        "avg_cp": 1.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 8.33,
        "saldo": -5.66
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 10.0,
        "saldo": -6.0
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 2.14,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.23,
      "avg_ht_cp": 0.86,
      "avg_ft_cp": 3.71,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.71,
      "taxa_ht_4": 0.57
    },
    "split_ctx": -0.08
  },
  "MLS::Philadelphia Union": {
    "time": "Philadelphia Union",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 6.29,
        "cc": 2.86,
        "saldo_cantos": 3.43,
        "gp": 0.86,
        "gc": 1.71,
        "saldo_gols": -0.85
      },
      "casa": {
        "cp": 7.33,
        "cc": 2.33,
        "saldo_cantos": 5.0,
        "gp": 0.67,
        "gc": 1.67,
        "saldo_gols": -1.0
      },
      "fora": {
        "cp": 5.5,
        "cc": 3.25,
        "saldo_cantos": 2.25,
        "gp": 1.0,
        "gc": 1.75,
        "saldo_gols": -0.75
      }
    },
    "ved": {
      "geral": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.136,
      "perfil": "MÉDIO",
      "total_cantos_pro": 44,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 4.19,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.67,
      "saldo_gols_norm": -0.85
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 2.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.67,
        "avg_cc": 3.0,
        "delta_cp": 0.38,
        "delta_cc": 0.14,
        "n": 6
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 11.0,
        "cc_avg": 1.0,
        "saldo": 10.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 5.0,
        "cc_avg": 2.0,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.64,
      "cp_std": 2.29,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.3,
      "avg_ht_cp": 1.86,
      "avg_ft_cp": 6.29,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 1.83
  },
  "MLS::Chicago Fire": {
    "time": "Chicago Fire",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.29,
        "cc": 5.43,
        "saldo_cantos": -1.14,
        "gp": 1.29,
        "gc": 0.71,
        "saldo_gols": 0.58
      },
      "casa": {
        "cp": 5.0,
        "cc": 5.5,
        "saldo_cantos": -0.5,
        "gp": 1.5,
        "gc": 0.5,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 3.33,
        "cc": 5.33,
        "saldo_cantos": -2.0,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.3,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 9
    },
    "dissociacao": {
      "indice": -1.69,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.22,
      "saldo_gols_norm": 0.58
    },
    "pressao": {
      "ratio_liga": 0.83,
      "perfil": "BAIXO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.5,
        "avg_cc": 5.75,
        "delta_cp": 0.21,
        "delta_cc": 0.32,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 4.0,
        "delta_cp": 0.21,
        "delta_cc": -1.43,
        "n": 2
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 5.33,
        "saldo": -2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 9.0,
        "cc_avg": 3.0,
        "saldo": 6.0
      }
    },
    "consistencia": {
      "indice": 0.37,
      "cp_std": 2.69,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.14,
      "avg_ft_cp": 4.29,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.43,
      "taxa_ht_4": 0.57
    },
    "split_ctx": 1.67
  },
  "MLS::Toronto FC": {
    "time": "Toronto FC",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.29,
        "cc": 6.0,
        "saldo_cantos": 0.29,
        "gp": 1.43,
        "gc": 1.57,
        "saldo_gols": -0.14
      },
      "casa": {
        "cp": 7.25,
        "cc": 6.5,
        "saldo_cantos": 0.75,
        "gp": 1.75,
        "gc": 1.25,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 5.0,
        "cc": 5.33,
        "saldo_cantos": -0.33,
        "gp": 1.0,
        "gc": 2.0,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.571,
        "E": 0.0,
        "D": 0.429,
        "tv": 0.571
      },
      "casa": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.227,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 44,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 0.42,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.06,
      "saldo_gols_norm": -0.14
    },
    "pressao": {
      "ratio_liga": 1.22,
      "perfil": "MÉDIO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 8.0,
        "avg_cc": 6.33,
        "delta_cp": 1.71,
        "delta_cc": 0.33,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 4.0,
        "delta_cp": -2.29,
        "delta_cc": -2.0,
        "n": 2
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": -0.29,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 5,
        "cp_avg": 6.0,
        "cc_avg": 7.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 7.0,
        "cc_avg": 3.5,
        "saldo": 3.5
      }
    },
    "consistencia": {
      "indice": 0.56,
      "cp_std": 2.75,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.43,
      "avg_ht_cp": 2.71,
      "avg_ft_cp": 6.29,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.86,
      "taxa_ht_4": 0.71
    },
    "split_ctx": 2.25
  },
  "MLS::Columbus Crew": {
    "time": "Columbus Crew",
    "liga": "MLS",
    "liga_nome": "MLS 2026",
    "n": {
      "geral": 7,
      "casa": 3,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 6.86,
        "cc": 4.43,
        "saldo_cantos": 2.43,
        "gp": 1.29,
        "gc": 1.43,
        "saldo_gols": -0.14
      },
      "casa": {
        "cp": 7.0,
        "cc": 2.33,
        "saldo_cantos": 4.67,
        "gp": 0.33,
        "gc": 0.67,
        "saldo_gols": -0.34
      },
      "fora": {
        "cp": 6.75,
        "cc": 6.0,
        "saldo_cantos": 0.75,
        "gp": 2.0,
        "gc": 2.0,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.714,
        "E": 0.143,
        "D": 0.143,
        "tv": 0.714
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.188,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 48,
      "total_gols": 9
    },
    "dissociacao": {
      "indice": 2.5,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.47,
      "saldo_gols_norm": -0.14
    },
    "pressao": {
      "ratio_liga": 1.33,
      "perfil": "ALTO",
      "media_liga_ft": 5.14
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 8.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 6.33,
        "delta_cp": 0.14,
        "delta_cc": 1.9,
        "n": 3
      },
      "empatou": {
        "avg_cp": 6.33,
        "delta_cp": -0.53,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 6.75,
        "cc_avg": 3.5,
        "saldo": 3.25
      }
    },
    "consistencia": {
      "indice": 0.79,
      "cp_std": 1.46,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.63,
      "avg_ht_cp": 4.29,
      "avg_ft_cp": 6.86,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 1.0
    },
    "split_ctx": 0.25
  },
  "USL::San Antonio": {
    "time": "San Antonio",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.86,
        "cc": 5.57,
        "saldo_cantos": -1.71,
        "gp": 0.71,
        "gc": 0.43,
        "saldo_gols": 0.28
      },
      "casa": {
        "cp": 3.5,
        "cc": 5.0,
        "saldo_cantos": -1.5,
        "gp": 1.25,
        "gc": 0.25,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 4.33,
        "cc": 6.33,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 0.67,
        "saldo_gols": -0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.185,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 27,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": -2.17,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.38,
      "saldo_gols_norm": 0.28
    },
    "pressao": {
      "ratio_liga": 0.85,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.33,
        "avg_cc": 5.0,
        "delta_cp": 0.47,
        "delta_cc": -0.57,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 3.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.67,
        "delta_cp": -1.19,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 5.0,
        "saldo": -0.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 3.5,
        "cc_avg": 4.0,
        "saldo": -0.5
      }
    },
    "consistencia": {
      "indice": 0.26,
      "cp_std": 2.85,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 3.86,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.57,
      "taxa_ht_4": 0.43
    },
    "split_ctx": -0.83
  },
  "USL::Lexington": {
    "time": "Lexington",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 4,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 4.83,
        "cc": 4.17,
        "saldo_cantos": 0.66,
        "gp": 1.0,
        "gc": 1.33,
        "saldo_gols": -0.33
      },
      "casa": {
        "cp": 4.0,
        "cc": 3.25,
        "saldo_cantos": 0.75,
        "gp": 1.25,
        "gc": 1.25,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 6.5,
        "cc": 6.0,
        "saldo_cantos": 0.5,
        "gp": 0.5,
        "gc": 1.5,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "casa": {
        "V": 0.5,
        "E": 0.25,
        "D": 0.25,
        "tv": 0.5
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.207,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 1.06,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.15,
      "saldo_gols_norm": -0.33
    },
    "pressao": {
      "ratio_liga": 1.06,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 2.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.33,
        "avg_cc": 4.0,
        "delta_cp": 1.5,
        "delta_cc": -0.17,
        "n": 3
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": -1.83,
        "n": 2
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 8.0,
        "saldo": -5.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 9.0,
        "cc_avg": 3.0,
        "saldo": 6.0
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 3.43,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.28,
      "avg_ht_cp": 1.33,
      "avg_ft_cp": 4.83,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.5,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -2.5
  },
  "USL::Las Vegas Lights": {
    "time": "Las Vegas Lights",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 2,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.83,
        "cc": 4.0,
        "saldo_cantos": 0.83,
        "gp": 1.5,
        "gc": 1.83,
        "saldo_gols": -0.33
      },
      "casa": {
        "cp": 3.5,
        "cc": 5.0,
        "saldo_cantos": -1.5,
        "gp": 1.0,
        "gc": 0.5,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 5.5,
        "cc": 3.5,
        "saldo_cantos": 2.0,
        "gp": 1.75,
        "gc": 2.5,
        "saldo_gols": -0.75
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.75,
        "E": 0.0,
        "D": 0.25,
        "tv": 0.75
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.31,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 29,
      "total_gols": 9
    },
    "dissociacao": {
      "indice": 1.24,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.18,
      "saldo_gols_norm": -0.33
    },
    "pressao": {
      "ratio_liga": 1.06,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 4.0,
        "delta_cp": 1.17,
        "delta_cc": 0.0,
        "n": 3
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.83,
        "n": 2
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 7.0,
        "saldo": -3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 1.5,
        "saldo": 4.5
      }
    },
    "consistencia": {
      "indice": 0.62,
      "cp_std": 1.83,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 4.83,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -2.0
  },
  "USL::Monterey Bay": {
    "time": "Monterey Bay",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.33,
        "cc": 3.83,
        "saldo_cantos": 0.5,
        "gp": 0.33,
        "gc": 1.5,
        "saldo_gols": -1.17
      },
      "casa": {
        "cp": 5.67,
        "cc": 3.0,
        "saldo_cantos": 2.67,
        "gp": 0.0,
        "gc": 1.33,
        "saldo_gols": -1.33
      },
      "fora": {
        "cp": 3.0,
        "cc": 4.67,
        "saldo_cantos": -1.67,
        "gp": 0.67,
        "gc": 1.67,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.077,
      "perfil": "MÉDIO",
      "total_cantos_pro": 26,
      "total_gols": 2
    },
    "dissociacao": {
      "indice": 1.72,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": -1.17
    },
    "pressao": {
      "ratio_liga": 0.95,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 3.25,
        "delta_cp": 0.17,
        "delta_cc": -0.58,
        "n": 4
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.33,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 3.0,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.25,
        "cc_avg": 3.25,
        "saldo": 2.0
      }
    },
    "consistencia": {
      "indice": 0.22,
      "cp_std": 3.39,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.42,
      "avg_ht_cp": 1.83,
      "avg_ft_cp": 4.33,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.17
    },
    "split_ctx": 2.67
  },
  "USL::Sacramento Republic": {
    "time": "Sacramento Republic",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 4,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 3.5,
        "saldo_cantos": 0.5,
        "gp": 1.17,
        "gc": 0.67,
        "saldo_gols": 0.5
      },
      "casa": {
        "cp": 4.25,
        "cc": 3.75,
        "saldo_cantos": 0.5,
        "gp": 1.5,
        "gc": 0.75,
        "saldo_gols": 0.75
      },
      "fora": {
        "cp": 3.5,
        "cc": 3.0,
        "saldo_cantos": 0.5,
        "gp": 0.5,
        "gc": 0.5,
        "saldo_gols": 0.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.5,
        "E": 0.5,
        "D": 0.0,
        "tv": 0.5
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.292,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 24,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": 0.05,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.11,
      "saldo_gols_norm": 0.5
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 2.5,
        "avg_cc": 4.5,
        "delta_cp": -1.5,
        "delta_cc": 1.0,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 6.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.67,
        "delta_cp": 0.67,
        "n": 3
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 3.33,
        "cc_avg": 5.0,
        "saldo": -1.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 6.0,
        "saldo": -1.0
      }
    },
    "consistencia": {
      "indice": 0.5,
      "cp_std": 2.0,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 1.83,
      "avg_ft_cp": 4.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.33
    },
    "split_ctx": 0.75
  },
  "USL::El Paso": {
    "time": "El Paso",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 2,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.6,
        "cc": 5.0,
        "saldo_cantos": -1.4,
        "gp": 2.8,
        "gc": 1.0,
        "saldo_gols": 1.8
      },
      "casa": {
        "cp": 2.0,
        "cc": 5.5,
        "saldo_cantos": -3.5,
        "gp": 2.5,
        "gc": 2.0,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 4.67,
        "cc": 4.67,
        "saldo_cantos": 0.0,
        "gp": 3.0,
        "gc": 0.33,
        "saldo_gols": 2.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.2,
        "D": 0.4,
        "tv": 0.4
      },
      "casa": {
        "V": 0.0,
        "E": 0.5,
        "D": 0.5,
        "tv": 0.0
      },
      "fora": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.778,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 18,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": -3.34,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.31,
      "saldo_gols_norm": 1.8
    },
    "pressao": {
      "ratio_liga": 0.79,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.75,
        "avg_cc": 5.5,
        "delta_cp": 0.15,
        "delta_cc": 0.5,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 3.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.0,
        "cc_avg": 5.5,
        "saldo": -3.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 5.0,
        "cc_avg": 1.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.46,
      "cp_std": 1.95,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.83,
      "avg_ht_cp": 3.0,
      "avg_ft_cp": 3.6,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.8
    },
    "split_ctx": -2.67
  },
  "USL::FC Tulsa": {
    "time": "FC Tulsa",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 4,
      "fora": 1
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 4.0,
        "saldo_cantos": 0.0,
        "gp": 0.8,
        "gc": 1.2,
        "saldo_gols": -0.4
      },
      "casa": {
        "cp": 5.0,
        "cc": 4.5,
        "saldo_cantos": 0.5,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 0.0,
        "cc": 2.0,
        "saldo_cantos": -2.0,
        "gp": 0.0,
        "gc": 2.0,
        "saldo_gols": -2.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.2,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 20,
      "total_gols": 4
    },
    "dissociacao": {
      "indice": 0.4,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": -0.4
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.0,
        "avg_cc": 6.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 2.0,
        "avg_cc": 2.5,
        "delta_cp": -2.0,
        "delta_cc": -1.5,
        "n": 2
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": 2.0,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 4.0,
        "cc_avg": 5.5,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 3.5,
        "saldo": 2.5
      }
    },
    "consistencia": {
      "indice": 0.29,
      "cp_std": 2.83,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.35,
      "avg_ht_cp": 1.4,
      "avg_ft_cp": 4.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.0
    },
    "split_ctx": 5.0
  },
  "USL::Phoenix Rising": {
    "time": "Phoenix Rising",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.5,
        "cc": 3.33,
        "saldo_cantos": 1.17,
        "gp": 1.33,
        "gc": 1.33,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 2.67,
        "cc": 4.0,
        "saldo_cantos": -1.33,
        "gp": 2.0,
        "gc": 1.0,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 6.33,
        "cc": 2.67,
        "saldo_cantos": 3.66,
        "gp": 0.67,
        "gc": 1.67,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "casa": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.296,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 27,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": 1.29,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.26,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.99,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 7.0,
        "avg_cc": 2.0,
        "delta_cp": 2.5,
        "delta_cc": -1.33,
        "n": 2
      },
      "empatou": {
        "avg_cp": 4.0,
        "delta_cp": -0.5,
        "n": 3
      },
      "perfil": "PRESSIONADOR",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 1.0,
        "cc_avg": 5.0,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.0,
        "cc_avg": 2.67,
        "saldo": 1.33
      }
    },
    "consistencia": {
      "indice": 0.38,
      "cp_std": 2.81,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.26,
      "avg_ht_cp": 1.17,
      "avg_ft_cp": 4.5,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.17,
      "taxa_ht_4": 0.17
    },
    "split_ctx": -3.66
  },
  "USL::Oakland Roots": {
    "time": "Oakland Roots",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 2,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 2.8,
        "cc": 4.8,
        "saldo_cantos": -2.0,
        "gp": 1.4,
        "gc": 1.2,
        "saldo_gols": 0.2
      },
      "casa": {
        "cp": 3.0,
        "cc": 5.5,
        "saldo_cantos": -2.5,
        "gp": 1.0,
        "gc": 1.0,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 2.67,
        "cc": 4.33,
        "saldo_cantos": -1.66,
        "gp": 1.67,
        "gc": 1.33,
        "saldo_gols": 0.34
      }
    },
    "ved": {
      "geral": {
        "V": 0.4,
        "E": 0.0,
        "D": 0.6,
        "tv": 0.4
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.5,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 14,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -2.4,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.44,
      "saldo_gols_norm": 0.2
    },
    "pressao": {
      "ratio_liga": 0.62,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.5,
        "avg_cc": 5.0,
        "delta_cp": -1.3,
        "delta_cc": 0.2,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 2.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.5,
        "delta_cp": -0.3,
        "n": 2
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 1.67,
        "cc_avg": 7.0,
        "saldo": -5.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 2.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.15,
      "cp_std": 2.39,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 1.4,
      "avg_ft_cp": 2.8,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.0,
      "taxa_ht_4": 0.2
    },
    "split_ctx": 0.33
  },
  "USL::Orange County SC": {
    "time": "Orange County SC",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 7,
      "casa": 4,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.29,
        "cc": 4.71,
        "saldo_cantos": -1.42,
        "gp": 1.0,
        "gc": 0.43,
        "saldo_gols": 0.57
      },
      "casa": {
        "cp": 3.75,
        "cc": 5.25,
        "saldo_cantos": -1.5,
        "gp": 1.0,
        "gc": 0.5,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 2.67,
        "cc": 4.0,
        "saldo_cantos": -1.33,
        "gp": 1.0,
        "gc": 0.33,
        "saldo_gols": 0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.286,
        "E": 0.0,
        "D": 0.714,
        "tv": 0.286
      },
      "casa": {
        "V": 0.25,
        "E": 0.0,
        "D": 0.75,
        "tv": 0.25
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.304,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 23,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -2.14,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.31,
      "saldo_gols_norm": 0.57
    },
    "pressao": {
      "ratio_liga": 0.73,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 5.75,
        "delta_cp": -0.29,
        "delta_cc": 1.04,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.5,
        "delta_cp": -0.79,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 4,
        "cp_avg": 3.75,
        "cc_avg": 4.25,
        "saldo": -0.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 6.0,
        "saldo": -3.5
      }
    },
    "consistencia": {
      "indice": 0.58,
      "cp_std": 1.38,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 1.71,
      "avg_ft_cp": 3.29,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.29,
      "taxa_ht_4": 0.29
    },
    "split_ctx": 1.08
  },
  "USL::Brooklyn": {
    "time": "Brooklyn",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 4,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 5.17,
        "cc": 6.33,
        "saldo_cantos": -1.16,
        "gp": 0.83,
        "gc": 1.5,
        "saldo_gols": -0.67
      },
      "casa": {
        "cp": 7.0,
        "cc": 7.0,
        "saldo_cantos": 0.0,
        "gp": 1.25,
        "gc": 0.75,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 1.5,
        "cc": 5.0,
        "saldo_cantos": -3.5,
        "gp": 0.0,
        "gc": 3.0,
        "saldo_gols": -3.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.167,
        "E": 0.167,
        "D": 0.667,
        "tv": 0.167
      },
      "casa": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.161,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 31,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": -0.61,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.26,
      "saldo_gols_norm": -0.67
    },
    "pressao": {
      "ratio_liga": 1.14,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 6.5,
        "avg_cc": 7.5,
        "delta_cp": 1.33,
        "delta_cc": 1.17,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 4.5,
        "avg_cc": 5.75,
        "delta_cp": -0.67,
        "delta_cc": -0.58,
        "n": 4
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 6.33,
        "saldo": -4.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.0,
        "cc_avg": 4.5,
        "saldo": 3.5
      }
    },
    "consistencia": {
      "indice": 0.27,
      "cp_std": 3.76,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.55,
      "avg_ht_cp": 2.83,
      "avg_ft_cp": 5.17,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.67
    },
    "split_ctx": 5.5
  },
  "USL::Louisville City": {
    "time": "Louisville City",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 9.5,
        "cc": 2.0,
        "saldo_cantos": 7.5,
        "gp": 2.33,
        "gc": 1.5,
        "saldo_gols": 0.83
      },
      "casa": {
        "cp": 11.0,
        "cc": 1.0,
        "saldo_cantos": 10.0,
        "gp": 2.67,
        "gc": 1.67,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 8.0,
        "cc": 3.0,
        "saldo_cantos": 5.0,
        "gp": 2.0,
        "gc": 1.33,
        "saldo_gols": 0.67
      }
    },
    "ved": {
      "geral": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.246,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 57,
      "total_gols": 14
    },
    "dissociacao": {
      "indice": 7.44,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 1.65,
      "saldo_gols_norm": 0.83
    },
    "pressao": {
      "ratio_liga": 2.09,
      "perfil": "ALTO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 9.5,
        "avg_cc": 1.75,
        "delta_cp": 0.0,
        "delta_cc": -0.25,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 11.0,
        "avg_cc": 1.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 8.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 7.0,
        "cc_avg": 1.0,
        "saldo": 6.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 10.0,
        "cc_avg": 2.0,
        "saldo": 8.0
      }
    },
    "consistencia": {
      "indice": 0.8,
      "cp_std": 1.87,
      "label": "ALTA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.49,
      "avg_ht_cp": 4.67,
      "avg_ft_cp": 9.5,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.83,
      "taxa_ht_4": 0.83
    },
    "split_ctx": 3.0
  },
  "USL::Tampa Bay": {
    "time": "Tampa Bay",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 3,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 5.6,
        "cc": 2.2,
        "saldo_cantos": 3.4,
        "gp": 2.0,
        "gc": 0.6,
        "saldo_gols": 1.4
      },
      "casa": {
        "cp": 6.33,
        "cc": 2.33,
        "saldo_cantos": 4.0,
        "gp": 2.67,
        "gc": 1.0,
        "saldo_gols": 1.67
      },
      "fora": {
        "cp": 4.5,
        "cc": 2.0,
        "saldo_cantos": 2.5,
        "gp": 1.0,
        "gc": 0.0,
        "saldo_gols": 1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.8,
        "E": 0.0,
        "D": 0.2,
        "tv": 0.8
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.357,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 28,
      "total_gols": 10
    },
    "dissociacao": {
      "indice": 2.35,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.75,
      "saldo_gols_norm": 1.4
    },
    "pressao": {
      "ratio_liga": 1.23,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.25,
        "avg_cc": 2.5,
        "delta_cp": -0.35,
        "delta_cc": 0.3,
        "n": 4
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "empatou": {
        "avg_cp": 7.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 4.0,
        "cc_avg": 3.0,
        "saldo": 1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 2.67,
        "saldo": 3.0
      }
    },
    "consistencia": {
      "indice": 0.55,
      "cp_std": 2.51,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.5,
      "avg_ht_cp": 2.8,
      "avg_ft_cp": 5.6,
      "perfil": "EQUILIBRADO"
    },
    "over": {
      "taxa_ft_9": 0.2,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 1.83
  },
  "USL::Loudoun": {
    "time": "Loudoun",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 4,
      "fora": 1
    },
    "base": {
      "geral": {
        "cp": 3.4,
        "cc": 6.0,
        "saldo_cantos": -2.6,
        "gp": 1.6,
        "gc": 2.2,
        "saldo_gols": -0.6
      },
      "casa": {
        "cp": 3.5,
        "cc": 5.5,
        "saldo_cantos": -2.0,
        "gp": 1.75,
        "gc": 2.0,
        "saldo_gols": -0.25
      },
      "fora": {
        "cp": 3.0,
        "cc": 8.0,
        "saldo_cantos": -5.0,
        "gp": 1.0,
        "gc": 3.0,
        "saldo_gols": -2.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.4,
        "D": 0.6,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.5,
        "D": 0.5,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.471,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 17,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -2.27,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.57,
      "saldo_gols_norm": -0.6
    },
    "pressao": {
      "ratio_liga": 0.75,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 2.0,
        "avg_cc": 6.5,
        "delta_cp": -1.4,
        "delta_cc": 0.5,
        "n": 2
      },
      "empatou": {
        "avg_cp": 4.33,
        "delta_cp": 0.93,
        "n": 3
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.67,
        "cc_avg": 7.0,
        "saldo": -4.33
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 4.5,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.55,
      "cp_std": 1.52,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.71,
      "avg_ht_cp": 2.4,
      "avg_ft_cp": 3.4,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.6,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 0.5
  },
  "USL::Miami FC": {
    "time": "Miami FC",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 2,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 2.83,
        "cc": 6.83,
        "saldo_cantos": -4.0,
        "gp": 1.17,
        "gc": 1.17,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 1.5,
        "cc": 7.5,
        "saldo_cantos": -6.0,
        "gp": 1.0,
        "gc": 0.5,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 3.5,
        "cc": 6.5,
        "saldo_cantos": -3.0,
        "gp": 1.25,
        "gc": 1.5,
        "saldo_gols": -0.25
      }
    },
    "ved": {
      "geral": {
        "V": 0.167,
        "E": 0.167,
        "D": 0.667,
        "tv": 0.167
      },
      "casa": {
        "V": 0.0,
        "E": 0.0,
        "D": 1.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.412,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 17,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -4.41,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.88,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.62,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 2.0,
        "avg_cc": 7.0,
        "delta_cp": -0.83,
        "delta_cc": 0.17,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 0.0,
        "avg_cc": 12.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 4.33,
        "delta_cp": 1.5,
        "n": 3
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 0.0,
        "cc_avg": 12.0,
        "saldo": -12.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.33,
        "cc_avg": 5.0,
        "saldo": -0.67
      }
    },
    "consistencia": {
      "indice": 0.18,
      "cp_std": 2.32,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.41,
      "avg_ht_cp": 1.17,
      "avg_ft_cp": 2.83,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -2.0
  },
  "USL::Rhode Island": {
    "time": "Rhode Island",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 2,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 3.4,
        "cc": 4.2,
        "saldo_cantos": -0.8,
        "gp": 1.4,
        "gc": 1.6,
        "saldo_gols": -0.2
      },
      "casa": {
        "cp": 3.5,
        "cc": 1.0,
        "saldo_cantos": 2.5,
        "gp": 0.5,
        "gc": 0.5,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 3.33,
        "cc": 6.33,
        "saldo_cantos": -3.0,
        "gp": 2.0,
        "gc": 2.33,
        "saldo_gols": -0.33
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.412,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 17,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -0.68,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.18,
      "saldo_gols_norm": -0.2
    },
    "pressao": {
      "ratio_liga": 0.75,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 2.0,
        "avg_cc": 9.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 5.0,
        "delta_cp": 0.6,
        "delta_cc": 0.8,
        "n": 2
      },
      "empatou": {
        "avg_cp": 3.5,
        "delta_cp": 0.1,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 7.0,
        "saldo": -4.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 6.0,
        "cc_avg": 0.0,
        "saldo": 6.0
      }
    },
    "consistencia": {
      "indice": 0.51,
      "cp_std": 1.67,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.59,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 3.4,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.2
    },
    "split_ctx": 0.17
  },
  "USL::Pittsburgh": {
    "time": "Pittsburgh",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 1,
      "fora": 5
    },
    "base": {
      "geral": {
        "cp": 4.17,
        "cc": 3.33,
        "saldo_cantos": 0.84,
        "gp": 1.33,
        "gc": 1.83,
        "saldo_gols": -0.5
      },
      "casa": {
        "cp": 4.0,
        "cc": 4.0,
        "saldo_cantos": 0.0,
        "gp": 3.0,
        "gc": 2.0,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 4.2,
        "cc": 3.2,
        "saldo_cantos": 1.0,
        "gp": 1.0,
        "gc": 1.8,
        "saldo_gols": -0.8
      }
    },
    "ved": {
      "geral": {
        "V": 0.5,
        "E": 0.167,
        "D": 0.333,
        "tv": 0.5
      },
      "casa": {
        "V": 0.0,
        "E": 1.0,
        "D": 0.0,
        "tv": 0.0
      },
      "fora": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "label_geral": "EQUILIBRADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINANTE"
    },
    "conversao": {
      "taxa": 0.32,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 25,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": 1.43,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.19,
      "saldo_gols_norm": -0.5
    },
    "pressao": {
      "ratio_liga": 0.92,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.5,
        "avg_cc": 2.5,
        "delta_cp": 0.33,
        "delta_cc": -0.83,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 3.33,
        "avg_cc": 4.33,
        "delta_cp": -0.84,
        "delta_cc": 1.0,
        "n": 3
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 1,
        "cp_avg": 3.0,
        "cc_avg": 4.0,
        "saldo": -1.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 5.67,
        "cc_avg": 1.33,
        "saldo": 4.34
      }
    },
    "consistencia": {
      "indice": 0.53,
      "cp_std": 1.94,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.52,
      "avg_ht_cp": 2.17,
      "avg_ft_cp": 4.17,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.0,
      "taxa_ht_4": 0.33
    },
    "split_ctx": -0.2
  },
  "USL::Sporting Jax": {
    "time": "Sporting Jax",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 3,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 4.0,
        "cc": 4.0,
        "saldo_cantos": 0.0,
        "gp": 0.83,
        "gc": 2.17,
        "saldo_gols": -1.34
      },
      "casa": {
        "cp": 5.67,
        "cc": 4.33,
        "saldo_cantos": 1.34,
        "gp": 0.67,
        "gc": 2.67,
        "saldo_gols": -2.0
      },
      "fora": {
        "cp": 2.33,
        "cc": 3.67,
        "saldo_cantos": -1.34,
        "gp": 1.0,
        "gc": 1.67,
        "saldo_gols": -0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "casa": {
        "V": 0.667,
        "E": 0.0,
        "D": 0.333,
        "tv": 0.667
      },
      "fora": {
        "V": 0.0,
        "E": 0.667,
        "D": 0.333,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.208,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 24,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": 1.34,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.0,
      "saldo_gols_norm": -1.34
    },
    "pressao": {
      "ratio_liga": 0.88,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 0.0,
        "avg_cc": 0.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 0
      },
      "perdeu": {
        "avg_cp": 4.8,
        "avg_cc": 4.0,
        "delta_cp": 0.8,
        "delta_cc": 0.0,
        "n": 5
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 2.33,
        "cc_avg": 4.67,
        "saldo": -2.34
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 8.5,
        "cc_avg": 3.0,
        "saldo": 5.5
      }
    },
    "consistencia": {
      "indice": 0.04,
      "cp_std": 3.85,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.33,
      "avg_ht_cp": 1.33,
      "avg_ft_cp": 4.0,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.33,
      "taxa_ht_4": 0.17
    },
    "split_ctx": 3.34
  },
  "USL::Hartford Athletic": {
    "time": "Hartford Athletic",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 6,
      "casa": 2,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 4.33,
        "cc": 5.83,
        "saldo_cantos": -1.5,
        "gp": 1.17,
        "gc": 1.17,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 3.0,
        "cc": 3.5,
        "saldo_cantos": -0.5,
        "gp": 1.0,
        "gc": 3.0,
        "saldo_gols": -2.0
      },
      "fora": {
        "cp": 5.0,
        "cc": 7.0,
        "saldo_cantos": -2.0,
        "gp": 1.25,
        "gc": 0.25,
        "saldo_gols": 1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.333,
        "E": 0.167,
        "D": 0.5,
        "tv": 0.333
      },
      "casa": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "fora": {
        "V": 0.25,
        "E": 0.25,
        "D": 0.5,
        "tv": 0.25
      },
      "label_geral": "DOMINADO",
      "label_casa": "EQUILIBRADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.269,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": -1.65,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.33,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 0.95,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 3.0,
        "avg_cc": 10.0,
        "delta_cp": -1.33,
        "delta_cc": 4.17,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 1.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 6.33,
        "delta_cp": 2.0,
        "n": 3
      },
      "perfil": "PRAGMÁTICO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 4,
        "cp_avg": 5.0,
        "cc_avg": 3.75,
        "saldo": 1.25
      }
    },
    "consistencia": {
      "indice": 0.35,
      "cp_std": 2.8,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.46,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 4.33,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.67,
      "taxa_ht_4": 0.67
    },
    "split_ctx": -2.0
  },
  "USL::Indy Eleven": {
    "time": "Indy Eleven",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 3,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 3.6,
        "cc": 6.2,
        "saldo_cantos": -2.6,
        "gp": 1.6,
        "gc": 1.2,
        "saldo_gols": 0.4
      },
      "casa": {
        "cp": 3.67,
        "cc": 7.0,
        "saldo_cantos": -3.33,
        "gp": 2.0,
        "gc": 1.0,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 3.5,
        "cc": 5.0,
        "saldo_cantos": -1.5,
        "gp": 1.0,
        "gc": 1.5,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.0,
        "E": 0.4,
        "D": 0.6,
        "tv": 0.0
      },
      "casa": {
        "V": 0.0,
        "E": 0.333,
        "D": 0.667,
        "tv": 0.0
      },
      "fora": {
        "V": 0.0,
        "E": 0.5,
        "D": 0.5,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.444,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 18,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": -3.27,
      "perfil": "UNDERPERFORMER_CANTOS",
      "saldo_cantos_norm": -0.57,
      "saldo_gols_norm": 0.4
    },
    "pressao": {
      "ratio_liga": 0.79,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 4.5,
        "avg_cc": 7.5,
        "delta_cp": 0.9,
        "delta_cc": 1.3,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": -1.6,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 3.5,
        "cc_avg": 8.5,
        "saldo": -5.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 2.0,
        "cc_avg": 5.0,
        "saldo": -3.0
      }
    },
    "consistencia": {
      "indice": 0.58,
      "cp_std": 1.52,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.56,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 3.6,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.6
    },
    "split_ctx": 0.17
  },
  "USL::Detroit": {
    "time": "Detroit",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 3,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 6.0,
        "cc": 3.6,
        "saldo_cantos": 2.4,
        "gp": 1.2,
        "gc": 0.4,
        "saldo_gols": 0.8
      },
      "casa": {
        "cp": 5.67,
        "cc": 3.33,
        "saldo_cantos": 2.34,
        "gp": 1.67,
        "gc": 0.0,
        "saldo_gols": 1.67
      },
      "fora": {
        "cp": 6.5,
        "cc": 4.0,
        "saldo_cantos": 2.5,
        "gp": 0.5,
        "gc": 1.0,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "casa": {
        "V": 0.667,
        "E": 0.333,
        "D": 0.0,
        "tv": 0.667
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.2,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 30,
      "total_gols": 6
    },
    "dissociacao": {
      "indice": 1.85,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.53,
      "saldo_gols_norm": 0.8
    },
    "pressao": {
      "ratio_liga": 1.32,
      "perfil": "ALTO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.67,
        "avg_cc": 3.33,
        "delta_cp": -0.33,
        "delta_cc": -0.27,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 11.0,
        "avg_cc": 5.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "empatou": {
        "avg_cp": 2.0,
        "delta_cp": null,
        "n": 1
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 11.0,
        "cc_avg": 5.0,
        "saldo": 6.0
      }
    },
    "consistencia": {
      "indice": 0.39,
      "cp_std": 3.67,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.53,
      "avg_ht_cp": 3.2,
      "avg_ft_cp": 6.0,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.4
    },
    "split_ctx": -0.83
  },
  "USL::Charleston": {
    "time": "Charleston",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 2,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.6,
        "cc": 6.4,
        "saldo_cantos": 0.2,
        "gp": 1.4,
        "gc": 1.4,
        "saldo_gols": 0.0
      },
      "casa": {
        "cp": 8.0,
        "cc": 2.5,
        "saldo_cantos": 5.5,
        "gp": 2.5,
        "gc": 1.5,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 5.67,
        "cc": 9.0,
        "saldo_cantos": -3.33,
        "gp": 0.67,
        "gc": 1.33,
        "saldo_gols": -0.66
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.0,
        "D": 0.667,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.212,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 33,
      "total_gols": 7
    },
    "dissociacao": {
      "indice": 0.22,
      "perfil": "COERENTE",
      "saldo_cantos_norm": 0.04,
      "saldo_gols_norm": 0.0
    },
    "pressao": {
      "ratio_liga": 1.46,
      "perfil": "ALTO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.67,
        "avg_cc": 5.33,
        "delta_cp": -0.93,
        "delta_cc": -1.07,
        "n": 3
      },
      "perdeu": {
        "avg_cp": 8.0,
        "avg_cc": 8.0,
        "delta_cp": 1.4,
        "delta_cc": 1.6,
        "n": 2
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "REATIVO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 5.0,
        "cc_avg": 6.67,
        "saldo": -1.67
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 1,
        "cp_avg": 8.0,
        "cc_avg": 4.0,
        "saldo": 4.0
      }
    },
    "consistencia": {
      "indice": 0.48,
      "cp_std": 3.44,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.36,
      "avg_ht_cp": 2.4,
      "avg_ft_cp": 6.6,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.8,
      "taxa_ht_4": 0.8
    },
    "split_ctx": 2.33
  },
  "USL::New Mexico": {
    "time": "New Mexico",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 1,
      "fora": 4
    },
    "base": {
      "geral": {
        "cp": 5.2,
        "cc": 4.2,
        "saldo_cantos": 1.0,
        "gp": 1.0,
        "gc": 1.6,
        "saldo_gols": -0.6
      },
      "casa": {
        "cp": 7.0,
        "cc": 5.0,
        "saldo_cantos": 2.0,
        "gp": 3.0,
        "gc": 2.0,
        "saldo_gols": 1.0
      },
      "fora": {
        "cp": 4.75,
        "cc": 4.0,
        "saldo_cantos": 0.75,
        "gp": 0.5,
        "gc": 1.5,
        "saldo_gols": -1.0
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.0,
        "D": 0.4,
        "tv": 0.6
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.5,
        "E": 0.0,
        "D": 0.5,
        "tv": 0.5
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "EQUILIBRADO"
    },
    "conversao": {
      "taxa": 0.192,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 26,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": 1.7,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.22,
      "saldo_gols_norm": -0.6
    },
    "pressao": {
      "ratio_liga": 1.15,
      "perfil": "MÉDIO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 5.5,
        "avg_cc": 5.5,
        "delta_cp": 0.3,
        "delta_cc": 1.3,
        "n": 2
      },
      "perdeu": {
        "avg_cp": 5.0,
        "avg_cc": 3.33,
        "delta_cp": -0.2,
        "delta_cc": -0.87,
        "n": 3
      },
      "empatou": {
        "avg_cp": 0.0,
        "delta_cp": null,
        "n": 0
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 6.0,
        "cc_avg": 3.0,
        "saldo": 3.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 3,
        "cp_avg": 4.67,
        "cc_avg": 5.0,
        "saldo": -0.33
      }
    },
    "consistencia": {
      "indice": 0.42,
      "cp_std": 3.03,
      "label": "BAIXA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.38,
      "avg_ht_cp": 2.0,
      "avg_ft_cp": 5.2,
      "perfil": "FT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.6,
      "taxa_ht_4": 0.4
    },
    "split_ctx": 2.25
  },
  "USL::Colorado Springs": {
    "time": "Colorado Springs",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 2,
      "fora": 3
    },
    "base": {
      "geral": {
        "cp": 6.2,
        "cc": 4.4,
        "saldo_cantos": 1.8,
        "gp": 1.6,
        "gc": 1.8,
        "saldo_gols": -0.2
      },
      "casa": {
        "cp": 8.0,
        "cc": 4.0,
        "saldo_cantos": 4.0,
        "gp": 2.0,
        "gc": 1.5,
        "saldo_gols": 0.5
      },
      "fora": {
        "cp": 5.0,
        "cc": 4.67,
        "saldo_cantos": 0.33,
        "gp": 1.33,
        "gc": 2.0,
        "saldo_gols": -0.67
      }
    },
    "ved": {
      "geral": {
        "V": 0.6,
        "E": 0.2,
        "D": 0.2,
        "tv": 0.6
      },
      "casa": {
        "V": 1.0,
        "E": 0.0,
        "D": 0.0,
        "tv": 1.0
      },
      "fora": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "label_geral": "DOMINANTE",
      "label_casa": "DOMINANTE",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.258,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 31,
      "total_gols": 8
    },
    "dissociacao": {
      "indice": 2.18,
      "perfil": "OVERPERFORMER_CANTOS",
      "saldo_cantos_norm": 0.4,
      "saldo_gols_norm": -0.2
    },
    "pressao": {
      "ratio_liga": 1.37,
      "perfil": "ALTO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 7.0,
        "avg_cc": 4.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 6.0,
        "avg_cc": 5.5,
        "delta_cp": -0.2,
        "delta_cc": 1.1,
        "n": 2
      },
      "empatou": {
        "avg_cp": 6.0,
        "delta_cp": -0.2,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 3,
        "cp_avg": 7.0,
        "cc_avg": 5.0,
        "saldo": 2.0
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 5.0,
        "cc_avg": 3.5,
        "saldo": 1.5
      }
    },
    "consistencia": {
      "indice": 0.63,
      "cp_std": 2.28,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.65,
      "avg_ht_cp": 4.0,
      "avg_ft_cp": 6.2,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.8,
      "taxa_ht_4": 1.0
    },
    "split_ctx": 3.0
  },
  "USL::Birmingham": {
    "time": "Birmingham",
    "liga": "USL",
    "liga_nome": "USL Championship 2026",
    "n": {
      "geral": 5,
      "casa": 3,
      "fora": 2
    },
    "base": {
      "geral": {
        "cp": 3.6,
        "cc": 5.0,
        "saldo_cantos": -1.4,
        "gp": 1.0,
        "gc": 1.2,
        "saldo_gols": -0.2
      },
      "casa": {
        "cp": 3.33,
        "cc": 4.33,
        "saldo_cantos": -1.0,
        "gp": 0.33,
        "gc": 0.33,
        "saldo_gols": 0.0
      },
      "fora": {
        "cp": 4.0,
        "cc": 6.0,
        "saldo_cantos": -2.0,
        "gp": 2.0,
        "gc": 2.5,
        "saldo_gols": -0.5
      }
    },
    "ved": {
      "geral": {
        "V": 0.2,
        "E": 0.4,
        "D": 0.4,
        "tv": 0.2
      },
      "casa": {
        "V": 0.333,
        "E": 0.333,
        "D": 0.333,
        "tv": 0.333
      },
      "fora": {
        "V": 0.0,
        "E": 0.5,
        "D": 0.5,
        "tv": 0.0
      },
      "label_geral": "DOMINADO",
      "label_casa": "DOMINADO",
      "label_fora": "DOMINADO"
    },
    "conversao": {
      "taxa": 0.278,
      "perfil": "EFICIENTE",
      "total_cantos_pro": 18,
      "total_gols": 5
    },
    "dissociacao": {
      "indice": -1.34,
      "perfil": "COERENTE",
      "saldo_cantos_norm": -0.31,
      "saldo_gols_norm": -0.2
    },
    "pressao": {
      "ratio_liga": 0.79,
      "perfil": "BAIXO",
      "media_liga_ft": 4.54
    },
    "comportamento_resultado": {
      "ganhou": {
        "avg_cp": 1.0,
        "avg_cc": 6.0,
        "delta_cp": null,
        "delta_cc": null,
        "n": 1
      },
      "perdeu": {
        "avg_cp": 4.0,
        "avg_cc": 5.0,
        "delta_cp": 0.4,
        "delta_cc": 0.0,
        "n": 2
      },
      "empatou": {
        "avg_cp": 4.5,
        "delta_cp": 0.9,
        "n": 2
      },
      "perfil": "EQUILIBRADO",
      "dados_ok": true
    },
    "vs_adversario": {
      "forte": {
        "n": 2,
        "cp_avg": 2.5,
        "cc_avg": 4.0,
        "saldo": -1.5
      },
      "medio": {
        "n": 0,
        "cp_avg": 0.0,
        "cc_avg": 0.0,
        "saldo": 0.0
      },
      "fraco": {
        "n": 2,
        "cp_avg": 4.5,
        "cc_avg": 4.5,
        "saldo": 0.0
      }
    },
    "consistencia": {
      "indice": 0.58,
      "cp_std": 1.52,
      "label": "MÉDIA"
    },
    "dna_temporal": {
      "ratio_ht_ft": 0.67,
      "avg_ht_cp": 2.4,
      "avg_ft_cp": 3.6,
      "perfil": "HT_DOMINANT"
    },
    "over": {
      "taxa_ft_9": 0.4,
      "taxa_ht_4": 0.6
    },
    "split_ctx": -0.67
  }
};
