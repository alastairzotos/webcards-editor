import * as React from 'react';
import { connect } from 'react-redux';

import * as Mui from '@material-ui/core';
import * as Icons from '@material-ui/icons';


import * as itemTypes from '../content/itemTypes';
import * as content from '../content/content';
import * as actions from '../state/actions';
import DrawerItem from './drawerItem';

import EditorHTMLGenerator from '../render/editorHtmlGenerator';



interface IAddItemDrawerProps {
    open?: boolean;
    mode: actions.EditMode;
    movingItem: content.ContentItem;

    onClose: ()=>void;
    setMode: (mode: actions.EditMode)=>void;
    startMovingItem: (item: content.ContentItem)=>void;
}

interface IAddItemDrawerState {

}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IAddItemDrawerProps): IAddItemDrawerProps => ({
    ...ownProps,

    open: state.editorAddDrawerOpen,
    mode: state.editorMode,
    movingItem: state.movingItem
});

const mapDispatchToProps = (dispatch, ownProps: IAddItemDrawerProps): IAddItemDrawerProps => ({
    ...ownProps,

    onClose: () => dispatch(actions.toggleAddDrawer(false)),
    setMode: (mode: actions.EditMode) => dispatch(actions.setMode(mode)),
    startMovingItem: (item: content.ContentItem) => dispatch(actions.startMovingItem(item))
});


class PureAddItemDrawer extends React.Component<IAddItemDrawerProps, IAddItemDrawerState> {
    private _generator = new EditorHTMLGenerator();

    private _defaultItems: { [key: string]: content.ContentItem };

    constructor(props: IAddItemDrawerProps) {
        super(props);

        this.state = {};

        this._defaultItems = {};

        itemTypes.ItemTypesArray.map(type => {
            this._defaultItems[type.id] = content.generateDefault(type.id);
        });
    }

    /*handleDrag = (itemType: itemTypes.ItemType) => {
        this.props.onClose();
    };*/

    handleDrag = (item: content.ContentItem) => {
        this.props.startMovingItem(item);
        this.props.onClose();
    };

    render() {

        return (
            <Mui.Drawer
                anchor="left"
                open={this.props.open}
                onClose={() => {
                    this.props.onClose();
                    this.props.setMode(actions.EditMode.EDIT);
                }}

            >
                <div style={{width: "240px"}}>
                {
                    itemTypes.ItemTypeCategories.map(category => {
                        if (category.name == "_hidden") return <React.Fragment key={category.name} />;

                        return (
                            <Mui.ExpansionPanel key={category.name}>
                                <Mui.ExpansionPanelSummary
                                    id={category.name}
                                    expandIcon={<Icons.ExpandMore />}
                                >
                                    <Mui.Typography style={{ fontSize: "15px" }}>{category.name}</Mui.Typography>
                                </Mui.ExpansionPanelSummary>
                                <Mui.ExpansionPanelDetails>
                                    <Mui.List dense style={{ width: "100%" }}>
                                    {
                                        category.types.map((type, index) => (
                                            <DrawerItem itemType={type} key={index} />
                                        ))
                                    }
                                    </Mui.List>
                                </Mui.ExpansionPanelDetails>
                            </Mui.ExpansionPanel>
                        );
                    })
                }
                </div>
            </Mui.Drawer>
        );

    }
}


const AddItemDrawer = connect(mapStateToProps, mapDispatchToProps)(PureAddItemDrawer);

export default AddItemDrawer;