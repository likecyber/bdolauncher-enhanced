@echo off

set appname=BDOLauncher Enhanced
set title=%appname% Uninstaller
set path=%~dp0\nodejs\;%path%

title %title%

:check_requirements
echo Checking Requirements...
call node -v >nul 2>&1 && call npm -v >nul 2>&1
title %title%
if %errorlevel% neq 0 (
    echo Failed to find the required Node.js binaries.
    goto :error
)
echo Checked Requirements.
echo.
goto :update_dependencies

:update_dependencies
echo Updating Dependencies...
call npm install
title %title%
if %errorlevel% neq 0 goto :error
echo.
echo Updated Dependencies.
echo.
goto :execute_pre_uninstall

:execute_pre_uninstall
echo Executing Pre-Uninstall Script...
call node "%localappdata%\%appname%\app.js" uninstall
if %errorlevel% neq 0 goto :error
echo Executed Pre-Uninstall Script.
echo.
goto :uninstall_application

:uninstall_application
echo Uninstalling %appname% from LocalAppData...
rmdir /s /q "%localappdata%\%appname%\" >nul 2>&1
if %errorlevel% neq 0 goto :error
echo Uninstalled %appname% from LocalAppData.
echo.
goto :completed

:completed
echo The uninstallation was completed.
echo.
pause
exit

:error
echo.
echo Error occurred during uninstallation. The uninstallation was canceled.
echo.
pause
exit