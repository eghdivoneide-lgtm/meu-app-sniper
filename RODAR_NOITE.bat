@echo off
chcp 65001 > nul
title YAAKEN — Coleta Noturna Automatica
color 0A

echo.
echo ████████████████████████████████████████████████████
echo   YAAKEN — COLETA NOTURNA AUTOMATICA v2
echo   Ligas: ARG + MLS + USL
echo   Iniciando: %date% %time%
echo ████████████████████████████████████████████████████
echo.

SET "SCRAPER=%~dp0especialista-cantos\scraper"
SET "FANTASMA=%~dp0EDS-Analise-ODDS\projeto-fantasma"
SET "YAAKEN_DATA=%~dp0yaaken-data"
SET "YAAKEN_EDS=%~dp0EDS-Analise-ODDS\EDS-ODDS-TEACHER\yaaken-data"
SET "LOG=%~dp0coleta_noturna_log.txt"

echo %date% %time% — Inicio da coleta > "%LOG%"

:: ============================================================
:: PASSO 0 — Instalar dependencias (playwright)
:: ============================================================
echo [0/5] Instalando dependencias do scraper...
cd /d "%SCRAPER%"
call npm install >> "%LOG%" 2>&1
call npx playwright install chromium >> "%LOG%" 2>&1
echo       Dependencias prontas!
echo.

:: ============================================================
:: PASSO 1 — ARGENTINA: Coletar jogos faltando
:: ============================================================
echo [1/5] ARGENTINA — Buscando jogos novos...
echo.
cd /d "%SCRAPER%"
node buscar_arg_faltando.js >> "%LOG%" 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo       AVISO: buscar_arg_faltando.js retornou erro — veja o log
)
echo       Aguardando 2 minutos (anti-ban)...
timeout /t 120 /nobreak > nul

:: ============================================================
:: PASSO 2 — MLS: Coletar rodadas novas automaticamente
:: ============================================================
echo [2/5] MLS — Detectando e coletando rodadas novas...
echo.
cd /d "%SCRAPER%"
node buscar_mls_faltando.js >> "%LOG%" 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo       AVISO: buscar_mls_faltando.js retornou erro — veja o log
)
echo       Aguardando 2 minutos (anti-ban)...
timeout /t 120 /nobreak > nul

:: ============================================================
:: PASSO 3 — USL: Coletar rodadas novas automaticamente
:: ============================================================
echo [3/5] USL — Detectando e coletando rodadas novas...
echo.
cd /d "%SCRAPER%"
node buscar_usl_faltando.js >> "%LOG%" 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo       AVISO: buscar_usl_faltando.js retornou erro — veja o log
)
echo       Aguardando 2 minutos (anti-ban)...
timeout /t 120 /nobreak > nul

:: ============================================================
:: PASSO 4 — Regenerar TODOS os escoteiros
:: ============================================================
echo [4/5] Regenerando escoteiros — BR + MLS + ARG + USL + BUN...
echo.
cd /d "%FANTASMA%"
node recalcular_escoteiro.js --todas >> "%LOG%" 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo       AVISO: recalcular_escoteiro retornou erro — veja o log
)

:: ============================================================
:: PASSO 5 — Sincronizar escoteiros para Yaaken-Scanner
:: ============================================================
echo [5/5] Sincronizando escoteiros para Yaaken-Scanner e EDS...
echo.

for %%L in (BR MLS ARG USL BUN) do (
  if exist "%YAAKEN_DATA%\escoteiro_%%L.js" (
    echo   OK — yaaken-data\escoteiro_%%L.js presente
  ) else (
    echo   ATENCAO — yaaken-data\escoteiro_%%L.js NAO ENCONTRADO!
  )
)

:: Copiar para Yaaken-Scanner se existir
SET "YAAKEN_REPO=%~dp0Yaaken-Scanner\yaaken-data"
if exist "%YAAKEN_REPO%" (
    echo.
    echo   Copiando para Yaaken-Scanner\yaaken-data...
    for %%L in (BR MLS ARG USL BUN) do (
        if exist "%YAAKEN_DATA%\escoteiro_%%L.js" (
            copy /Y "%YAAKEN_DATA%\escoteiro_%%L.js" "%YAAKEN_REPO%\escoteiro_%%L.js" >> "%LOG%" 2>&1
            echo     Copiado: escoteiro_%%L.js
        )
    )
)

:: ============================================================
:: RESUMO FINAL
:: ============================================================
echo.
echo ████████████████████████████████████████████████████
echo   COLETA CONCLUIDA: %date% %time%
echo ████████████████████████████████████████████████████
echo.
echo   Log completo: coleta_noturna_log.txt
echo.
echo   PROXIMOS PASSOS:
echo   1. Abra o Cowork amanha cedo
echo   2. Diga "coleta terminou"
echo   3. Verifico dados + integro + GitHub push
echo.
echo %date% %time% — Fim da coleta >> "%LOG%"
pause
