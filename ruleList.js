const knownPattern = new Map();
// (host,[replace host, [presever params]])
knownPattern.set('https://x.com', ['https://fxtwitter.com', ['']]);
knownPattern.set('https://twitter.com', ['https://fxtwitter.com', ['']]);
knownPattern.set('https://fxtwitter.com', ['']);
knownPattern.set('https://vxtwitter.com', ['']);
knownPattern.set('https://www.youtube.com/', ['', ['v']]);

export { knownPattern }