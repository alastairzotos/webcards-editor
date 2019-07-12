import * as React from 'react';
import { connect } from 'react-redux';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import SettingsGroup from './settings';
import TaggedSetting from './taggedSetting';
import * as custom from '../../content/customSettings';
import * as cnt from '../../content/content';
import * as actions from '../../state/actions';


interface ICustomSettingsEditorProps {
    title: string;
    content: cnt.ContentItem;
    customType: custom.CustomTypeSettings;

    changeItemDataProp?: (content: cnt.ContentItem, prop: string, value: any)=>void;
}


const createMarks = (step: number, min: number, max: number) => {
    let marks = {};

    for (let i = min; i < max + step; i++) {
        marks[i] = i;
    }

    return marks;
};

const createCustomNumberSetter = (content: cnt.ContentItem, prop: custom.CustomTypeSetting, onChange: (value: number)=>void) => {
    return (
        <>
            <Slider
                defaultValue={content.data[prop.prop]}
                step={prop.type.rules.step}
                min={prop.type.rules.min}
                max={prop.type.rules.max}
                //marks={{1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:12}}
                marks={
                    (prop.type.rules.step && prop.type.rules.min && prop.type.rules.max) ? 
                        createMarks(prop.type.rules.step, prop.type.rules.min, prop.type.rules.max)
                    : undefined
                }

                onChange={onChange}
            />
            <div style={{ height: "20px" }}></div>
        </>
    );
};

const createCustomSetting = (content: cnt.ContentItem, prop: custom.CustomTypeSetting, onChange: (value: any)=>void) => {
    
    let setter = <></>;

    switch (prop.type.type) {
        case custom.TypeTag.NUMBER: 
            setter = createCustomNumberSetter(content, prop, value => { onChange(value); });
            break;
    }


    return (
        <TaggedSetting title={prop.title} canClear={false}>{setter}</TaggedSetting>
    );
};

const createCustomSettings = (content: cnt.ContentItem, settings: custom.CustomTypeSettings, onChange: (prop: string, value: any)=>void) => {
    return (
        <>
        {
            settings.props.map((prop, index) => {
                return (
                    <React.Fragment key={index}>
                    {
                        createCustomSetting(content, prop, (value) => {
                            onChange(prop.prop, value);
                        })
                    }
                    </React.Fragment>
                );
            })
        }
        </>
    );
}

const mapStateToProps = (state: actions.IEditorReduxState, ownProps: ICustomSettingsEditorProps): ICustomSettingsEditorProps => ({
    ...ownProps,

    content: state.selectedItem,
    title: (state.selectedItem && state.selectedItem.type.customTypeSettings) ? state.selectedItem.type.name : null,
    customType: state.selectedItem ? state.selectedItem.type.customTypeSettings : null
});

const mapDispatchToProps = (dispatch, ownProps: ICustomSettingsEditorProps): ICustomSettingsEditorProps => ({
    ...ownProps,

    changeItemDataProp: (item: cnt.ContentItem, prop: string, value: any) => dispatch(actions.changeItemDataProp(item, prop, value))
});

const CustomSettingsEditor: React.FC<ICustomSettingsEditorProps> = (props: ICustomSettingsEditorProps) => {
    if (props.content === null || props.content === undefined) return <></>;
    if (props.customType === null || props.customType === undefined) return <></>;

    return (
        <SettingsGroup title={props.title}>
        {
            createCustomSettings(props.content, props.customType, (prop: string, value) => {
                props.changeItemDataProp(props.content, prop, value);
            })
        }
        </SettingsGroup>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomSettingsEditor);