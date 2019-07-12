import * as React from 'react';

import { SettingsGroup } from './settings';
import DimensionPicker from './dimensionPicker';
import Select from './select';
import TaggedSetting from './taggedSetting';
import SettingsFrame from './settingsFrame';
import { Settings } from '@material-ui/icons';
import { Grid } from '@material-ui/core';



export interface IDimensions {
    width?: string;
    height?: string;

    minWidth?: string;
    minHeight?: string;

    maxWidth?: string;
    maxHeight?: string;

    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;

    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
}

interface IDimensionsEditorProps {
    default?: IDimensions;
    onChange: (dimensions: IDimensions)=>void;
}


interface IDimensionsEditorState {
    dimensions: IDimensions;
}



export class DimensionsEditor extends React.Component<IDimensionsEditorProps, IDimensionsEditorState> {
    private _def: IDimensions;

    static getDefaults = (): IDimensions => ({
        width: "auto",
        height: "auto",

        minWidth: "auto",
        minHeight: "auto",

        maxWidth: "auto",
        maxHeight: "auto",

        marginTop: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        marginRight: "0px",

        paddingTop: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        paddingRight: "0px"
    });

    constructor(props: IDimensionsEditorProps) {
        super(props);

        this.state = {
            dimensions: DimensionsEditor.getDefaults()
        };
    }

    onPropsUpdated = () => {
        let def = DimensionsEditor.getDefaults();

        if (this.props.default) {

            this._def = {};
            Object.keys(def).forEach(key => {
                if (this.props.default[key] !== undefined) {
                    this._def[key] = this.props.default[key];
                } else {
                    this._def[key] = def[key];
                }
            });

            ["margin", "padding"].forEach(setting => {
                if (this.props.default[setting] !== undefined) {
                    let parts = (this.props.default[setting] as string).split(' ');
                    if (parts.length == 1) {
                        this._def[setting + "Top"] = parts[0];
                        this._def[setting + "Right"] = parts[0];
                        this._def[setting + "Bottom"] = parts[0];
                        this._def[setting + "Left"] = parts[0];
                    } else if (parts.length == 2) {
                        this._def[setting + "Top"] = parts[0];
                        this._def[setting + "Right"] = parts[1];
                        this._def[setting + "Bottom"] = parts[0];
                        this._def[setting + "Left"] = parts[1];
                    } else if (parts.length == 4) {
                        this._def[setting + "Top"] = parts[0];
                        this._def[setting + "Right"] = parts[1];
                        this._def[setting + "Bottom"] = parts[2];
                        this._def[setting + "Left"] = parts[3];
                    }
                }
            });

        } else {
            this._def = def;
        }

        this.setState({...this.state, dimensions: this._def});
    };

    componentDidUpdate(prevProps: IDimensionsEditorProps) {

        // Ugly hack
        if (JSON.stringify(prevProps) != JSON.stringify(this.props))
            this.onPropsUpdated();
    }

    onChangeItem = (item: string, value: string) => {
        let newDimensions = { ...this.state.dimensions };
        newDimensions[item] = value;
        this.setState({
            ...this.state,
            dimensions: newDimensions
        }, this.triggerChange);
    };

    triggerChange = () => {
        this.props.onChange(this.state.dimensions);
    };

    getItem = (item: string): string => {
        //return this.props.default ? this.props.default[item] : this.state.dimensions[item];
        return this.state.dimensions[item];
    };

    render() {

        return (
            <SettingsGroup title="Dimensions">
            
                {/* Width, height, etc */}
                <Grid container>
                    <Grid item xs={6}>
                        <DimensionPicker title="Width" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("width")} onChange={value => { this.onChangeItem("width", value); }} />
                    </Grid>
                    <Grid item xs={6}>
                        <DimensionPicker title="Height" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("height")} onChange={value => { this.onChangeItem("height", value); }} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6}>
                        <DimensionPicker title="Min width" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("minWidth")} onChange={value => { this.onChangeItem("minWidth", value); }} />
                    </Grid>
                    <Grid item xs={6}>
                        <DimensionPicker title="Min height" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("minHeight")} onChange={value => { this.onChangeItem("minHeight", value); }} />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6}>
                        <DimensionPicker title="Max width" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("maxWidth")} onChange={value => { this.onChangeItem("maxWidth", value); }} />
                    </Grid>
                    <Grid item xs={6}>
                        <DimensionPicker title="Max height" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("maxHeight")} onChange={value => { this.onChangeItem("maxHeight", value); }} />
                    </Grid>
                </Grid>


                {/* Margin */}
                <TaggedSetting title="Margin" canClear={false}>
                    <SettingsFrame>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Top" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("marginTop")} onChange={value => { this.onChangeItem("marginTop", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Bottom" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("marginBottom")} onChange={value => { this.onChangeItem("marginBottom", value); }} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Left" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("marginLeft")} onChange={value => { this.onChangeItem("marginLeft", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Right" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("marginRight")} onChange={value => { this.onChangeItem("marginRight", value); }} />
                            </Grid>
                        </Grid>
                    </SettingsFrame>
                </TaggedSetting>

                 {/* Padding */}
                 <TaggedSetting title="Padding" canClear={false}>
                    <SettingsFrame>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Top" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("paddingTop")} onChange={value => { this.onChangeItem("paddingTop", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Bottom" canAuto dimensions={["px", "%", "vh"]} initialValue={this.getItem("paddingBottom")} onChange={value => { this.onChangeItem("paddingBottom", value); }} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <DimensionPicker title="Left" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("paddingLeft")} onChange={value => { this.onChangeItem("paddingLeft", value); }} />
                            </Grid>
                            <Grid item xs={6}>
                                <DimensionPicker title="Right" canAuto dimensions={["px", "%", "vw"]} initialValue={this.getItem("paddingRight")} onChange={value => { this.onChangeItem("paddingRight", value); }} />
                            </Grid>
                        </Grid>
                    </SettingsFrame>
                </TaggedSetting>

            </SettingsGroup>
        );
    }
}

