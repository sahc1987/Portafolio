// CloudFront Function (cloudfront-js-2.0), viewer request.
// - www.<domain>  → 301 to the apex
// - /             → 302 to /es/ or /en/ from the visitor's top Accept-Language
// - /en           → 301 to /en/ (directories always end in a slash)
// - /en/          → serves /en/index.html from S3

function pickLocale(acceptLanguage) {
  var first = String(acceptLanguage || '').split(',')[0] || '';
  return first.trim().toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
}

function redirect(statusCode, location) {
  return {
    statusCode: statusCode,
    statusDescription: statusCode === 301 ? 'Moved Permanently' : 'Found',
    headers: {
      location: { value: location },
      'cache-control': { value: statusCode === 301 ? 'max-age=3600' : 'no-store' },
    },
  };
}

function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';
  var uri = request.uri;

  if (host.indexOf('www.') === 0) {
    return redirect(301, 'https://' + host.slice(4) + uri);
  }

  if (uri === '/') {
    var acceptLanguage = request.headers['accept-language'];
    return redirect(302, '/' + pickLocale(acceptLanguage ? acceptLanguage.value : '') + '/');
  }

  if (uri.charAt(uri.length - 1) === '/') {
    request.uri = uri + 'index.html';
    return request;
  }

  // No file extension in the last segment: treat it as a directory.
  if (uri.lastIndexOf('.') < uri.lastIndexOf('/')) {
    return redirect(301, uri + '/');
  }

  return request;
}

// Exported for unit tests only; CloudFront ignores this.
if (typeof module !== 'undefined') {
  module.exports = { handler: handler, pickLocale: pickLocale };
}
