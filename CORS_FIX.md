# CORS Issue Fix

## Problem
The backend API is blocking requests from `http://localhost:3001` because it only allows `http://localhost:3000` in its CORS configuration.

## Solution

You need to update your **backend** CORS configuration to allow requests from the frontend origin.

### If using Express.js with cors middleware:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add frontend URL
  credentials: true,
}));
```

Or allow all localhost ports in development:

```javascript
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
```

### If using custom CORS headers:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### Quick Fix for Development:

For development only, you can allow all origins (NOT recommended for production):

```javascript
app.use(cors({
  origin: '*', // Allow all origins (development only!)
}));
```

## After Fixing

1. Restart your backend server
2. Refresh your frontend browser
3. The CORS errors should be resolved

## Note

The CORS configuration must be done on the **backend server**, not in the frontend code. The frontend cannot fix CORS issues - it's a server-side security feature.

