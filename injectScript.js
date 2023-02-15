(() => {
    // Import minified CryptoJS library. (Original: https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js)
    var CryptoJS=CryptoJS||function(t,e){var r={},i=r.lib={},n=function(){},o=i.Base={extend:function(t){n.prototype=this;var e=new n;return t&&e.mixIn(t),e.hasOwnProperty("init")||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},s=i.WordArray=o.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes;if(t=t.sigBytes,this.clamp(),i%4)for(var n=0;n<t;n++)e[i+n>>>2]|=(r[n>>>2]>>>24-n%4*8&255)<<24-(i+n)%4*8;else if(65535<r.length)for(n=0;n<t;n+=4)e[i+n>>>2]=r[n>>>2];else e.push.apply(e,r);return this.sigBytes+=t,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var r=[],i=0;i<e;i+=4)r.push(4294967296*t.random()|0);return new s.init(r,e)}}),c=r.enc={},a=c.Hex={stringify:function(t){var e=t.words;t=t.sigBytes;for(var r=[],i=0;i<t;i++){var n=e[i>>>2]>>>24-i%4*8&255;r.push((n>>>4).toString(16)),r.push((15&n).toString(16))}return r.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new s.init(r,e/2)}},f=c.Latin1={stringify:function(t){var e=t.words;t=t.sigBytes;for(var r=[],i=0;i<t;i++)r.push(String.fromCharCode(e[i>>>2]>>>24-i%4*8&255));return r.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new s.init(r,e)}},h=c.Utf8={stringify:function(t){try{return decodeURIComponent(escape(f.stringify(t)))}catch(t){throw Error("Malformed UTF-8 data")}},parse:function(t){return f.parse(unescape(encodeURIComponent(t)))}},u=i.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r=this._data,i=r.words,n=r.sigBytes,o=this.blockSize,c=n/(4*o);if(e=(c=e?t.ceil(c):t.max((0|c)-this._minBufferSize,0))*o,n=t.min(4*e,n),e){for(var a=0;a<e;a+=o)this._doProcessBlock(i,a);a=i.splice(0,e),r.sigBytes-=n}return new s.init(a,n)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0});i.Hasher=u.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){u.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new p.HMAC.init(t,r).finalize(e)}}});var p=r.algo={};return r}(Math);!function(){var t=CryptoJS,e=t.lib.WordArray;t.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp(),t=[];for(var n=0;n<r;n+=3)for(var o=(e[n>>>2]>>>24-n%4*8&255)<<16|(e[n+1>>>2]>>>24-(n+1)%4*8&255)<<8|e[n+2>>>2]>>>24-(n+2)%4*8&255,s=0;4>s&&n+.75*s<r;s++)t.push(i.charAt(o>>>6*(3-s)&63));if(e=i.charAt(64))for(;t.length%4;)t.push(e);return t.join("")},parse:function(t){var r=t.length,i=this._map;(n=i.charAt(64))&&(-1!=(n=t.indexOf(n))&&(r=n));for(var n=[],o=0,s=0;s<r;s++)if(s%4){var c=i.indexOf(t.charAt(s-1))<<s%4*2,a=i.indexOf(t.charAt(s))>>>6-s%4*2;n[o>>>2]|=(c|a)<<24-o%4*8,o++}return e.create(n,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(t){function e(t,e,r,i,n,o,s){return((t=t+(e&r|~e&i)+n+s)<<o|t>>>32-o)+e}function r(t,e,r,i,n,o,s){return((t=t+(e&i|r&~i)+n+s)<<o|t>>>32-o)+e}function i(t,e,r,i,n,o,s){return((t=t+(e^r^i)+n+s)<<o|t>>>32-o)+e}function n(t,e,r,i,n,o,s){return((t=t+(r^(e|~i))+n+s)<<o|t>>>32-o)+e}for(var o=CryptoJS,s=(a=o.lib).WordArray,c=a.Hasher,a=o.algo,f=[],h=0;64>h;h++)f[h]=4294967296*t.abs(t.sin(h+1))|0;a=a.MD5=c.extend({_doReset:function(){this._hash=new s.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,o){for(var s=0;16>s;s++){var c=t[a=o+s];t[a]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}s=this._hash.words;var a=t[o+0],h=(c=t[o+1],t[o+2]),u=t[o+3],p=t[o+4],d=t[o+5],l=t[o+6],y=t[o+7],_=t[o+8],v=t[o+9],g=t[o+10],B=t[o+11],x=t[o+12],S=t[o+13],k=t[o+14],m=t[o+15],z=e(z=s[0],D=s[1],w=s[2],C=s[3],a,7,f[0]),C=e(C,z,D,w,c,12,f[1]),w=e(w,C,z,D,h,17,f[2]),D=e(D,w,C,z,u,22,f[3]);z=e(z,D,w,C,p,7,f[4]),C=e(C,z,D,w,d,12,f[5]),w=e(w,C,z,D,l,17,f[6]),D=e(D,w,C,z,y,22,f[7]),z=e(z,D,w,C,_,7,f[8]),C=e(C,z,D,w,v,12,f[9]),w=e(w,C,z,D,g,17,f[10]),D=e(D,w,C,z,B,22,f[11]),z=e(z,D,w,C,x,7,f[12]),C=e(C,z,D,w,S,12,f[13]),w=e(w,C,z,D,k,17,f[14]),z=r(z,D=e(D,w,C,z,m,22,f[15]),w,C,c,5,f[16]),C=r(C,z,D,w,l,9,f[17]),w=r(w,C,z,D,B,14,f[18]),D=r(D,w,C,z,a,20,f[19]),z=r(z,D,w,C,d,5,f[20]),C=r(C,z,D,w,g,9,f[21]),w=r(w,C,z,D,m,14,f[22]),D=r(D,w,C,z,p,20,f[23]),z=r(z,D,w,C,v,5,f[24]),C=r(C,z,D,w,k,9,f[25]),w=r(w,C,z,D,u,14,f[26]),D=r(D,w,C,z,_,20,f[27]),z=r(z,D,w,C,S,5,f[28]),C=r(C,z,D,w,h,9,f[29]),w=r(w,C,z,D,y,14,f[30]),z=i(z,D=r(D,w,C,z,x,20,f[31]),w,C,d,4,f[32]),C=i(C,z,D,w,_,11,f[33]),w=i(w,C,z,D,B,16,f[34]),D=i(D,w,C,z,k,23,f[35]),z=i(z,D,w,C,c,4,f[36]),C=i(C,z,D,w,p,11,f[37]),w=i(w,C,z,D,y,16,f[38]),D=i(D,w,C,z,g,23,f[39]),z=i(z,D,w,C,S,4,f[40]),C=i(C,z,D,w,a,11,f[41]),w=i(w,C,z,D,u,16,f[42]),D=i(D,w,C,z,l,23,f[43]),z=i(z,D,w,C,v,4,f[44]),C=i(C,z,D,w,x,11,f[45]),w=i(w,C,z,D,m,16,f[46]),z=n(z,D=i(D,w,C,z,h,23,f[47]),w,C,a,6,f[48]),C=n(C,z,D,w,y,10,f[49]),w=n(w,C,z,D,k,15,f[50]),D=n(D,w,C,z,d,21,f[51]),z=n(z,D,w,C,x,6,f[52]),C=n(C,z,D,w,u,10,f[53]),w=n(w,C,z,D,g,15,f[54]),D=n(D,w,C,z,c,21,f[55]),z=n(z,D,w,C,_,6,f[56]),C=n(C,z,D,w,m,10,f[57]),w=n(w,C,z,D,l,15,f[58]),D=n(D,w,C,z,S,21,f[59]),z=n(z,D,w,C,p,6,f[60]),C=n(C,z,D,w,B,10,f[61]),w=n(w,C,z,D,h,15,f[62]),D=n(D,w,C,z,v,21,f[63]);s[0]=s[0]+z|0,s[1]=s[1]+D|0,s[2]=s[2]+w|0,s[3]=s[3]+C|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32;var o=t.floor(i/4294967296);for(r[15+(n+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),r[14+(n+64>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),e.sigBytes=4*(r.length+1),this._process(),r=(e=this._hash).words,i=0;4>i;i++)n=r[i],r[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8);return e},clone:function(){var t=c.clone.call(this);return t._hash=this._hash.clone(),t}}),o.MD5=c._createHelper(a),o.HmacMD5=c._createHmacHelper(a)}(Math),function(){var t,e=CryptoJS,r=(t=e.lib).Base,i=t.WordArray,n=(t=e.algo).EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:t.MD5,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=(c=this.cfg).hasher.create(),n=i.create(),o=n.words,s=c.keySize,c=c.iterations;o.length<s;){a&&r.update(a);var a=r.update(t).finalize(e);r.reset();for(var f=1;f<c;f++)a=r.finalize(a),r.reset();n.concat(a)}return n.sigBytes=4*s,n}});e.EvpKDF=function(t,e,r){return n.create(r).compute(t,e)}}(),CryptoJS.lib.Cipher||function(t){var e=(d=CryptoJS).lib,r=e.Base,i=e.WordArray,n=e.BufferedBlockAlgorithm,o=d.enc.Base64,s=d.algo.EvpKDF,c=e.Cipher=n.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){n.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(t){return{encrypt:function(e,r,i){return("string"==typeof r?l:p).encrypt(t,e,r,i)},decrypt:function(e,r,i){return("string"==typeof r?l:p).decrypt(t,e,r,i)}}}});e.StreamCipher=c.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var a=d.mode={},f=function(t,e,r){var i=this._iv;i?this._iv=undefined:i=this._prevBlock;for(var n=0;n<r;n++)t[e+n]^=i[n]},h=(e.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}})).extend();h.Encryptor=h.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;f.call(this,t,e,i),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),h.Decryptor=h.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);r.decryptBlock(t,e),f.call(this,t,e,i),this._prevBlock=n}}),a=a.CBC=h,h=(d.pad={}).Pkcs7={pad:function(t,e){for(var r,n=(r=(r=4*e)-t.sigBytes%r)<<24|r<<16|r<<8|r,o=[],s=0;s<r;s+=4)o.push(n);r=i.create(o,r),t.concat(r)},unpad:function(t){t.sigBytes-=255&t.words[t.sigBytes-1>>>2]}},e.BlockCipher=c.extend({cfg:c.cfg.extend({mode:a,padding:h}),reset:function(){c.reset.call(this);var t=(e=this.cfg).iv,e=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var r=e.createEncryptor;else r=e.createDecryptor,this._minBufferSize=1;this._mode=r.call(e,this,t&&t.words)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var e=this._process(!0)}else e=this._process(!0),t.unpad(e);return e},blockSize:4});var u=e.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}}),p=(a=(d.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext;return((t=t.salt)?i.create([1398893684,1701076831]).concat(t).concat(e):e).toString(o)},parse:function(t){var e=(t=o.parse(t)).words;if(1398893684==e[0]&&1701076831==e[1]){var r=i.create(e.slice(2,4));e.splice(0,4),t.sigBytes-=16}return u.create({ciphertext:t,salt:r})}},e.SerializableCipher=r.extend({cfg:r.extend({format:a}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=t.createEncryptor(r,i);return e=n.finalize(e),n=n.cfg,u.create({ciphertext:e,key:r,iv:n.iv,algorithm:t,mode:n.mode,padding:n.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),t.createDecryptor(r,i).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}})),d=(d.kdf={}).OpenSSL={execute:function(t,e,r,n){return n||(n=i.random(8)),t=s.create({keySize:e+r}).compute(t,n),r=i.create(t.words.slice(e),4*r),t.sigBytes=4*e,u.create({key:t,iv:r,salt:n})}},l=e.PasswordBasedCipher=p.extend({cfg:p.cfg.extend({kdf:d}),encrypt:function(t,e,r,i){return r=(i=this.cfg.extend(i)).kdf.execute(r,t.keySize,t.ivSize),i.iv=r.iv,(t=p.encrypt.call(this,t,e,r.key,i)).mixIn(r),t},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),r=i.kdf.execute(r,t.keySize,t.ivSize,e.salt),i.iv=r.iv,p.decrypt.call(this,t,e,r.key,i)}})}(),function(){for(var t=CryptoJS,e=t.lib.BlockCipher,r=t.algo,i=[],n=[],o=[],s=[],c=[],a=[],f=[],h=[],u=[],p=[],d=[],l=0;256>l;l++)d[l]=128>l?l<<1:l<<1^283;var y=0,_=0;for(l=0;256>l;l++){var v=(v=_^_<<1^_<<2^_<<3^_<<4)>>>8^255&v^99;i[y]=v,n[v]=y;var g=d[y],B=d[g],x=d[B],S=257*d[v]^16843008*v;o[y]=S<<24|S>>>8,s[y]=S<<16|S>>>16,c[y]=S<<8|S>>>24,a[y]=S,S=16843009*x^65537*B^257*g^16843008*y,f[v]=S<<24|S>>>8,h[v]=S<<16|S>>>16,u[v]=S<<8|S>>>24,p[v]=S,y?(y=g^d[d[d[x^g]]],_^=d[d[_]]):y=_=1}var k=[0,1,2,4,8,16,32,64,128,27,54];r=r.AES=e.extend({_doReset:function(){for(var t=(r=this._key).words,e=r.sigBytes/4,r=4*((this._nRounds=e+6)+1),n=this._keySchedule=[],o=0;o<r;o++)if(o<e)n[o]=t[o];else{var s=n[o-1];o%e?6<e&&4==o%e&&(s=i[s>>>24]<<24|i[s>>>16&255]<<16|i[s>>>8&255]<<8|i[255&s]):(s=i[(s=s<<8|s>>>24)>>>24]<<24|i[s>>>16&255]<<16|i[s>>>8&255]<<8|i[255&s],s^=k[o/e|0]<<24),n[o]=n[o-e]^s}for(t=this._invKeySchedule=[],e=0;e<r;e++)o=r-e,s=e%4?n[o]:n[o-4],t[e]=4>e||4>=o?s:f[i[s>>>24]]^h[i[s>>>16&255]]^u[i[s>>>8&255]]^p[i[255&s]]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,o,s,c,a,i)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,f,h,u,p,n),r=t[e+1],t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,n,o,s,c){for(var a=this._nRounds,f=t[e]^r[0],h=t[e+1]^r[1],u=t[e+2]^r[2],p=t[e+3]^r[3],d=4,l=1;l<a;l++){var y=i[f>>>24]^n[h>>>16&255]^o[u>>>8&255]^s[255&p]^r[d++],_=i[h>>>24]^n[u>>>16&255]^o[p>>>8&255]^s[255&f]^r[d++],v=i[u>>>24]^n[p>>>16&255]^o[f>>>8&255]^s[255&h]^r[d++];p=i[p>>>24]^n[f>>>16&255]^o[h>>>8&255]^s[255&u]^r[d++],f=y,h=_,u=v}y=(c[f>>>24]<<24|c[h>>>16&255]<<16|c[u>>>8&255]<<8|c[255&p])^r[d++],_=(c[h>>>24]<<24|c[u>>>16&255]<<16|c[p>>>8&255]<<8|c[255&f])^r[d++],v=(c[u>>>24]<<24|c[p>>>16&255]<<16|c[f>>>8&255]<<8|c[255&h])^r[d++],p=(c[p>>>24]<<24|c[f>>>16&255]<<16|c[h>>>8&255]<<8|c[255&u])^r[d++],t[e]=y,t[e+1]=_,t[e+2]=v,t[e+3]=p},keySize:8});t.AES=e._createHelper(r)}();

    // Override setSteam function, forcing it to launch as non-Steam login.
    if (window.setSteam !== undefined) {
        const setSteam = window.setSteam;
        window.setSteam = (e, t) => {
            e = false;
            setSteam(e, t);
        }
    }

    // Override setVersion function, forcing it to append "[Enhanced]" text to the version number.
    if (window.setVersion !== undefined) {
        const setVersion = window.setVersion;
        window.setVersion = (e) => {
            setVersion(e);
            $('#ver').append('&nbsp;&nbsp;[Enhanced]');
        }
    }

    // Store the encrypted password in local cookie if the user login with "Save login information" option checked.
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        if ($('#_isRemember').is(':checked')) {
            if (arguments[0] === 'POST' && arguments[1].startsWith('https://account.pearlabyss.com/')) {
                const request = this;
                request.send = function () {
                    if (arguments.length > 0) {
                        if (arguments[0].includes('_email=') && arguments[0].includes('_password=')) {
                            const params = arguments[0].split('&').reduce((object, query) => {
                                const chunks = query.split('=');
                                object[chunks[0]] = decodeURIComponent(chunks[1] || '');
                                return object;
                            }, {});
                            const email = params['_email'];
                            const password = params['_password'];
                            if (typeof email === 'string' && email.length > 0 && typeof password === 'string' && password.length > 0) {
                                request.addEventListener('load', () => {
                                    if (this.readyState === 4) {
                                        if (this.status === 200) {
                                            try {
                                                const response = JSON.parse(this.responseText);
                                                if (response['resultCode'] === 0) {
                                                    const emailCookieMatches = document.cookie.match(/(?:^|; *)ID_Cookie=([a-zA-Z0-9+/=]+)(?:;|$)/);
                                                    if (emailCookieMatches) {
                                                        const date = new Date();
                                                        date.setFullYear(date.getFullYear() + 1);
                                                        document.cookie = 'ENC_Cookie=' + encodeURI(CryptoJS.AES.encrypt(email + ':' + password, emailCookieMatches[1]).toString()) + '; domain=account.pearlabyss.com; expires=' + date.toUTCString() + '; path=/; secure';
                                                    }
                                                }
                                            } catch (e) {
                                                document.cookie = 'ENC_Cookie=; domain=account.pearlabyss.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                    return send.apply(this, arguments);
                };
            }
        }
        return open.apply(this, arguments);
    };

    // Auto Login with the last password if the user logged in with "Save login information" option checked in the previous login.
    if ($('#_isRemember').is(':checked')) {
        const defaultEmail = $('#_email').prop('defaultValue');
        if (typeof defaultEmail === 'string' && defaultEmail.length > 0) {
            const emailCookieMatches = document.cookie.match(/(?:^|; *)ID_Cookie=([a-zA-Z0-9+/=]+)(?:;|$)/);
            const passwordCookieMatches = document.cookie.match(/(?:^|; *)ENC_Cookie=([a-zA-Z0-9+/=]+)(?:;|$)/);
            if (emailCookieMatches && passwordCookieMatches) {
                try {
                    const decrypted = CryptoJS.AES.decrypt(passwordCookieMatches[1], emailCookieMatches[1]).toString(CryptoJS.enc.Utf8);
                    if (typeof decrypted === 'string' && decrypted.startsWith(defaultEmail + ':')) {
                        $('#_email').val(defaultEmail);
                        $('#_password').val(decrypted.slice((defaultEmail + ':').length));
                        $('#btnLogin').trigger('click');
                    } else {
                        document.cookie = 'ENC_Cookie=; domain=account.pearlabyss.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    }
                } catch (e) {
                    document.cookie = 'ENC_Cookie=; domain=account.pearlabyss.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                }
            }
        }
    }

    // Replace the logout button's link to the one that will forget all the login information.
    if ($('#btnLogout').length > 0) {
        $('#btnLogout').attr('href', _abyss.api.Http.Account + '/Member/Logout?_returnUrl=' + $('#btnLogout').attr('href'));
    }
})();