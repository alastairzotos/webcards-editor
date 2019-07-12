import * as React from 'react';
import { ChromePicker } from 'react-color';
import reactCSS from 'reactcss'

import * as parseColor from 'parse-color';
import TaggedSetting from './taggedSetting';


interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface IColorPickerProps {
    title: string;
    color: IColor | string;
    onChange: (color: IColor) => void;
}

interface IColorPickerState {
    color: IColor;
    swatchOpen: boolean;
}

export default class ColorPicker extends React.Component<IColorPickerProps, IColorPickerState> {

    constructor(props: IColorPickerProps) {
        super(props);

        let defaultColor: IColor = { r: 0, g: 0, b: 0, a: 0 };

        if ((props.color as string).length !== undefined) {
            defaultColor = ColorPicker.stringToColor(props.color as string);
        } else {
            defaultColor = props.color as IColor;
        }

        this.state = {
            color: defaultColor,
            swatchOpen: false
        };
    }

    static stringToColor = (color: string): IColor => {
        let parsed = parseColor(color).rgba;
        return {
            r: parsed[0],
            g: parsed[1],
            b: parsed[2],
            a: parsed[3]
        } as IColor;
    };

    static colorToCSSColor = (color: IColor): string => {
        return `rgba(${color.r},${color.g},${color.b},${color.a})`;
    };

    static stringToCSSColor = (color: string): string => {
        return ColorPicker.colorToCSSColor(ColorPicker.stringToColor(color));
    };

    onPropsUpdated = () => {
        let defaultColor: IColor = { r: 0, g: 0, b: 0, a: 0 };

        if ((this.props.color as string).length !== undefined) {
            defaultColor = ColorPicker.stringToColor(this.props.color as string);
        } else {
            defaultColor = this.props.color as IColor;
        }

        this.setState({...this.state, color: defaultColor});
    };

    componentDidUpdate(prevProps: IColorPickerProps) {
        if (prevProps.color.toString() != this.props.color.toString())
            this.onPropsUpdated();
    }

    handleChange = (color: IColor) => {
        this.setState({
            ...this.state,
            color: color
        }, () => {
            this.props.onChange(color);
        });
    }

    handleClick = () => {
        this.setState({
            ...this.state,
            swatchOpen: !this.state.swatchOpen
        });
    };

    handleClose = () => {
        this.setState({
            ...this.state,
            swatchOpen: false
        });
    };

    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <TaggedSetting title={this.props.title} canClear={false}>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>

                {this.state.swatchOpen && (
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose} />

                        <ChromePicker
                            color={this.state.color}
                            onChange={color => { this.handleChange(color.rgb as IColor); }}
                        />
                    </div>
                )}
            </TaggedSetting>
        );
    }
}