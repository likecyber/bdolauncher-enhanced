
# BDOLauncher Enhanced

The first project that aims to enhance the Black Desert Online (BDO) launcher's experience!  

 1. Enable the ability to automatically login upon open the launcher.
 2. Enable the ability to login with Pearl Abyss ID while using Steam version client.

## How does it work?

This project works by running the HTTP(S) Proxy server locally.  
The proxy server will automatically intercept the launcher's HTTP(S) communication.  
It will modify the request and response contents to enable some features stated above.  
(It will only apply proxy to the launcher's related domains by default.)

But in order to allow the launcher to accept the modification.  
The user will need to install the unique generated certificate.

This should work regardless of any region of the launcher.

## How can I use it?

This project comes with a few convenience tools for non-programmer users.  
It doesn't even need you to have Node.js install.

Just download this repository and extract the zip file,  
Then open **"Install.cmd"** and let it do the rest.

It will also automatically run on the startup, so you don't need to do anything.

 - **Install.cmd** will automatically install the project to your computer.
 - **Uninstall.cmd** will automatically uninstall the project from your computer.
 - **Run.cmd** will run the project without install it to your computer.
 - **Kill.cmd** will kill process of the project that is running in the background.

You can also modify the "injectScript.js" and "autoproxy.pac" files.  
But make sure to run "Install.cmd" again to apply the changes you make.

Please leave "{PROXY}" as the proxy address in "autoproxy.pac" file.

## How to login with Pearl Abyss ID on Steam version?

Just install the project and launch the game normally through Steam.

If you have the PIN setup on your account, please reset it through Pearl Abyss website first.  
Because launching through Steam will automatically use the PIN setup by itself only.

You can also enable Steam integrated features on Pearl Abyss version client.  
Simply create "steam_appid.txt" file inside the client folder  
and write "582660" to the file (without the quotes) and save it.  
You will need to run the game with "BlackDesertLauncher.exe --steam"  
to launch it with Steam integrated features. (You may make a shortcut for it.)

## But... Why?

The original launcher can be frustrated, at least for me. So I try to improve it by a bit. :)

## Is there any risk using this?

This doesn't modify the game files by anyway. The risk is pretty minimal.  
However, I can't guarantee or anything. Please use it at your own risk.

**I'm not responsible for anything that may happen to your account.**
