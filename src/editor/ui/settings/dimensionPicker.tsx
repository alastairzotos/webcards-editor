import * as React from 'react';

import { Typography } from '@material-ui/core';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

import TaggedSetting from './taggedSetting';

import '../../../css/settings.css';


interface IDimensionPickerProps {
    title: string;
    canAuto: boolean;
    dimensions: string[];
    initialValue?: string;

    onChange?: (value: string)=>void;
}

interface IDimensionPickerState {
    unit: string;
    size: number;
    autoed: boolean;

    inputValue: string;
    error: boolean;

    dirty: boolean;
}


export default class DimensionPicker extends React.Component<IDimensionPickerProps, IDimensionPickerState> {
    constructor(props: IDimensionPickerProps) {
        super(props);


        if (props.initialValue) {
            const {unit, size, inputValue} = this.parseInput(props.initialValue);
            this.state = {
                unit: unit as any,
                size: size,
                autoed: false,
                inputValue: inputValue,
                error: false,
                dirty: false
            };
        } else {
            this.state = {
                unit: "px",
                size: 0,
                autoed: props.canAuto,
                inputValue: props.canAuto ? "auto" : "0",
                error: false,
                dirty: false
            };
        }
    }

    parseInput = (input: string):{unit: string, size: number, inputValue: string} => {

        if (input == "" || input === undefined) {
            return {
                unit: "px",
                size: 0,
                inputValue: "0"
            };
        } else if (input == "auto") {
            return {
                unit: "px",
                size: 0,
                inputValue: "auto"
            };
        } else {
            let unit = "px";
            let size = 0;

            this.props.dimensions.forEach(dim => {
                if (input.endsWith(dim)) {
                    unit = dim;
                    size = this.getNumber(input.substr(0, input.length - dim.length));
                }
            });

            return {
                unit: unit,
                size: size,
                inputValue: "" + size
            };
        }
    };

    getNumber = (input: string): number|null => {
        if (input.length == 0) return 0;

        let isNegative = input[0] == '-';

        let numString = "";
        for (let i = (isNegative ? 1 : 0); i < input.length; i++) {
            let cur = input[i];

            if ((cur >= '0' && cur <= '9') || cur == '.') {
                numString += cur;
            } else {
                return null;
            }
        }

        if (isNegative) {
            return -parseFloat(numString);
        } else {
            return parseFloat(numString);
        }
    }

    onChangeInput = event => {

        let value = event.target.value as string;
        if (value == "") {

            this.setState({
                ...this.state,

                inputValue: "",
                size: 0,
                autoed: this.props.canAuto,
                error: false,
                dirty: true
            }, this.triggerChange);

        } else if (value == "auto" && this.props.canAuto) {
            this.setState({
                ...this.state,

                inputValue: "auto",
                size: 0,
                autoed: true,
                error: false,
                dirty: true
            }, this.triggerChange);

        } else {
            let num = this.getNumber(value);

            if (num === null) {
                this.setState({
                    ...this.state,
    
                    inputValue: value,
                    error: true,
                    dirty: true
                });
            } else {
                this.setState({
                    ...this.state,
    
                    inputValue: value,
                    size: this.getNumber(value),
                    autoed: false,
                    error: false,
                    dirty: true
                }, this.triggerChange);
            }
        }
    };

    incNumber = () => {
        this.setSize(this.state.size + 1);
    };

    decNumber = () => {
        this.setSize(this.state.size - 1);
    };

    setSize = (size: number) => {
        this.setState({
            ...this.state,

            autoed: this.props.canAuto && size == 0,
            size: size,
            inputValue: "" + size, //(size == 0) ? (this.props.canAuto ? "auto" : ("" + size)) : ("" + size),
            error: false,
            dirty: true
        }, this.triggerChange);
    }

    setAuto = () => {
        this.setState({
            ...this.state,

            autoed: true,
            inputValue: "auto",
            dirty: false
        }, this.triggerChange);
    };

    onChangeUnit = (unit: string) => {
        this.setState({
            ...this.state,

            unit: unit as any
        }, this.triggerChange);
    };

    triggerChange = () => {
        if (this.props.onChange) {
            if (this.state.autoed) {
                this.props.onChange("auto");
            } else {
                this.props.onChange(`${this.state.size}${this.state.unit}`);
            }
        }
    };

    componentWillReceiveProps(nextProps: IDimensionPickerProps, nextContext) {
        if (nextProps.initialValue !== this.props.initialValue) {
            const {unit, size, inputValue} = this.parseInput(nextProps.initialValue);

            this.setState({
                ...this.state,

                inputValue: inputValue,
                unit: unit as any,
                size: size
            });
        }
    }

    render() {
        return (
            <TaggedSetting
                title={this.props.title}
                canClear={this.props.canAuto}
                displayClear={this.state.dirty}
                onCleared={this.setAuto}
            >

                <div className={"wc-dimension-picker" + (this.state.error ? " wc-dimension-picker-error" : "")}>
                    <span className="wc-dimension-picker-input-span">
                        <input className="wc-dimension-picker-input" value={this.state.inputValue} onChange={this.onChangeInput} />
                    </span>

                    <span className="wc-dimension-picker-unit-span" style={{ visibility: this.state.autoed ? "hidden" : "visible" }}>
                        <select
                            className="wc-dimension-picker-unit"
                            value={this.state.unit}
                            onChange={(event) => {
                                this.onChangeUnit(event.target.value);
                            }}
                        >
                        {
                            this.props.dimensions.map(dim => <option key={dim} value={dim}>{dim}</option>)
                        }
                        </select>
                    </span>

                    <div className="wc-dimension-picker-number-span">
                        <div className="wc-dimension-picker-number-container" onClick={this.incNumber}>
                            <ArrowDropUp style={{ fontSize: "12px", paddingBottom: "6px" /*, marginTop: "-6px", marginBottom: "-6px"*/ }} />
                        </div>
                        <div className="wc-dimension-picker-number-container" onClick={this.decNumber}>
                            <ArrowDropDown style={{ fontSize: "12px", paddingBottom: "6px" /*, marginTop: "-6px", marginBottom: "-6px"*/ }} />
                        </div>
                    </div>

                </div>

            </TaggedSetting>
        );
    }
}