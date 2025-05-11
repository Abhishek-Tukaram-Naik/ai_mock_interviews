// app/test/page.tsx
export default function TestPage() {
    return (
        <div>
            <h1>Firebase Config Test</h1>
            <pre>{JSON.stringify({
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
                loaded: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
            }, null, 2)}</pre>
        </div>
    )
}