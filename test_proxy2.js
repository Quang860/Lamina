import https from 'https';

const url = 'https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:HPG~date:gte:2024-01-01&size=200';
const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

https.get(proxyUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('CorsProxy:', data.substring(0, 200)));
});
