import * as React from 'react';

import { Grid } from '@material-ui/core';

import { SettingsGroup } from './settings';
import DimensionPicker from './dimensionPicker';
import Select from './select';
import TaggedSetting from './taggedSetting';
import SettingsFrame from './settingsFrame';
import ColorPicker from './colorPicker';


interface IDecorations {
    backgroundColor?: string;

    border?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;

    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
}

interface IDecorationEditorProps {
    default?: IDecorations;
    onChange: (decorations: IDecorations)=>void;
}

interface IDecorationEditorState {
    decorations: IDecorations;
}


export default class DecorationEditor extends React.Component<IDecorationEditorProps, IDecorationEditorState> {
    private _def: IDecorations;

    static getDefaults = (): IDecorations => {
        return {
            backgroundColor: ColorPicker.stringToCSSColor("white"),

            border: "",
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "#000000",

            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px"
        };
    };

    constructor(props: IDecorationEditorProps) {
        super(props);

        this.state = {
            decorations: DecorationEditor.getDefaults()
        };
    }

    onPropsUpdated = () => {
        let def: IDecorations = DecorationEditor.getDefaults();

        if (this.props.default) {

            this._def = {};
            Object.keys(def).forEach(key => {
                if (this.props.default[key] !== undefined) {
                    this._def[key] = this.props.default[key];
                } else {
                    this._def[key] = def[key];
                }
            });

            if (this.props.default["border"] !== undefined) {
                const [width, style, ...color] = this.props.default["border"].split(' ');
                this._def.borderWidth = width;
                this._def.borderStyle = style;
                this._def.borderColor = color.join(' ');
            }

            if (this.props.default["borderRadius"] !== undefined) {
                ["Top", "Bottom"].forEach(v => {
                    ["Left", "Right"].forEach(h => {
                        this._def[`border${v}${h}Radius`] = this.props.default["borderRadius"];
                    });
                });
            }

        } else {
            this._def = def;
        }

        this.setState({...this.state, decorations: this._def});
    };

    componentDidUpdate(prevProps: IDecorationEditorProps) {
        
        // Ugly hack
        if (JSON.stringify(prevProps) != JSON.stringify(this.props))
            this.onPropsUpdated();

    }

    onChangeItem = (item: string, value: string) => {
        let newDecorations = { ...this.state.decorations };
        newDecorations[item] = value;
        this.setState({
            ...this.state,
            decorations: newDecorations
        }, this.triggerChange);
    };

    onChangeItems = (items: { item: string, value: string }[]) => {
        let newDecorations = { ...this.state.decorations };
        for (let item of items) {
            newDecorations[item.item] = item.value;
        }

        this.setState({
            ...this.state,
            decorations: newDecorations
        }, this.triggerChange);
    };

    triggerChange = () => {
        this.props.onChange(this.state.decorations);
    };

    getItem = (item: string): string => {
        return this.state.decorations[item];
    };


    render() {
        return (
            <SettingsGroup title="Decorations">

                <ColorPicker
                    title="Background color"
                    color={this.state.decorations.backgroundColor}
                    onChange={color => {
                        this.onChangeItem("backgroundColor", ColorPicker.colorToCSSColor(color));
                    }}
                />

                {/* Border */}
                <TaggedSetting title="Border" canClear={false}>
                    <SettingsFrame>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker
                                    title="Width"
                                    canAuto={false}
                                    dimensions={["px"]}
                                    initialValue={this.getItem("borderWidth")}
                                    onChange={value => {
                                        this.onChangeItems([
                                            {item: "borderWidth", value: value},
                                            {item: "border", value: `${value} ${this.getItem("borderStyle")} ${this.getItem("borderColor")}`}
                                        ]);
                                    }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Select
                                    canAuto
                                    default={this.state.decorations.borderStyle}
                                    title="Style"
                                    values={[{id: "none"}, {id: "solid"}, {id: "dotted"}, {id: "dashed"}]}
                                    onChange={value => {
                                        this.onChangeItems([
                                            {item: "borderStyle", value: value},
                                            {item: "border", value: `${this.getItem("borderWidth")} ${value} ${this.getItem("borderColor")}`}
                                        ]);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <ColorPicker
                                    title="Color"
                                    color={this.state.decorations.borderColor}
                                    onChange={color => {
                                        this.onChangeItems([
                                            {item: "borderColor", value: ColorPicker.colorToCSSColor(color)},
                                            {item: "border", value: `${this.getItem("borderWidth")} ${this.getItem("borderStyle")} ${ColorPicker.colorToCSSColor(color)}`}
                                        ]);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </SettingsFrame>
                </TaggedSetting>


                {/* Border radius */}
                <TaggedSetting title="Border radius" canClear={false}>
                    <SettingsFrame>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Top Left" canAuto={false} dimensions={["px", "%"]} initialValue={this.getItem("borderTopLeftRadius")} onChange={value => { this.onChangeItem("borderTopLeftRadius", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Top Right" canAuto={false} dimensions={["px", "%"]} initialValue={this.getItem("borderTopRightRadius")} onChange={value => { this.onChangeItem("borderTopRightRadius", value); }} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Bottom Left" canAuto={false} dimensions={["px", "%"]} initialValue={this.getItem("borderBottomLeftRadius")} onChange={value => { this.onChangeItem("borderBottomLeftRadius", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Bottom Right" canAuto={false} dimensions={["px", "%"]} initialValue={this.getItem("borderBottomRightRadius")} onChange={value => { this.onChangeItem("borderBottomRightRadius", value); }} />
                            </Grid>
                        </Grid>
                    </SettingsFrame>
                </TaggedSetting>

            </SettingsGroup>
        );
    }
}