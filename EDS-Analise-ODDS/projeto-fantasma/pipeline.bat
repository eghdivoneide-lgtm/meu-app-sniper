@echo off
echo =============================================
echo  ANALISTA FANTASMA v4 - PIPELINE COMPLETO
echo =============================================
echo.

set LIGA=%1
if "%LIGA%"=="" set LIGA=MLS

echo [1/2] Varredor de Rodada (%LIGA%)...
node varredor-rodada.js --liga %LIGA%
if %ERRORLEVEL% neq 0 (
    echo ERRO: Varredor falhou.
    pause
    exit /b 1
)

echo.
echo [2/2] Orquestrador EDS (%LIGA%)...
node orquestrador-eds.js --liga %LIGA%
if %ERRORLEVEL% neq 0 (
    echo ERRO: Orquestrador falhou.
    pause
    exit /b 1
)

echo.
echo =============================================
echo  PIPELINE COMPLETO! Abra o Auditor EDS.
echo =============================================
pause
