Meteor.methods({
  getJsConfigForUrl: function( url ){
    return WechatJs.generateJsConfig( url );
  }
});
