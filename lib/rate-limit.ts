
const ipRequests = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(ip: string, limit: number = 20, windowMs: number = 60 * 1000): boolean {
    const now = Date.now();
    const record = ipRequests.get(ip);

    if (!record) {
        ipRequests.set(ip, { count: 1, lastRequest: now });
        return false;
    }

    if (now - record.lastRequest > windowMs) {
        // Reset window
        ipRequests.set(ip, { count: 1, lastRequest: now });
        return false;
    }

    if (record.count >= limit) {
        return true; // Limit exceeded
    }

    record.count++;
    return false;
}
