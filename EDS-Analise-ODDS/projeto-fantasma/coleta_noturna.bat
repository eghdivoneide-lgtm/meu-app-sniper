@echo off
echo ========================================================
echo   COLETA MASSIVA (5 LIGAS) - ROBO ANTI-BAN V5
echo   As ligas varridas serao: Japao, Australia, Chile, Eq, Arg B
echo ========================================================
echo.

echo [1/5] Iniciando J1 League (Japao)...
node varredor-por-time.js --liga J1

echo.
echo [PAUSA ANTI-BAN] - Descansando por 3 minutos...
timeout /t 180 /nobreak

echo.
echo [2/5] Iniciando A-League (Australia)...
node varredor-por-time.js --liga ALM

echo.
echo [PAUSA ANTI-BAN] - Descansando por 3 minutos...
timeout /t 180 /nobreak

echo.
echo [3/5] Iniciando Primeira Division do Chile (CHI)...
node varredor-por-time.js --liga CHI

echo.
echo [PAUSA ANTI-BAN] - Descansando por 3 minutos...
timeout /t 180 /nobreak

echo.
echo [4/5] Iniciando LigaPro Serie A do Equador (ECU)...
node varredor-por-time.js --liga ECU

echo.
echo [PAUSA ANTI-BAN] - Descansando por 3 minutos...
timeout /t 180 /nobreak

echo.
echo [5/5] Iniciando Primera B Nacional da Argentina (ARG_B)...
node varredor-por-time.js --liga ARG_B

echo.
echo ========================================================
echo   FINALIZADO! SINCRONIZANDO COM OS SERVIDORES GITHUB...
echo ========================================================
:: Sincronizar Repo Principal
git add -A
git commit -m "feat: Varredura de dados automatica 5 Ligas (Robo Ocultador)"
git push

:: Sincronizar Repo Netlify (Especialista em Cantos Oficial)
cd ../especialista-cantos
git add -A
git commit -m "feat: Refresh noturno de Base de Dados 5 Ligas"
git push

echo ========================================================
echo   A COLHEITA FOI 100%% CONCLUIDA E ENVIADA AO AR!
echo ========================================================
pause
