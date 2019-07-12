import * as React from 'react';


const SettingsFrame: React.FC = ({ children }) => {
    return (
        <div className="wc-settings-frame">
            {children}
        </div>
    );
};

export default SettingsFrame;