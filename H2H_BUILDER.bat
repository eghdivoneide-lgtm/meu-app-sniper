@echo off
title H2H Memoria Builder v2.0 — EDS Solucoes Inteligentes
color 0B
echo.
echo ===============================================================
echo   H2H MEMORIA BUILDER v2.0 — EDS Solucoes Inteligentes
echo   Constroi memoria completa de confrontos diretos por liga
echo   RODAR: 1x por temporada (inicio do campeonato)
echo   NOVO: Resume automatico, 2x mais rapido, 10 ligas
echo ===============================================================
echo.
echo Escolha a liga:
echo   [1]  Brasileirao (BR)       — 20 times, 190 pares  (~15-20min)
echo   [2]  MLS (EUA)              — ~30 times, ~435 pares (~35-45min)
echo   [3]  Argentina (ARG)        — 26 times, 325 pares  (~25-35min)
echo   [4]  Argentina B (ARG_B)    — 36 times, 630 pares  (~50-60min)
echo   [5]  Bundesliga (BUN)       — 18 times, 153 pares  (~12-15min)
echo   [6]  USL Championship       — ~25 times, ~300 pares (~25-30min)
echo   [7]  Chile (CL)             — ~16 times, ~120 pares (~10-12min)
echo   [8]  Equador (ECU)          — ~16 times, ~120 pares (~10-12min)
echo   [9]  A-League (ALM)         — ~12 times, ~66 pares  (~6-8min)
echo   [10] J1 League (J1)         — ~19 times, ~171 pares (~14-18min)
echo   [11] TODAS as ligas         — (estimado: 3-4h total)
echo.
set /p escolha="Opcao (1-11): "

cd /d "%~dp0EDS-Analise-ODDS\Agentes da S.H.I.E.L.D"

if "%escolha%"=="1" (
    echo.
    echo Iniciando coleta H2H — Brasileirao...
    node h2h_memoria_builder.js --liga BR
) else if "%escolha%"=="2" (
    echo.
    echo Iniciando coleta H2H — MLS...
    node h2h_memoria_builder.js --liga MLS
) else if "%escolha%"=="3" (
    echo.
    echo Iniciando coleta H2H — Argentina...
    node h2h_memoria_builder.js --liga ARG
) else if "%escolha%"=="4" (
    echo.
    echo Iniciando coleta H2H — Argentina B...
    node h2h_memoria_builder.js --liga ARG_B
) else if "%escolha%"=="5" (
    echo.
    echo Iniciando coleta H2H — Bundesliga...
    node h2h_memoria_builder.js --liga BUN
) else if "%escolha%"=="6" (
    echo.
    echo Iniciando coleta H2H — USL Championship...
    node h2h_memoria_builder.js --liga USL
) else if "%escolha%"=="7" (
    echo.
    echo Iniciando coleta H2H — Chile...
    node h2h_memoria_builder.js --liga CL
) else if "%escolha%"=="8" (
    echo.
    echo Iniciando coleta H2H — Equador...
    node h2h_memoria_builder.js --liga ECU
) else if "%escolha%"=="9" (
    echo.
    echo Iniciando coleta H2H — A-League...
    node h2h_memoria_builder.js --liga ALM
) else if "%escolha%"=="10" (
    echo.
    echo Iniciando coleta H2H — J1 League...
    node h2h_memoria_builder.js --liga J1
) else if "%escolha%"=="11" (
    echo.
    echo Iniciando coleta H2H — TODAS as ligas (10 ligas)...
    node h2h_memoria_builder.js --todas
) else (
    echo Opcao invalida. Tente novamente.
)

echo.
echo ===============================================================
echo   Coleta concluida! Arquivos em: Yaaken-Scanner\yaaken-data\
echo   Carregue os arquivos h2h_memoria_*.js no Yaaken Scanner.
echo ===============================================================
echo.
pause
