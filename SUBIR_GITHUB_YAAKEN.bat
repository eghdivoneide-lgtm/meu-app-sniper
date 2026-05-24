@echo off
chcp 65001 > nul
echo ================================================
echo   YAAKEN Scanner — Push para GitHub
echo ================================================
echo.

SET "APP_DIR=%~dp0"
SET "DEPLOY_DIR=%TEMP%\yaaken-deploy"
SET "GITHUB_REPO=https://github.com/eghdivoneide-lgtm/yaaken-scanner.git"

echo [1/6] Criando pasta temporaria de deploy...
IF EXIST "%DEPLOY_DIR%" rmdir /s /q "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%\yaaken-data"

echo [2/6] Copiando arquivos do YAAKEN Scanner...
copy "%APP_DIR%yaaken-scanner.html" "%DEPLOY_DIR%\" > nul
copy "%APP_DIR%server.js" "%DEPLOY_DIR%\" > nul
copy "%APP_DIR%package.json" "%DEPLOY_DIR%\" > nul
copy "%APP_DIR%railway.json" "%DEPLOY_DIR%\" > nul
copy "%APP_DIR%yaaken-data\escoteiro_BR.js" "%DEPLOY_DIR%\yaaken-data\" > nul
copy "%APP_DIR%yaaken-data\escoteiro_MLS.js" "%DEPLOY_DIR%\yaaken-data\" > nul
copy "%APP_DIR%yaaken-data\escoteiro_BUN.js" "%DEPLOY_DIR%\yaaken-data\" > nul
copy "%APP_DIR%yaaken-data\escoteiro_USL.js" "%DEPLOY_DIR%\yaaken-data\" > nul
copy "%APP_DIR%yaaken-data\escoteiro_ARG.js" "%DEPLOY_DIR%\yaaken-data\" > nul

echo [3/6] Inicializando repositorio Git...
cd /d "%DEPLOY_DIR%"
git init > nul 2>&1
git config user.email "eghdivoneide@gmail.com"
git config user.name "Egnaldo"

echo [4/6] Configurando repositorio remoto...
git remote add origin %GITHUB_REPO% > nul 2>&1

echo [5/6] Criando commit...
git add -A > nul
git commit -m "YAAKEN Scanner v1.0 - Deploy inicial com histórico completo e SmartCoach integrado" > nul

echo [6/6] Enviando para GitHub...
echo.
echo *** Uma janela do navegador vai abrir para voce fazer login no GitHub ***
echo *** Use sua conta Google para autenticar ***
echo.
git push -u origin main

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCESSO! Repositorio enviado para GitHub!
    echo   https://github.com/eghdivoneide-lgtm/yaaken-scanner
    echo ================================================
) ELSE (
    echo.
    echo Tentando com branch 'master'...
    git push -u origin master
    IF %ERRORLEVEL% EQU 0 (
        echo.
        echo ================================================
        echo   SUCESSO! Repositorio enviado para GitHub!
        echo   https://github.com/eghdivoneide-lgtm/yaaken-scanner
        echo ================================================
    ) ELSE (
        echo.
        echo ERRO no push. Verifique se o repositorio existe no GitHub:
        echo https://github.com/eghdivoneide-lgtm/yaaken-scanner
        echo.
        echo Se o repositorio nao existir, crie em: https://github.com/new
        echo Nome: yaaken-scanner
    )
)

echo.
pause
