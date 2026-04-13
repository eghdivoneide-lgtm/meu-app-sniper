@echo off
cd /d "%~dp0"
echo ========================================================
echo   REPESCAGEM CISNE NEGRO - CHILE
echo   Forcar extracao da Primeira Division do Chile e
echo   enviar para os servidores automaticamente.
echo ========================================================
echo.

node varredor-por-time.js --liga CHI

echo.
echo ========================================================
echo   FINALIZADO! SINCRONIZANDO COM OS SERVIDORES...
echo ========================================================
:: Sincronizar Repo Principal
git add -A
git commit -m "feat: Correcao e injecao de dados do Chile (Repescagem)"
git push

:: Sincronizar Repo Netlify (Especialista em Cantos Oficial)
cd ../especialista-cantos
git add -A
git commit -m "feat: Dados do Chile Atualizados"
git push

echo ========================================================
echo   TODAS AS TAREFAS FORAM CONCLUIDAS E ESTAO NO AR!
echo ========================================================
pause
