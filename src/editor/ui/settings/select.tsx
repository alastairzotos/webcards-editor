import * as React from 'react';

import { ArrowDropDown } from '@material-ui/icons';
import TaggedSetting from './taggedSetting';
import '../../../css/settings.css';


interface ISelectProps {
    title: string;

    canAuto: boolean;
    default?: string;
    
    values: { id: string; value?: string; }[];

    onChange?: (value: string)=>void;
}


interface ISelectState {
    currentValue: string;
}

export default class Select extends React.Component<ISelectProps, ISelectState> {
    private _defaultValue: string;
    private _ref: any;

    constructor(props: ISelectProps) {
        super(props);

        this._defaultValue = props.default ? props.default : props.values[0].id;

        this.state = {
            currentValue: this._defaultValue
        };

        this._ref = React.createRef();
    }

    onPropsChanged = () => {
        this.setState({...this.state, currentValue: this.props.default});
    };

    componentDidUpdate(prevProps: ISelectProps) {
        if (prevProps.default != this.props.default)
            this.onPropsChanged();
    }

    onChange = event => {
        this.setState({
            ...this.state,

            currentValue: event.target.value
        }, this.triggerChange);
    };

    setAuto = () => {
        this.setState({
            ...this.state,

            currentValue: this._defaultValue
        }, this.triggerChange);
    };


    triggerChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.currentValue);
        }
    };

    render() {
        return (
            <TaggedSetting
                title={this.props.title}
                canClear={this.props.canAuto}
                displayClear={this.state.currentValue != this._defaultValue}
                onCleared={this.setAuto}
            >
                <div className="wc-select-wrapper">
                    <select ref={this._ref} className="wc-select" value={this.state.currentValue} onChange={this.onChange}>
                    {
                        this.props.values.map(val => {
                            return (
                                <option key={val.id} value={val.id}>{val.value !== undefined ? val.value : val.id}</option>
                            );
                        })
                    }
                    </select>

                    {/*<div className="wc-select-button" onClick={() => { this._ref.current.focus(); this._ref.current.click(); }}>
                        <ArrowDropDown style={{ fontSize: "12px" }} />
                    </div>*/}
                </div>
            </TaggedSetting>
        );
    }
}