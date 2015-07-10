/* global WechatTokens: true, WechatJs, Meteor, SimpleSchema */
WechatTokens = new Meteor.Collection('wechat_tokens');

WechatTokens.getCurrentToken = function(){
  var now = new Date();

  var getToken = function(){
    return WechatTokens.findOne( { expiredDate: { $gt: now } } );
  };

  var createNewToken = function(){
    var tokenResult = WechatJs.refetchAccessToken();
    var token;
    if ( tokenResult ) {
      WechatTokens.insert( { accessToken: tokenResult.access_token, expiredDuration: tokenResult.expires_in } );
      token = getToken();
      return token;
    } else {
      return undefined;
    }
  };

  var token = getToken() || createNewToken() || {};
  return token.accessToken;
};

Meteor.startup(function(){
  var schema = new SimpleSchema({
    accessToken: {
      type: String
    },
    expiredDuration: {
      type: Number,
      defaultValue: 7200 // in second
    },
    expiredDate: {
      type: Date,
      optional: true,
      // default to 10 minuts from now
      autoValue: function(){
        if ( this.isInsert ) {
          var now = new Date();
          var expiredDuration = this.field('expiredDuration').value - 100;
          now.setSeconds( now.getSeconds() + expiredDuration );
          return now;
        } else {
          this.unset();
        }
      }
    }

  });

  WechatTokens.attachSchema( schema );
  WechatTokens.attachBehaviour('timestampable');
});
