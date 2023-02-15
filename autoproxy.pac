function FindProxyForURL (url, host) {
    if (shExpMatch(host, "launcher.*.playblackdesert.com") || shExpMatch(host, "account.pearlabyss.com")) {
        return "PROXY {PROXY}";
    }
    return "DIRECT";
}