@echo off
echo ╔═════════════════════════════════════════════════════╗
echo ║   ANALISTA FANTASMA v5 — VARREDOR HISTÓRICO         ║
echo ║   Preenche TODO o histórico de todas as ligas       ║
echo ╚═════════════════════════════════════════════════════╝
echo.

:: Uso:
::   historico.bat ARG          → completa histórico da Argentina
::   historico.bat ARG 5        → últimas 5 rodadas da Argentina
::   historico.bat TODAS        → todas as ligas (demora bastante)
::   historico.bat              → mostra ajuda

set LIGA=%1
set RODADAS=%2

if "%LIGA%"=="" (
    echo Uso:
    echo   historico.bat ARG          - completa historico da Argentina ^(2026^)
    echo   historico.bat ARG 5        - ultimas 5 rodadas da Argentina
    echo   historico.bat MLS          - completa historico da MLS ^(2026^)
    echo   historico.bat USL          - completa historico da USL ^(2026^)
    echo   historico.bat BR           - completa historico do Brasileirao ^(2026^)
    echo   historico.bat TODAS        - TODAS as ligas completas
    echo.
    echo Protecao ativa: jogos de temporadas anteriores sao automaticamente ignorados.
    echo.
    pause
    exit /b 0
)

if /i "%LIGA%"=="TODAS" (
    echo Varrendo TODAS as ligas ^(pode demorar 2-4 horas^)...
    if "%RODADAS%"=="" (
        node varredor-historico.js --todas
    ) else (
        node varredor-historico.js --todas --rodadas %RODADAS%
    )
) else (
    echo Varrendo liga: %LIGA%
    if "%RODADAS%"=="" (
        node varredor-historico.js --liga %LIGA%
    ) else (
        node varredor-historico.js --liga %LIGA% --rodadas %RODADAS%
    )
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERRO: Varredor historico falhou.
    pause
    exit /b 1
)

echo.
echo ╔═════════════════════════════════════════════════════╗
echo ║   Histórico atualizado! Recarregue o Especialista  ║
echo ╚═════════════════════════════════════════════════════╝
pause
