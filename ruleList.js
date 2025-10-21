const knownPattern = new Map();
// (host,[replace host, [preserve params]])

knownPattern.set('x.com', ['fxtwitter.com', ['']]);
knownPattern.set('twitter.com', ['fxtwitter.com', ['']]);
knownPattern.set('fxtwitter.com', ['']);
knownPattern.set('vxtwitter.com', ['']);
knownPattern.set('www.youtube.com', ['', ['v','list','index']]);
knownPattern.set('item.taobao.com', ['', ['id','skuId']]);
knownPattern.set('detail.tmall.com', ['', ['id','skuId']]);

export { knownPattern }
