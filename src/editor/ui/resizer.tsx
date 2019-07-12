import * as React from 'react';
import { connect } from 'react-redux';

import * as content from '../content/content';
import * as actions from '../state/actions';

type Rect = { top: number, bottom: number, left: number, right: number, width: number, height: number };

interface IResizerProps {
    visible: boolean;
    hoverColumn: content.ContentItem;
    hoverColumnDom: HTMLElement;
    hoverColumnDomRect: Rect;

    resizingColumn: content.ContentItem;

    startColumnResize: (column: content.ContentItem)=>void;
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IResizerProps) => ({
    ...ownProps,

    resizingColumn: state.resizingColumn
});

const mapDispatchToProps = (dispatch, ownProps: IResizerProps) => ({
    ...ownProps,

    startColumnResize: column => dispatch(actions.toggleColumnResize(column))
});


class Resizer extends React.Component<IResizerProps> {
    constructor(props: IResizerProps) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    position: "absolute",
    
                    top: this.props.hoverColumnDomRect.top,
                    left: this.props.hoverColumnDomRect.right - 1,
    
                    width: "2px",
                    height: this.props.hoverColumnDomRect.height,
    
                    cursor: "col-resize",
                    backgroundColor: this.props.resizingColumn == this.props.hoverColumn ? "rgb(100, 100, 100)" : "black",
    
                    opacity: this.props.visible ? 1 : 0
                }}
    
                onMouseEnter={event => {
                    event.preventDefault();
                }}
    
                onMouseDown={event => {
                    event.preventDefault();
                    this.props.startColumnResize(this.props.hoverColumn);
    
                    document.body.style.cursor = "col-resize";
                }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resizer);