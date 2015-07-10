/* global WechatJsTickets: true, WechatJs, Meteor, SimpleSchema */
WechatJsTickets = new Meteor.Collection('wechat_js_tickets');

WechatJsTickets.getCurrentTicket = function(){
  var now = new Date();

  var getTicket = function(){
    return WechatJsTickets.findOne( { expiredDate: { $gt: now } } );
  };

  var createNewTicket = function(){
    var ticketResult = WechatJs.refetchJsTicket();
    var ticket;
    if ( ticketResult ) {
      WechatJsTickets.insert( { ticket: ticketResult.ticket, expiredDuration: ticketResult.expires_in } );
      ticket = getTicket();
      return ticket;
    } else {
      return undefined;
    }
  };

  var ticket = getTicket() || createNewTicket() || {};
  return ticket.ticket;
};

Meteor.startup(function(){
  var schema = new SimpleSchema({
    ticket: {
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

  WechatJsTickets.attachSchema( schema );
  WechatJsTickets.attachBehaviour('timestampable');
});
