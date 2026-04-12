@echo off
echo ╔═════════════════════════════════════════════════════════╗
echo ║   MONSTER YAAKEN v1 — EDS Soluções Inteligentes        ║
echo ║   Coleta: Rodada Atual + Odds 1X2 + Confrontos Diretos ║
echo ╚═════════════════════════════════════════════════════════╝
echo.
echo DIFERENTE do atualizar.bat:
echo   atualizar.bat  → historico completo por time (Especialista em Cantos)
echo   yaaken.bat     → rodada atual com ODDS e H2H (Sistema YAAKEN)
echo.

set LIGA=%1

if "%LIGA%"=="" (
    echo Uso:
    echo   yaaken.bat BUN     - Bundesliga Alemanha
    echo   yaaken.bat MLS     - Major League Soccer
    echo   yaaken.bat BR      - Brasileirao Serie A
    echo   yaaken.bat ARG     - Liga Profesional Argentina
    echo   yaaken.bat USL     - USL Championship
    echo   yaaken.bat TODAS   - Todas as ligas
    echo.
    echo O que o Monster YAAKEN coleta:
    echo   1. Jogos da rodada atual da liga
    echo   2. Odds 1X2 de cada jogo ^(mandante / empate / visitante^)
    echo   3. H2H - historico de confrontos diretos entre os times
    echo.
    echo Output: yaaken_[LIGA]_[DATA].json
    echo.
    pause
    exit /b 0
)

if /i "%LIGA%"=="TODAS" (
    echo Coletando rodada de TODAS as ligas...
    node monster_yaaken.js --todas
) else (
    echo Coletando rodada: %LIGA%
    node monster_yaaken.js --liga %LIGA%
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ╔═════════════════════════════════════════╗
    echo ║   ERRO: Monster YAAKEN falhou.          ║
    echo ║   Verifique o log acima.                ║
    echo ╚═════════════════════════════════════════╝
    pause
    exit /b 1
)

echo.
echo ╔═════════════════════════════════════════════════════════╗
echo ║   Rodada coletada com sucesso!                          ║
echo ║   Arquivo salvo em: EDS-ODDS-TEACHER/yaaken/           ║
echo ║   Abra o YAAKEN Scanner para ver as indicacoes.        ║
echo ╚═════════════════════════════════════════════════════════╝
pause
