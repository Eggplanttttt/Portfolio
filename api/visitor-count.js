const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

function getFirebaseAdminApp() {
    if (getApps().length) {
        return getApps()[0];
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : '';

    if (!projectId || !clientEmail || !privateKey) {
        const missing = [
            !projectId ? 'FIREBASE_PROJECT_ID' : null,
            !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : null,
            !privateKey ? 'FIREBASE_PRIVATE_KEY' : null
        ].filter(Boolean);

        throw new Error(`Missing Firebase Admin environment variables: ${missing.join(', ')}`);
    }

    return initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey
        })
    });
}

module.exports = async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const app = getFirebaseAdminApp();
        const db = getFirestore(app);
        const counterRef = db.collection('siteStats').doc('visitorCounter');

        await counterRef.set(
            {
                count: FieldValue.increment(1),
                updatedAt: FieldValue.serverTimestamp()
            },
            { merge: true }
        );

        const snapshot = await counterRef.get();
        const count = snapshot.exists ? Number.parseInt(String(snapshot.data().count ?? 1), 10) : 1;

        return response.status(200).json({
            count: Number.isFinite(count) ? count : 1
        });
    } catch (error) {
        console.error('Visitor counter failed:', error);
        return response.status(500).json({
            error: 'Counter update failed',
            message: error && error.message ? error.message : 'Unknown server error'
        });
    }
};
