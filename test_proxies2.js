import https from 'https';

const testProxy = (proxyUrl, name) => {
  https.get(proxyUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`${name} (${res.statusCode}):`, data.substring(0, 200)));
  }).on('error', e => console.error(`${name} Error:`, e.message));
};

const targetUrl = 'https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:HPG~date:gte:2024-01-01&size=200';

testProxy(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`, 'CodeTabs2');
