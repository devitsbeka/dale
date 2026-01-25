'use client';

export default function TestPage() {
    return (
        <div style={{ padding: '50px', backgroundColor: 'white', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Click Test Page</h1>

            <button
                onClick={() => alert('Button clicked!')}
                style={{
                    padding: '20px 40px',
                    fontSize: '20px',
                    backgroundColor: 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    display: 'block'
                }}
            >
                Click Me - Test 1
            </button>

            <button
                onClick={() => console.log('Button 2 clicked')}
                style={{
                    padding: '20px 40px',
                    fontSize: '20px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 9999,
                    display: 'block'
                }}
            >
                Click Me - Test 2 (z-9999)
            </button>

            <input
                type="text"
                placeholder="Type here..."
                style={{
                    padding: '10px',
                    fontSize: '18px',
                    width: '300px',
                    marginTop: '20px',
                    display: 'block',
                    border: '2px solid black'
                }}
                onChange={(e) => console.log('Input value:', e.target.value)}
            />

            <p style={{ marginTop: '20px', fontSize: '16px' }}>
                Open browser console (F12) and check for errors or click logs.
            </p>
        </div>
    );
}
