export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const redisUrl = process.env.VISITOR_COUNTER_REDIS_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.VISITOR_COUNTER_REDIS_TOKEN || process.env.KV_REST_API_TOKEN;
    const counterKey = process.env.VISITOR_COUNTER_KEY || 'portfolio:visitor-count';

    if (!redisUrl || !redisToken) {
        return response.status(500).json({ error: 'Visitor counter storage is not configured' });
    }

    try {
        const baseUrl = redisUrl.replace(/\/$/, '');
        const upstreamResponse = await fetch(`${baseUrl}/incr/${encodeURIComponent(counterKey)}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${redisToken}`
            }
        });

        if (!upstreamResponse.ok) {
            const errorText = await upstreamResponse.text();
            throw new Error(`Redis request failed with ${upstreamResponse.status}: ${errorText}`);
        }

        const payload = await upstreamResponse.json();
        const count = Number.parseInt(payload.result, 10);

        return response.status(200).json({
            count: Number.isFinite(count) ? count : 1
        });
    } catch (error) {
        console.error('Visitor counter failed:', error);
        return response.status(500).json({ error: 'Counter update failed' });
    }
}
