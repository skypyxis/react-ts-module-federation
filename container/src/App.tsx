import React, { useState } from 'react';
import './App.scss';

const CounterAppOne = React.lazy(() => import('app1/CounterAppOne'));
const CounterAppTwo = React.lazy(() => import('app2/CounterAppTwo'));

var version = process.env.BUILD_DATE;

function App() {
    const [showApp1, setShowApp1] = useState(false);
    const [showApp2, setShowApp2] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                Latest Build Date: <span style={{ fontWeight: 'bold' }}>{version}</span>
            </div>

            <h1 color="#fff">CONTAINER</h1>
            <div className="box" style={{ display: 'flex', flexDirection: 'row' }}>
                {!showApp1 && <button onClick={() => setShowApp1(true)}>Load App 1</button>}
                {showApp1 && (
                    <React.Suspense fallback={'loading'}>
                        <div className="box">
                            <h1>APP-1</h1>
                            <CounterAppOne />
                        </div>
                    </React.Suspense>
                )}
                {!showApp2 && <button onClick={() => setShowApp2(true)}>Load App 2</button>}
                {showApp2 && (
                    <React.Suspense fallback={'loading'}>
                        <div className="box">
                            <h1>APP-2</h1>
                            <CounterAppTwo />
                        </div>
                    </React.Suspense>
                )}
            </div>
        </div>
    );
}
export default App;
