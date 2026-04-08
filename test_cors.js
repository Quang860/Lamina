import https from 'https';

https.get('https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:HPG~date:gte:2024-01-01&size=200', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
