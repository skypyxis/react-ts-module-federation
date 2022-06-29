import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
                Add by one each click <b>APP-1</b>
            </span>
            <span>Your click count : {count} </span>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
};

export default Counter;
