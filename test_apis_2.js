import https from 'https';

const testUrl = (url, name) => {
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`${name} (${res.statusCode}):`, data.substring(0, 200)));
  }).on('error', e => console.error(`${name} Error:`, e.message));
};

// Fireant
testUrl('https://restv2.fireant.vn/symbols/HPG/historical-quotes?startDate=2024-01-01&endDate=2024-04-08', 'Fireant');

// SSI
testUrl('https://iboard.ssi.com.vn/dchart/api/history?symbol=HPG&resolution=D&from=1704067200&to=1712534400', 'SSI');

// TCBS (different endpoint)
testUrl('https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/bars-long-term?ticker=HPG&type=stock&resolution=D&from=1704067200&to=1712534400', 'TCBS2');

// DNSE
testUrl('https://services.entrade.com.vn/chart-api/v2/ohlcs/stock?resolution=D&symbol=HPG&from=1704067200&to=1712534400', 'DNSE');

// VNDirect direct (maybe it works with User-Agent?)
testUrl('https://finfo-api.vndirect.com.vn/v4/stock_prices?sort=date&q=code:HPG~date:gte:2024-01-01&size=200', 'VNDirect');
