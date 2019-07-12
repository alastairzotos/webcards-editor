import * as React from 'react';
import { connect } from 'react-redux';

import * as content from '../../content/content';
import * as actions from '../../state/actions';

import BaseSettingsEditor from './baseSettingsEditor';
import getDOMAttributes from './getDomAttributes';

interface IItemSettingsEditorProps {
    open?: boolean;
    selectedItem?: content.ContentItem;

    onChangeStyle?: (item: content.ContentItem, style: React.CSSProperties)=>void;
}

interface IItemSettingsEditorState {
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IItemSettingsEditorProps) => ({
    ...ownProps,

    selectedItem: state.selectedItem,
    open: state.selectedItem !== null
});

const mapDispatchToProps = (dispatch, ownProps: IItemSettingsEditorProps) => ({
    ...ownProps,

    onChangeStyle: (item, style) => dispatch(actions.changeItemStyle(item, style))
});


class ItemSettingsEditor extends React.Component<IItemSettingsEditorProps, IItemSettingsEditorState> {
    constructor(props: IItemSettingsEditorProps) {
        super(props);

        this.state = {};
    }

    render() {
        let domAttributes = this.props.selectedItem ? getDOMAttributes(document.getElementById(this.props.selectedItem.id)) : null;
        let style = domAttributes ? {...domAttributes.style, ...this.props.selectedItem.data.style} : null;

        return (
            <BaseSettingsEditor
                open={this.props.open}
                style={style}
                includeCustomSettingsEditor
                onStyleChanged={style => {
                    this.props.onChangeStyle(this.props.selectedItem, style)
                }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemSettingsEditor);