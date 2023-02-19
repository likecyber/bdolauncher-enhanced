@echo off

set appname=BDOLauncher Enhanced
set title=%appname%
set path=%~dp0\nodejs\;%path%

title %title%

cd /d %~dp0
node app.js