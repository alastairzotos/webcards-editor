import * as React from 'react';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import * as Icons from '@material-ui/icons';


interface ISettingsGroupProps {
    title: string;
}

export const SettingsGroup: React.FC<ISettingsGroupProps> = ({ title, children }) => {
    return (
        <ExpansionPanel square style={{ margin: '0' }}>
            <ExpansionPanelSummary style={{ backgroundColor: "#666666", color: 'white' }} expandIcon={<Icons.ExpandMore />}>
                <Typography style={{ fontSize: "12px" }}>{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ backgroundColor: "#555555", color: 'white', display: "block", padding: "10px" }}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default SettingsGroup;