@echo off
title Deploying Sanjay S Portfolio to GitHub...
echo ========================================================
echo   SANJAY S // 3D PORTFOLIO DEPLOYMENT TO GITHUB
echo   Target: https://github.com/nscare62-maker/sanjay.git
echo ========================================================
echo.

set "GIT_EXE=C:\Users\nscar\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo [1/3] Checking Git Status...
"%GIT_EXE%" status

echo.
echo [2/3] Staging and committing any recent changes...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Deploy: Sanjay S 3D Spatial Z-Axis Portfolio with Cyber Breaker mini-game, dynamic theme rotation, and WhatsApp uplink"

echo.
echo [3/3] Pushing to GitHub (https://github.com/nscare62-maker/sanjay.git)...
echo If prompted, authenticate in the browser or paste your GitHub Personal Access Token.
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! PORTFOLIO DEPLOYED TO GITHUB!
    echo   Repository: https://github.com/nscare62-maker/sanjay
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   PUSH FAILED OR AUTHENTICATION REQUIRED.
    echo   If prompted for a password, use a GitHub Personal Access Token (PAT).
    echo ========================================================
)

echo.
pause
