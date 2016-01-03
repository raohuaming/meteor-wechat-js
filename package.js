Package.describe({
  name: 'huaming:wechat-js',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'This is a library to use wechat js api, including get accessToken, get jsTicket, using wx library',
  // URL to the Git repository containing the source code for this package.
  git: 'https://www.github.com/raohuaming/meteor-wechat-js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'http',
    'aldeed:collection2@2.3.3',
    'matb33:collection-hooks@0.7.13',
    'zimme:collection-timestampable@1.0.6',
    'stevezhu:lodash@3.8.0',
  ]);
  api.use([
    'templating'
  ], 'client');
  api.export('WechatJs', 'server');
  api.export('WechatTokens', 'server');
  api.export('WechatJsTickets', 'server');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('shared/collections/wechat_js_tickets.js', ['client', 'server']);
  api.addFiles('shared/collections/wechat_tokens.js', ['client', 'server']);
  api.addFiles('server/lib/wechat_js.js', 'server');
  api.addFiles('client/templates/app.html', 'client');

});

Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.14.0');
  api.use('velocity:html-reporter@0.6.2');
  api.use('huaming:wechat-js');

  // Generated with: github.com/philcockfield/meteor-package-paths
  api.addFiles('tests/server/collections/wechat_js_ticket_spec.js', 'server');
  api.addFiles('tests/server/collections/wechat_tokens_spec.js', 'server');
  api.addFiles('tests/server/lib/wechat_js_spec.js', 'server');

});
