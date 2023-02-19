@echo off

set appname=BDOLauncher Enhanced
set title=%appname% Installer
set path=%~dp0\nodejs\;%path%
set node_version=19.6.0

title %title%

set download_binaries=0
set download_nodejs=0
set download_7zip=0
goto :check_requirements

:check_requirements
echo Checking Requirements...
call node -v >nul 2>&1 && call npm -v >nul 2>&1
title %title%
if %errorlevel% neq 0 (
    if %download_binaries% neq 0 (
        echo Failed to find the required Node.js binaries.
    	goto :error
    )
    echo Node.js binaries are required.
    echo.
    set download_binaries=1
    goto :download_nodejs
)
echo Checked Requirements.
echo.
goto :update_dependencies

:download_nodejs
if exist "%~dp0\nodejs.7z" goto :download_7zip
echo Downloading Node.js...
bitsadmin /transfer "node-v%node_version%-win-x86.7z" /download /priority foreground "https://nodejs.org/dist/v%node_version%/node-v%node_version%-win-x86.7z" "%~dp0\nodejs.7z" >nul 2>&1
if %errorlevel% neq 0 (
	echo Failed to download the required Node.js file.
	goto :error
)
set download_nodejs=1
echo Downloaded Node.js.
echo.
goto :download_7zip

:download_7zip
if exist "%~dp0\7zr.exe" goto :extract_nodejs
echo Downloading 7-Zip...
bitsadmin /transfer "7zr.exe" /download /priority foreground "https://www.7-zip.org/a/7zr.exe" "%~dp0\7zr.exe" >nul 2>&1
if %errorlevel% neq 0 (
	echo Failed to download the required 7-Zip file.
	goto :error
)
set download_7zip=1
echo Downloaded 7-Zip.
echo.
goto :extract_nodejs

:extract_nodejs
echo Extracting Node.js Binaries...
if not exist "%~dp0\nodejs.7z" (
	echo Failed to find the required Node.js file.
	goto :error
)
if not exist "%~dp0\7zr.exe" (
	echo Failed to find the required 7-Zip file.
	goto :error
)
rmdir /s /q "%~dp0\nodejs\" >nul 2>&1
7zr x -y "%~dp0\nodejs.7z" -o"%~dp0\nodejs\" "node-v%node_version%-win-x86\*"
if %errorlevel% neq 0 goto :error
xcopy /e /q /y "%~dp0\nodejs\node-v%node_version%-win-x86\" "%~dp0\nodejs\"
if %errorlevel% neq 0 goto :error
rmdir /s /q "%~dp0\nodejs\node-v%node_version%-win-x86\" >nul 2>&1
if %errorlevel% neq 0 goto :error
if %download_nodejs% neq 0 del /f /q "%~dp0\nodejs.7z" >nul 2>&1
if %download_7zip% neq 0 del /f /q "%~dp0\7zr.exe" >nul 2>&1
echo.
echo Extracted Node.js Binaries.
echo.
goto :check_requirements

:update_dependencies
echo Updating Dependencies...
call npm install
title %title%
if %errorlevel% neq 0 goto :error
echo.
echo Updated Dependencies.
echo.
goto :execute_pre_install

:execute_pre_install
echo Executing Pre-Install Script...
call node "%~dp0\app.js" kill
if %errorlevel% neq 0 goto :error
echo Executed Pre-Install Script.
echo.
goto :install_application

:install_application
if "%~dp0" == "%localappdata%\%appname%\" goto :execute_post_install
echo Installing %appname% to LocalAppData...
rmdir /s /q "%localappdata%\%appname%\" >nul 2>&1
mkdir "%localappdata%\%appname%\"
if %errorlevel% neq 0 goto :error
xcopy /e /q /y "%~dp0" "%localappdata%\%appname%\" >nul
if %errorlevel% neq 0 goto :error
echo Installed %appname% to LocalAppData.
echo.
goto :execute_post_install

:execute_post_install
echo Executing Post-Install Script...
call node "%localappdata%\%appname%\app.js" install
if %errorlevel% neq 0 goto :error
call wscript "%localappdata%\%appname%\startup.vbs"
if %errorlevel% neq 0 goto :error
echo Executed Post-Install Script.
echo.
goto :completed

:completed
echo The installation was completed.
echo.
echo You may be prompted to confirm the installation of the certificate.
echo Please kindly click "Yes" on the confirmation prompt.
echo.
pause
exit

:error
if %download_binaries% neq 0 rmdir /s /q "%~dp0\nodejs\" >nul 2>&1
if %download_nodejs% neq 0 del /f /q "%~dp0\nodejs.7z" >nul 2>&1
if %download_7zip% neq 0 del /f /q "%~dp0\7zr.exe" >nul 2>&1
echo.
echo Error occurred during installation. The installation was canceled.
echo.
pause
exit