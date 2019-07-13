import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from './state/actions';
import * as content from './content/content';
import Generator from './render/generator';
import PageEditor from './editor';

import ActionPicker from './ui/actionPicker';
import Trash from './ui/trash';
import AddItemDrawer from './ui/addItemDrawer';
import TextSettingsEditor from './ui/textSettingsEditor';
import ItemSettingsEditor from './ui/settings/itemSettingsEditor';
import Resizer from './ui/resizer';


interface IPageEditorScreenProps {
    content: content.ContentItem;
    editTargets: content.ContentItem[];
    resizingColumn: content.ContentItem;
    
    generator: Generator;

    onClickBody?: ()=>void;
    stopColumnResize: ()=>void;

    resizeColumn: (column: content.ContentItem, span: number)=>void;
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IPageEditorScreenProps) => ({
    ...ownProps,

    content: state.content,
    editTargets: state.editTargets,
    
    resizingColumn: state.resizingColumn,

    generator: ownProps.generator
});

const mapDispatchToProps = (dispatch, ownProps: IPageEditorScreenProps) => ({
    ...ownProps,

    onClickBody: () => dispatch(actions.deselectItems()),
    stopColumnResize: () => dispatch(actions.toggleColumnResize(null)),

    resizeColumn: (column, span) => dispatch(actions.changeItemData(column, { span: span, className: "col-" + span, style: { ...column.data.style } }))
});


let domCache: { [key: string]: HTMLElement } = {};
const getDomElement = (id: string): HTMLElement => {
    let elem = domCache[id];
    if (elem === undefined) {
        elem = document.getElementById(id);
        domCache[id] = elem;
    }

    return elem;
};

// Gets column rect relative to body
type Rect = { top: number, bottom: number, left: number, right: number, width: number, height: number };
const getColumnRect = (page: content.ContentItem, columnDOM: HTMLElement): Rect => {
    let boundingRect = columnDOM.getBoundingClientRect();
    let pageDom = getDomElement(page.id).getBoundingClientRect();

    return {
        top: boundingRect.top - pageDom.top,
        bottom: boundingRect.bottom - pageDom.top,
        left: boundingRect.left - pageDom.left,
        right: boundingRect.right - pageDom.left,
        width: boundingRect.width,
        height: boundingRect.height
    };
};



const PurePageEditorScreen: React.FC<IPageEditorScreenProps> = props => {

    window.onclick = event => {
        event.stopPropagation();
        props.onClickBody();
    };


    // Column resizing state
    type IEditorScreenState = {
        hoverColumn: content.ContentItem,
        hoverColumnDom: HTMLElement,
        hoverColumnDomRect: Rect,
        visible: boolean
    };

    const [state, setState] = React.useState<IEditorScreenState>({
            hoverColumn: null,
            hoverColumnDom: null,
            hoverColumnDomRect: null,
            visible: false
        });

    let nearestColumn = props.editTargets.slice().reverse().find(cnt => cnt.type.id == "column");
    let currentColumn = nearestColumn;

    if (nearestColumn) {
        let currentEditDom = getDomElement(nearestColumn.id);
        let nearestColumnDom = currentEditDom;
        let domRect = nearestColumnDom.getBoundingClientRect();

        // Select "left" or "right" of the column
        // In reality if selecting the left we're selecting the right of the previous column
        nearestColumnDom.onmousemove = event => {
            event = (event || window.event) as any;
            let mouseX = event.pageX - domRect.left;

            if (mouseX < domRect.width / 2 && currentColumn.position > 0) {
                nearestColumn = currentColumn.parent.children.find(col => col.position == currentColumn.position - 1);
                currentEditDom = getDomElement(nearestColumn.id);
            } else {
                nearestColumn = currentColumn;
                currentEditDom = nearestColumnDom;
            }

            if (nearestColumn != state.hoverColumn) {
                setState({
                    ...state,
    
                    hoverColumn: nearestColumn,
                    hoverColumnDom: currentEditDom,
                    hoverColumnDomRect: getColumnRect(props.content, currentEditDom),
                    visible: true
                });
            } else if (!state.visible) {
                setState({...state, visible: true});
                domCache = {};
            }
        };
    } else {
        if (state.visible && props.editTargets.length > 0) {
            setState({ ...state, visible: false });
            domCache = {};
        }
    }

    // Resizer events
    window.onmouseup = event => {
        event.stopPropagation();
        props.stopColumnResize();

        document.body.style.cursor = "default";

        domCache = {};
    };
    window.onmousemove = event => {
        if (props.resizingColumn) {
            event.preventDefault();

            let row = props.resizingColumn.parent as content.ContainerItem;

            let columnDom = getDomElement(props.resizingColumn.id);
            let rowDom = getDomElement(row.id);


            // Get position of column
            let clientRect = columnDom.getBoundingClientRect();

            // Get mouse position relative to left side (equates roughly to new width)
            event = (event || window.event) as any;
            let relativeMouseX = event.pageX - clientRect.left;

            // Get new width as a proportion of row width
            let widthPerc = relativeMouseX / rowDom.getBoundingClientRect().width;

            // Get current span and calculate the new span
            let currentSpan = props.resizingColumn.data.span;
            let newSpan = Math.round(widthPerc * 12);

            props.resizeColumn(props.resizingColumn, newSpan);

            // If this is not the last child then expand the next column
            if (props.resizingColumn.position < row.children.length - 1) {
                let nextColumn = row.children.find(col => col.position == props.resizingColumn.position + 1);

                if (nextColumn) {
                    let spanDiff = newSpan - currentSpan;

                    let nextNewSpan = nextColumn.data.span - spanDiff;
                    if (nextNewSpan >= 1 && nextNewSpan <= 12)
                        props.resizeColumn(nextColumn, nextNewSpan);
                }
            }

            domCache = {};
            let hoverColumn = getDomElement(props.resizingColumn.id);
            setState({
                ...state,

                hoverColumnDom: hoverColumn,
                hoverColumnDomRect: getColumnRect(props.content, hoverColumn),
                visible: true
            });
        }
    }

    return (
        <>
            <AddItemDrawer />
            <TextSettingsEditor />

            <ItemSettingsEditor />

            <div style={{ position: "relative" }}>
                {props.generator.generate(props.content)}

                {(state.hoverColumn || props.resizingColumn) && (
                    <Resizer
                        hoverColumn={state.hoverColumn}
                        hoverColumnDom={state.hoverColumnDom}
                        hoverColumnDomRect={state.hoverColumnDomRect}
                        visible={state.visible}
                    />
                )}
            </div>

            <ActionPicker />
            <Trash />
        </>
    );
};

const PageEditorScreen = connect(mapStateToProps, mapDispatchToProps)(PurePageEditorScreen);

export default PageEditorScreen;

