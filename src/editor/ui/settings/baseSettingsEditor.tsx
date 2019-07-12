import * as React from 'react';
import { Drawer } from '@material-ui/core';

import * as settings from './settings';
import {IDimensions, DimensionsEditor} from './dimensionsEditor';
import DecorationEditor from './decorationEditor';
import CustomSettingsEditor from './customSettingsEditor';
import TypographyEditor from './typographyEditor';


interface IBaseSettingsEditorProps {
    open: boolean;

    includeCustomSettingsEditor: boolean;
    style?: React.CSSProperties;

    onStyleChanged: (styles: React.CSSProperties)=>void;
}

interface IBaseSettingsEditorState {
    style: React.CSSProperties;
}

const extractKeys = (currentStyle: React.CSSProperties, required: any) => {
    let common = {};

    Object.keys(required).forEach(key => {

    });

    return common;
};


export default class BaseSettingsEditor extends React.Component<IBaseSettingsEditorProps, IBaseSettingsEditorState> {
    constructor(props: IBaseSettingsEditorProps) {
        super(props);

        this.state = {
            style: props.style ? props.style : {}
        };
    }

    onStylesChanged = (styles: any) => {
        let newStyles = {
            ...this.state.style,
            ...styles
        };

        this.setState({
            ...this.state,

            style: newStyles
        }, () => {
            this.props.onStyleChanged(this.state.style);
        });
    };

    render() {
        let width = "240px";

        return (
            <Drawer
                open={this.props.open}
                anchor="right"
                variant="persistent"
                PaperProps={{
                    square: false,
                    style: {
                        backgroundColor: '#333333',
                        color: "white",
                        width: width,
                        margin: 'auto'
                    }
                }}

                onClick = {event => { event.stopPropagation(); }}
            >
                <settings.SettingsGroup title="Settings">Settings</settings.SettingsGroup>
                <settings.SettingsGroup title="General">General</settings.SettingsGroup>

                <DimensionsEditor
                    default={this.props.style as any}
                    onChange={dimensions => {
                        this.onStylesChanged(dimensions);
                    }}
                />

                <TypographyEditor
                    default={this.props.style as any}
                    onChange={typography => {
                        this.onStylesChanged(typography);
                    }}
                />

                <DecorationEditor
                    default={this.props.style as any}
                    onChange={decorations => {
                        this.onStylesChanged(decorations);
                    }}
                />

                <>{this.props.includeCustomSettingsEditor && <CustomSettingsEditor />}</>
            </Drawer>
        );
    }
}

