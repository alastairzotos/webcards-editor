import * as React from 'react';
import { connect } from 'react-redux';

import { Zoom, Fab } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { green, grey } from '@material-ui/core/colors';

import * as actions from '../state/actions';
import * as cnt from '../content/content';
import * as itemTypes from '../content/itemTypes';


interface ITrashProps {
    movingItem: cnt.ContentItem;

    onDrop: (item: cnt.ContentItem)=>void;
}

const mapStateToProps = (state: actions.IEditorReduxState, ownProps: ITrashProps) => ({
    ...ownProps,

    movingItem: state.movingItem
});

const mapDispatchToProps = (dispatch, ownProps: ITrashProps) => ({
    ...ownProps,

    onDrop: (item) => {
        dispatch(actions.deleteItem(item));
        dispatch(actions.stopMovingItem());
    }
});


const transitionDuration = {
    enter: 200,
    exit: 200,
};

const Trash: React.FC<ITrashProps> = (props: ITrashProps) => {

    const [state, setState] = React.useState({ depth: 0 });

    return (
        <Zoom
            in={props.movingItem !== null}
            timeout={transitionDuration}
            style={{
                transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
        >
            <Fab
                onDragEnter={event => {
                    event.preventDefault();
                    setState({...state, depth: state.depth + 1});
                }}

                onDragLeave={event => {
                    setState({...state, depth: state.depth - 1});
                }}

                onDragOver={event => {
                    event.preventDefault();
                }}

                onDrop={event => {
                    event.stopPropagation();

                    if (props.movingItem) {
                        props.onDrop(props.movingItem);
                        setState({...state, depth: 0});
                    }
                }}

                style={{
                    position: 'fixed',
                    bottom: 10,
                    left: "calc(50% + 28px)",
                    backgroundColor: (state.depth > 0) ? green[500] : grey[100]
                }}
            >
                <Icons.Delete />
            </Fab>
        </Zoom>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Trash);