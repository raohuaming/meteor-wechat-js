/* global WechatJsTickets, expect, spyOn, WechatJs */
describe('WechatJsTickets', function(){
  var ticketId, ticket;

  beforeEach(function(){
    ticket = { ticket: '123445555', expiredDuration: 500 };
  });

  afterEach(function(){
    WechatJsTickets.remove( ticketId );
  });

  describe('-- Schema', function(){
    it('should auto set expiredDate based on expiredDuration', function(){
      ticketId = WechatJsTickets.insert( ticket );
      expect( WechatJsTickets.findOne( ticketId ).expiredDate ).toBeDefined();
    });
  });

  describe('.getCurrentTicket', function(){
    var ticket, ticketResult;

    it('should return a ticket if there is already one valid ticket in db', function(){
      ticket = { ticket: '12345678' };
      spyOn( WechatJsTickets, 'findOne' ).and.returnValue( ticket );
      expect( WechatJsTickets.getCurrentTicket() ).toEqual( ticket.ticket );
    });

    it('should call WechatJs.refetchJsTicket if no valid ticket existing', function(){
      ticketResult = { ticket: '12345678', expires_in: 500 };
      spyOn( WechatJsTickets, 'findOne' ).and.returnValue( undefined );
      spyOn( WechatJs, 'refetchJsTicket' ).and.returnValue( ticketResult );
      spyOn( WechatJsTickets, 'insert' );
      WechatJsTickets.getCurrentTicket();
      expect( WechatJs.refetchJsTicket ).toHaveBeenCalled();
      expect( WechatJsTickets.insert ).toHaveBeenCalledWith({
        ticket: ticketResult.ticket,
        expiredDuration: ticketResult.expires_in
      });
    });

    it('should return undefined if no valid ticket and faild to fetch new ticket', function(){
      spyOn( WechatJsTickets, 'findOne' ).and.returnValue( undefined );
      spyOn( WechatJs, 'refetchJsTicket' ).and.returnValue( undefined );
      expect( WechatJsTickets.getCurrentTicket() ).toEqual( undefined );
    });

  });
});

