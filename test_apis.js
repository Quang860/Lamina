import https from 'https';

https.get('https://query1.finance.yahoo.com/v8/finance/chart/HPG.VN?range=6mo&interval=1d', (res) => {
  console.log('Yahoo Status Code:', res.statusCode);
  console.log('Yahoo Headers:', res.headers);
}).on('error', (e) => {
  console.error('Yahoo Error:', e);
});

https.get('https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/bars-long-term?ticker=HPG&type=stock&resolution=D&from=1704067200&to=1712534400', (res) => {
  console.log('TCBS Status Code:', res.statusCode);
  console.log('TCBS Headers:', res.headers);
}).on('error', (e) => {
  console.error('TCBS Error:', e);
});
