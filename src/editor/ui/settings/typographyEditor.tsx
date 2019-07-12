import * as React from 'react';

import { Grid } from '@material-ui/core';

import { SettingsGroup } from './settings';
import DimensionPicker from './dimensionPicker';
import Select from './select';
import TaggedSetting from './taggedSetting';
import SettingsFrame from './settingsFrame';
import ColorPicker from './colorPicker';


interface ITypography {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    letterSpacing?: string;
    lineHeight?: string;
    color?: string;
}

interface ITypographyEditorProps {
    default?: ITypography;
    onChange: (decorations: ITypography)=>void;
}

interface ITypographyEditorState {
    typography: ITypography;
}


export default class TypographyEditor extends React.Component<ITypographyEditorProps, ITypographyEditorState> {
    private _def: ITypography;

    static getDefaults = (): ITypography => {
        return {
            fontFamily: "Arial",
            fontSize: "14px",
            fontWeight: "normal",
            letterSpacing: "normal",
            lineHeight: "normal",
            color: "#000000"
        };
    };

    constructor(props: ITypographyEditorProps) {
        super(props);

        this.state = {
            typography: TypographyEditor.getDefaults()
        };
    }

    onPropsUpdated = () => {
        let def: ITypography = TypographyEditor.getDefaults();

        if (this.props.default) {

            this._def = {};
            Object.keys(def).forEach(key => {
                if (this.props.default[key] !== undefined) {
                    this._def[key] = this.props.default[key];
                } else {
                    this._def[key] = def[key];
                }
            });

        } else {
            this._def = def;
        }

        this.setState({...this.state, typography: this._def});
    };

    componentDidUpdate(prevProps: ITypographyEditorProps) {
        
        // Ugly hack
        if (JSON.stringify(prevProps) != JSON.stringify(this.props))
            this.onPropsUpdated();

    }

    onChangeItem = (item: string, value: string) => {
        let newDecorations = { ...this.state.typography };
        newDecorations[item] = value;
        this.setState({
            ...this.state,
            typography: newDecorations
        }, this.triggerChange);
    };

    onChangeItems = (items: { item: string, value: string }[]) => {
        let newDecorations = { ...this.state.typography };
        for (let item of items) {
            newDecorations[item.item] = item.value;
        }

        this.setState({
            ...this.state,
            typography: newDecorations
        }, this.triggerChange);
    };

    triggerChange = () => {
        this.props.onChange(this.state.typography);
    };

    getItem = (item: string): string => {
        return this.state.typography[item];
    };


    render() {

        let fonts = [
            "Arial, Helvetica, sans-serif",
            "Arial Black, Gadget, sans-serif",
            "Brush Script MT, sans-serif",
            "Comic Sans MS, cursive, sans-serif",
            "Courier New, Courier, monospace",
            "Georgia, serif",
            "Helvetica, serif",
            "Impact, Charcoal, sans-serif",
            "Lucida Sans Unicode, Lucida Grande, sans-serif",
            "Tahoma, Geneva, sans-serif",
            "Times New Roman, Times, serif",
            "Trebuchet MS, Helvetica, sans-serif",
            "Verdana, Geneva, sans-serif"
        ];

        let weights = [
            "Thin",
            "Extra Light",
            "Light",
            "Normal",
            "Medium",
            "Semi-Bold",
            "Bold",
            "Extra-Bold",
            "Ultra-Bold"
        ];

        return (
            <SettingsGroup title="Typography">

                <Select
                    title="Font"
                    canAuto={false}
                    default={this.state.typography.fontFamily}
                    values={fonts.map(font => ({id: font, value: font.split(',')[0]}))}
                    onChange={fontFamily => {
                        this.onChangeItem("fontFamily", fontFamily);
                    }}
                />

                {/* Size and weight */}
                <Grid container>
                    <Grid item xs={6}>
                        <DimensionPicker title="Size" canAuto={false} dimensions={["px", "em", "rem", "%"]} initialValue={this.getItem("fontSize")} onChange={value => { this.onChangeItem("fontSize", value); }} />
                    </Grid>

                    <Grid item xs={6}>
                        <Select
                            title="Weight"
                            canAuto={false}
                            default={this.state.typography.fontWeight}
                            values={weights.map((weight, index) => ({ id: ("" + (index + 1) * 100), value: weight }))}
                            onChange={fontWeight => {
                                this.onChangeItem("fontWeight", fontWeight);
                            }}
                        />
                    </Grid>
                </Grid>

                {/* Letter spacing and line height */}
                <Grid container>
                    <Grid item xs={6}>
                        <DimensionPicker title="Spacing" canAuto={false} dimensions={["px", "em", "rem", "%"]} initialValue={this.getItem("letterSpacing")} onChange={value => { this.onChangeItem("letterSpacing", value); }} />
                    </Grid>

                    <Grid item xs={6}>
                        <DimensionPicker title="Line Height" canAuto={false} dimensions={["px", "em", "rem", "%"]} initialValue={this.getItem("lineHeight")} onChange={value => { this.onChangeItem("lineHeight", value); }} />
                    </Grid>
                </Grid>

                <ColorPicker
                    title="Color"
                    color={this.state.typography.color}
                    onChange={color => {
                        this.onChangeItem("color", ColorPicker.colorToCSSColor(color));
                    }}
                />

            </SettingsGroup>
        );
    }
}


