/* global WechatJs, expect, spyOn */
describe('WechatJs', function(){

  xdescribe('refetchAccessToken', function(){
    it('should return a new accessToken', function(){
      var tokenResult = WechatJs.refetchAccessToken();
      expect( tokenResult.access_token ).toBeDefined();
      expect( tokenResult.expires_in ).toBeDefined();
    });
  });

  xdescribe('refetchJsTicket', function(){
    it('should return a new js ticket', function(){
      var ticketResult = WechatJs.refetchJsTicket();
      expect( ticketResult.ticket ).toBeDefined();
      expect( ticketResult.expires_in ).toBeDefined();
    });
  });

  describe('generateTicketSignature', function(){
    it('should generate a signature for js ticket', function(){
      var noncestr = 'Wm3WZYTPz0wzccnW';
      var ticket = 'sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg';
      var timestamp = '1414587457';
      var url = 'http://mp.weixin.qq.com?params=value';
      var result = '0f9de62fce790f9a083d5c99e95740ceb90c27ed';
      expect( WechatJs.generateTicketSignature( noncestr, ticket, timestamp, url ) ).toEqual( result );
    });
  });

  describe('generateJsConfig', function(){
    it('should return a js config for given url', function(){
      var signature = '12345678';
      spyOn( WechatJs, 'generateTicketSignature' ).and.returnValue( signature );
      var url = 'http://jizhi.co';
      var config = WechatJs.generateJsConfig( url );
      expect( config.appId ).toBeDefined();
      expect( config.timestamp ).toBeDefined();
      expect( config.nonceStr ).toBeDefined();
      expect( config.signature ).toEqual( signature );
      expect( config.jsApiList ).toBeDefined();
    });
  });
});
