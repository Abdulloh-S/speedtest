// Vercel Serverless Function — /api/upload
// Accepts any POST body, reads it fully, returns 200.
// Used only for measuring upload throughput — data is discarded.

export const config = {
  api: {
    bodyParser: false, // we stream manually
  },
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Drain the body (don't store it — just measure)
  let received = 0;
  req.on('data', chunk => { received += chunk.length; });
  req.on('end', () => {
    res.status(200).json({ ok: true, bytes: received });
  });
  req.on('error', () => {
    res.status(500).json({ error: 'Stream error' });
  });
}
