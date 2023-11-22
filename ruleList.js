const knownPattern = new Map();
// (host,[replace host, [preserve params]])

knownPattern.set('x.com', ['fxtwitter.com', ['']]);
knownPattern.set('twitter.com', ['fxtwitter.com', ['']]);
knownPattern.set('fxtwitter.com', ['']);
knownPattern.set('vxtwitter.com', ['']);
knownPattern.set('www.youtube.com', ['', ['v']]);

export { knownPattern }
