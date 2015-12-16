/* global WechatJs: true, Meteor, lodash, process, WechatTokens, Npm, Mongo, WechatJsTickets */
WechatJs = (function buildAPI(){
  var APP_ID = process.env.WECHAT_APP_ID;
  var APP_SECRET = process.env.WECHAT_APP_SECRET;

  return {
    refetchAccessToken: function(){
      var urlTemplate = lodash.template(
        'https://api.weixin.qq.com/cgi-bin/token' +
        '?grant_type=client_credential&appid=<%= APP_ID %>&secret=<%= APP_SECRET %>'
      );
      var url = urlTemplate({
        APP_ID: APP_ID,
        APP_SECRET: APP_SECRET
      });
      var response = Meteor.http.get( url );
      if ( response.statusCode === 200 ) {
        return response.data; // { access_token, expires_in }
      } else {
        return undefined;
      }
    },
    refetchJsTicket: function(){
      var urlTemplate = lodash.template(
        'https://api.weixin.qq.com/cgi-bin/ticket/getticket' +
        '?access_token=<%= accessToken %>&type=jsapi'
      );
      var url = urlTemplate({
        accessToken: WechatTokens.getCurrentToken()
      });
      var response = Meteor.http.get( url );
      if ( response.statusCode === 200 ){
        return response.data; // { errorcode, errmsg, ticket, expires_in }
      } else {
        return undefined;
      }
    },
    generateTicketSignature: function( noncestr, ticket, timestamp, url ){
      var crypto = Npm.require('crypto');
      var tmpStrTemplate = lodash.template(
        'jsapi_ticket=<%= ticket %>' +
          '&noncestr=<%= noncestr %>' +
          '&timestamp=<%= timestamp %>' +
          '&url=<%= url %>'
      );
      var tmpStr = tmpStrTemplate({
        ticket: ticket,
        noncestr: noncestr,
        timestamp: timestamp,
        url: url
      });
      var shasum = crypto.createHash('sha1');
      shasum.update(tmpStr);
      var shaResult = shasum.digest('hex');
      return shaResult;
    },
    generateJsConfig: function( url ){
      var noncestr = ( new Mongo.ObjectID() )._str;
      var timestamp = Math.floor(Date.now()/1000);
      var ticket = WechatJsTickets.getCurrentTicket();
      var signature = this.generateTicketSignature( noncestr, ticket, timestamp, url );
      return {
        appId: APP_ID,
        timestamp: timestamp,
        nonceStr: noncestr,
        signature: signature,
        jsApiList: []
      };
    }
  };
})();
