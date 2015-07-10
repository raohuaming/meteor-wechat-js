This is a library to use wechat js api, including get accessToken, get jsTicket, using wx library.

For more details, please refer to [wechat official doc](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html).

# Usage
First configure your WECHAT_APP_ID and WECHAT_APP_SECRET in process.env.

# WechatJs

## WechatJs.refetchAccessToken()
return a new access token from wechat api, ex. { access_token: ‘access_token’, expires_in:7200 }

## WechatJs.refetchJsTicket()
return a new jsticket from wechat api, ex. { errorcode: ‘’, errmsg: ‘’, ticket: ‘ticket str’, expires_in: 7200 }

## WechatJs.generateTicketSignature( nonsecure, ticket, timestamp, url )
return a sha1 string by encrypting the splice string of the given parameters, for more details please refer to the official doc about the algorithm for generating signature

## WechatJs.generateJsConfig( url )
return a configure object for given url, ex. { appId: ‘app id’, timestamp: 12345678, nonceStr: ‘abcdef’, signature: ‘signature’, jsApiList: [] }

# WechatTokens.getCurrentToken()
return a valid token. If the old one has expires, it will request a new one for you.

# WechatJsTickets.getCurrentTicket()
return a valid js ticket. If the old one has expires, it will request a new one for you.
