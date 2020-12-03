import './App.css';
import { useState } from 'react';
import DisplayZones from './DisplayZones';

function App() {
    const [showMoreZones, setShowMoreZones] = useState(false);
    const toggleShowMoreZones = () => {
        setShowMoreZones(!showMoreZones);
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: '1980px' }}>
                <div></div>
                <RenderMoreZonesButton toggleShowMoreZones={toggleShowMoreZones} showMoreZones={showMoreZones} />
            </div>
            <DisplayZones showMoreZones={showMoreZones} />
        </div>
    );
}

function RenderMoreZonesButton(props) {
    const buttonStyle = { fontSize: 'large' };
    const { toggleShowMoreZones, showMoreZones } = props;
    const ShowHide = showMoreZones ? 'Hide' : 'Show';
    return (
        <button style={buttonStyle} onClick={toggleShowMoreZones}>{ShowHide} More Zones</button>
    )
}

export default App;
