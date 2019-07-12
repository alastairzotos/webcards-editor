import * as React from 'react';
import { connect } from 'react-redux';
import * as content from '../content/content';
import * as itemTypes from '../content/itemTypes';
import * as actions from '../state/actions';

import * as Mui from '@material-ui/core';
import * as Icons from '@material-ui/icons';

interface IDrawerItemProps {
    itemType: itemTypes.ItemType;

    onDragStart: (item: content.ContentItem)=>void;
    onCloseDrawer: ()=>void;
}

const mapDispatchToProps = (dispatch, ownProps: IDrawerItemProps) => ({
    ...ownProps,

    onDragStart: item => dispatch(actions.startMovingItem(item)),
    onCloseDrawer: () => dispatch(actions.toggleAddDrawer(false))
});


const DrawerItem: React.FC<IDrawerItemProps> = (props) => {

    const [state, setState] = React.useState({ draggable: false });

    return (
        <div
            draggable={state.draggable}

            onDragStart={event => {
                event.stopPropagation();

                props.onCloseDrawer();
                props.onDragStart(content.generateDefault(props.itemType.id));
            }}

            onDragEnd={event => {
                setState({draggable: false});
            }}
        >
            <Mui.ListItem>
                <Mui.ListItemText primary={props.itemType.name} />
                <Mui.ListItemSecondaryAction>
                    <Mui.Tooltip title={props.itemType.desc} placement="right">
                        <Icons.DragHandle
                            fontSize="small"
                            
                            onMouseDown={() => { setState({...state, draggable: true}); }}
                            onMouseUp={() => { setState({...state, draggable: false}); }}

                            style={{
                                cursor: "all-scroll"
                            }}
                        />
                    </Mui.Tooltip>

                </Mui.ListItemSecondaryAction>
            </Mui.ListItem>
        </div>
        
    );

};

export default connect(null, mapDispatchToProps)(DrawerItem);