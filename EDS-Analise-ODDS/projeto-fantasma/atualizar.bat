@echo off
echo ╔═════════════════════════════════════════════════════╗
echo ║   ANALISTA FANTASMA v5 — VARREDOR POR TIME          ║
echo ║   Coleta histórico completo via tabela do Flashscore║
echo ╚═════════════════════════════════════════════════════╝
echo.

:: Uso:
::   atualizar.bat ARG       → completa histórico da Argentina
::   atualizar.bat MLS       → completa histórico da MLS
::   atualizar.bat USL       → completa histórico da USL
::   atualizar.bat BR        → completa histórico do Brasileirão
::   atualizar.bat BUN       → completa histórico da Bundesliga (Alemanha)
::   atualizar.bat TODAS     → todas as ligas
::   atualizar.bat J1        → completa histórico da J1 League (Japão)
::   atualizar.bat ALM       → completa histórico da A-League (Austrália)
::   atualizar.bat CHI       → completa histórico da Primeira Divisão (Chile)
::   atualizar.bat ECU       → completa histórico da LigaPro (Equador)
::   atualizar.bat ARG_B     → completa histórico da Primeira B (Argentina)

set LIGA=%1

if "%LIGA%"=="" (
    echo Uso:
    echo   atualizar.bat ARG      - Argentina ^(busca todos os 30 times^)
    echo   atualizar.bat MLS      - MLS ^(busca todos os 30 times^)
    echo   atualizar.bat USL      - USL Championship ^(25 times^)
    echo   atualizar.bat BR       - Brasileirao Serie A ^(20 times^)
    echo   atualizar.bat BUN      - Bundesliga Alemanha ^(18 times^)
    echo   atualizar.bat J1       - J1 League Japao ^(20 times^)
    echo   atualizar.bat ALM      - A-League Australia ^(12 times^)
    echo   atualizar.bat CHI      - Primera Division Chile ^(16 times^)
    echo   atualizar.bat ECU      - LigaPro Equador ^(16 times^)
    echo   atualizar.bat ARG_B    - Primera B Nacional Argentina ^(38 times^)
    echo   atualizar.bat TODAS    - Todas as ligas
    echo.
    echo Como funciona:
    echo   1. Abre a tabela de classificacao da liga no Flashscore
    echo   2. Detecta automaticamente todos os times
    echo   3. Visita o historico de cada time
    echo   4. Coleta todos os jogos de 2026 sem duplicatas
    echo   5. Salva diretamente no Especialista e no TEACHER
    echo.
    pause
    exit /b 0
)

if /i "%LIGA%"=="TODAS" (
    echo Varrendo TODAS as ligas...
    echo ^(Estimativa: 3 a 6 horas dependendo da velocidade da internet^)
    echo.
    node varredor-por-time.js --todas
) else (
    echo Varrendo liga: %LIGA%
    node varredor-por-time.js --liga %LIGA%
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ╔═════════════════════════════════════════╗
    echo ║   ERRO: Varredor falhou.                ║
    echo ╚═════════════════════════════════════════╝
    pause
    exit /b 1
)

echo.
echo ╔═════════════════════════════════════════════════════╗
echo ║   Histórico atualizado com sucesso!                 ║
echo ║   Recarregue o Especialista no navegador.           ║
echo ╚═════════════════════════════════════════════════════╝
pause
