/* global WechatTokens, expect, spyOn, WechatJs */
describe('WechatTokens', function(){
  var tokenId, token;

  beforeEach(function(){
    token = { accessToken: '123445555', expiredDuration: 500 };
  });

  afterEach(function(){
    WechatTokens.remove( tokenId );
  });

  describe('-- Schema', function(){
    it('should auto set expiredDate based on expiredDuration', function(){
      tokenId = WechatTokens.insert( token );
      expect( WechatTokens.findOne( tokenId ).expiredDate ).toBeDefined();
    });
  });

  describe('.getCurrentToken', function(){
    var token, tokenResult;

    it('should return a token if there is already one valid token in db', function(){
      token = { accessToken: '12345678' };
      spyOn( WechatTokens, 'findOne' ).and.returnValue( token );
      expect( WechatTokens.getCurrentToken() ).toEqual( token.accessToken );
    });

    it('should call WechatJs.refetchAccessToken if no valid token existing', function(){
      tokenResult = { access_token: '12345678', expires_in: 500 };
      spyOn( WechatTokens, 'findOne' ).and.returnValue( undefined );
      spyOn( WechatJs, 'refetchAccessToken' ).and.returnValue( tokenResult );
      spyOn( WechatTokens, 'insert' );
      WechatTokens.getCurrentToken();
      expect( WechatJs.refetchAccessToken ).toHaveBeenCalled();
      expect( WechatTokens.insert ).toHaveBeenCalledWith({
        accessToken: tokenResult.access_token,
        expiredDuration: tokenResult.expires_in
      });
    });

    it('should return undefined if no valid token and faild to fetch new token', function(){
      spyOn( WechatTokens, 'findOne' ).and.returnValue( undefined );
      spyOn( WechatJs, 'refetchAccessToken' ).and.returnValue( undefined );
      expect( WechatTokens.getCurrentToken() ).toEqual( undefined );
    });

  });
});
