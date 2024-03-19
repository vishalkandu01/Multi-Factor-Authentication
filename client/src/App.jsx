import React from 'react';
import './App.css'
import Login from './components/Login';

function App() {
    const centerStyle = {
        textAlign: 'center'
    }

    return (
        <div className='App'>
            <div style={centerStyle}>
                <h1>
                    Multi-Factor-Authentication
                </h1>
            </div>
            <Login />
        </div>
    );
}

export default App
