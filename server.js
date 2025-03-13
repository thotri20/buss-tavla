import { createServer } from "http";
import { parse } from "url";
import next from "next";
import axios from "axios";

const FLUKTRUTER_URL = "https://fluktruter.2inf.imkatta.no/";
const FTP_URL = "http://ftp.imkatta.no/";
const TIMEOUT = 5000;

// Rate limiting setup
const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

const requestCounts = new Map();

// Validate request
const validateRequest = (pathname) => {
  return pathname === '/api/fluktruter' || pathname === '/api/ftp';
};

// Error handler
const handleError = (error, res) => {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  const statusCode = error.response?.status || 500;
  const errorMessage = error.response?.data?.message || error.message;

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: errorMessage,
    status: statusCode,
    timestamp: new Date().toISOString()
  }));
};

// Rate limit middleware
const checkRateLimit = (req, res) => {
  const ip = req.socket.remoteAddress;
  const current = requestCounts.get(ip) || 0;
  
  if (current >= limiter.max) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too many requests' }));
    return false;
  }
  
  requestCounts.set(ip, current + 1);
  setTimeout(() => requestCounts.set(ip, (requestCounts.get(ip) || 1) - 1), limiter.windowMs);
  
  return true;
};

const app = next({ dev: false });
const handle = app.getRequestHandler();

const api = axios.create({
  timeout: TIMEOUT,
  validateStatus: status => status >= 200 && status < 500
});

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Check rate limit
      if (!checkRateLimit(req, res)) return;

      const parsedUrl = parse(req.url, true);

      // Validate request
      if (!validateRequest(parsedUrl.pathname)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
        return;
      }

      if (parsedUrl.pathname === '/api/fluktruter' || parsedUrl.pathname === '/api/ftp') {
        const url = parsedUrl.pathname === '/api/fluktruter' ? FLUKTRUTER_URL : FTP_URL;
        try {
          const response = await api.get(url);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
        } catch (error) {
          handleError(error, res);
        }
        return;
      }

      handle(req, res, parsedUrl);
    } catch (error) {
      handleError(error, res);
    }
  }).listen(3000, () => {
    console.log("Next.js app running on port 3000");
  });
});