import * as React from 'react';
import { connect } from 'react-redux';

import * as itemTypes from '../content/itemTypes';
import * as cnt from '../content/content';
import * as actions from '../state/actions';
import * as handles from '../ui/handles';

import '../../css/grid.css';


const resolveComponetEditStatus = (
    content: cnt.ContentItem,
    mode: actions.EditMode,
    editTargets: cnt.ContentItem[],
    movingItem: cnt.ContentItem,
    selectedItem: cnt.ContentItem,
    canDrop: boolean,
    isOver: boolean
): cnt.ComponentEditStatus => {
    
    let status: cnt.ComponentEditStatus = cnt.ComponentEditStatus.NONE;
    if (!content.type.edittable) return status;

    if (selectedItem == content) return cnt.ComponentEditStatus.SELECTED;
    if (movingItem == content) return cnt.ComponentEditStatus.BEING_MOVED;

    // If we are looking to drop an item somewhere we need to highlight if we can drop it there
    // We should also highlight and pad every parent item that we're hovering over to make selection easy
    if (mode == actions.EditMode.ADD || movingItem) {

        if (canDrop) {
            status = cnt.ComponentEditStatus.CAN_ACCEPT_DROP;

            if (isOver) {
                status = cnt.ComponentEditStatus.IS_OVER_DROP;
            }
        } else if (editTargets.includes(content)) {
            status = cnt.ComponentEditStatus.MOVING_ITEM;
        }

    } else if (editTargets.includes(content)) { // Show all items that we're currently over
        if (editTargets[editTargets.length - 1] == content) {
            status = cnt.ComponentEditStatus.HOVERING;
        } else {
            status = cnt.ComponentEditStatus.MOVING_ITEM;
        }
    }

    return status;
};

const StatusStyles: { [key: string]: React.CSSProperties } = {
    NONE: {
    },

    MOVING_ITEM: {
        outline: "1px dotted #888888",
    },
    
    CAN_ACCEPT_DROP: {
        outline: '1px dashed #305da6'
    },

    IS_OVER_DROP: {
        outline: '2px solid #305da6'
    },
    
    HOVERING: {
        outline: '1px solid #666666'
    },

    SELECTED: { 
        outline: '2px solid #5c90e6',
    },

    BEING_MOVED: {
        //opacity: 0,
        //boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.8)",
        //zIndex: 1000
    }
}


interface IComponentWrapperProps {
    component?: any;
    mode?: actions.EditMode;

    content?: cnt.ContentItem;
    editTargets?: cnt.ContentItem[];
    movingItem?: cnt.ContentItem;
    selectedItem?: cnt.ContentItem;
    position?: number;
    resizingColumn?: cnt.ContentItem;

    onDrop?: (item: cnt.ContentItem, target: cnt.ContainerItem, openDrawer: boolean)=>void;
    onStartMoving?: (item: cnt.ContentItem)=>void;
    onStopMoving?: ()=>void;

    onHover?: (item: cnt.ContentItem)=>void;
    onLeave?: ()=>void;

    onClick?: (item: cnt.ContentItem, selectedItem?: cnt.ContentItem)=>void;
    onDeselectItems?: ()=>void;

    onUpdateProp: (item: cnt.ContentItem, prop: string, value: any)=>void;

    onUpdatePosition: (item: cnt.ContentItem, position: number)=>void;
    onChangeParent: (item: cnt.ContentItem, parent: cnt.ContainerItem, position: number)=>void;

    [extraProps: string]: any;
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IComponentWrapperProps): IComponentWrapperProps => ({
    ...ownProps,
    
    mode: state.editorMode,
    editTargets: state.editTargets,
    movingItem: state.movingItem,
    selectedItem: state.selectedItem,
    resizingColumn: state.resizingColumn
});

const mapDispatchToProps = (dispatch, ownProps: IComponentWrapperProps): IComponentWrapperProps => ({
    ...ownProps,

    onDrop: (item, target, openDrawer) => {
        dispatch(actions.dropNewItem(item, target));
        dispatch(actions.toggleAddDrawer(openDrawer));
        dispatch(actions.stopMovingItem());
    },

    onStartMoving: item => dispatch(actions.startMovingItem(item)),
    onStopMoving: () => dispatch(actions.stopMovingItem()),

    onHover: item => dispatch(actions.addEditTarget(item)),
    onLeave: () => dispatch(actions.removeEditTarget()),

    onClick: (item, selected) => {

        if (item == selected) {
            dispatch(actions.deselectItems());
        } else {
            dispatch(actions.selectItem(item));
        }
    },
    onDeselectItems: () => dispatch(actions.deselectItems()),

    onUpdateProp: (item, prop, value) => dispatch(actions.changeItemDataProp(item, prop, value)),

    onUpdatePosition: (item, position) => dispatch(actions.moveItem(item, position)),
    onChangeParent: (item, parent, position) => dispatch(actions.changeItemParent(item, parent, position))
});


let domObjectCache: { [key: string]: HTMLElement } = {};
const getDOMElemById = (id: string): HTMLElement => {
    let cached = domObjectCache[id];
    if (cached === undefined) {
        cached = document.getElementById(id);
        domObjectCache[id] = cached;
    }

    return cached;
};

const PureComponentWrapper: React.FC<IComponentWrapperProps> = props => {

    // Unpack props and get actual props given to component
    const {
        component,
        mode,
        content,
        position,
        editTargets,
        movingItem,
        selectedItem,
        resizingColumn,

        onDrop,
        onStartMoving,
        onStopMoving,
        onSetEditStatus,
        onHover,
        onLeave,
        onClick,
        onDeselectItems,
        onUpdateProp,
        onUpdatePosition,
        onChangeParent,
        
        children,
        ...compProps
    } = props;

    // React wants capitalised components
    let Component = component;


    // Check what item types we can drop into this
    let itemType = content.type;
    let validChildrenIds = itemTypes.resolveValidChildren(itemType).map(type => type.id);

    // State
    const [state, setState] = React.useState({
        draggable: false,
        visible: true,
        canDrop: false,
        isOver: false
    });

    let isHovered = (mode == actions.EditMode.EDIT || mode == actions.EditMode.ADD) && editTargets[editTargets.length - 1] == content && (!movingItem || movingItem == content);
    

    // Drag-and-drop properties
    let dragProps = {
        draggable: state.draggable,

        onDragStart: event => {
            event.stopPropagation();

            if (!movingItem) {
                onStartMoving(content);

                // Hack to hide element
                setTimeout(function() {
                    setState({...state, visible: false});
                }, 1);
            }
        },

        onDragEnd: event => {
            event.stopPropagation();

            setState({...state, draggable: false});

            onStopMoving();

            // Hack to show element
            setTimeout(function() {
                setState({...state, visible: true});
            }, 1);
        },

        onDragLeave: event => {
            setState({...state, isOver: false, canDrop: false});
        },

        /*onDragEnter: event => {
            let isValid = validChildrenIds.includes(movingItem.type.id);

            if (isValid) {
                event.preventDefault();
                event.stopPropagation();

                if (movingItem.parent && movingItem.parent != content && !cnt.isAncestor(content, movingItem)) {
                    onChangeParent(movingItem, content as cnt.ContainerItem, 0);
                    //delete domObjectCache[movingItem.id];
                }
            }
        },*/

        onDragOver: event => {
            event.preventDefault();

            let isValid = validChildrenIds.includes(movingItem.type.id);

            if (isValid) {
                event.stopPropagation();
                setState({...state, isOver: true, canDrop: true});

                // Get mouse position
                event = event || window.event;
                let mouseX = event.pageX;
                let mouseY = event.pageY;

                // If we're near the bottom or top of the page while dragging scroll to accommodate
                let relativeMouseY = mouseY - window.scrollY;
                if (relativeMouseY > window.innerHeight - 100) {
                    window.scrollBy(0, 5);
                } else if (relativeMouseY < 100) {
                    window.scrollBy(0, -5);
                }

                // The position of the moving item
                const movingPosition = movingItem.position;

                // Loop over children and figure out if the dragged item is above/below (or left/right)
                // and rearrange accordingly
                let children = (content as cnt.ContainerItem).children;
                for (let child of children) {
                    if (child !== movingItem) {

                        // Don't replace item with itself
                        if (child.position === movingPosition) continue;

                        // Get child rectangle
                        let cached = getDOMElemById(child.id);
                        const hoverBoundingRect = cached.getBoundingClientRect();
                        let hoverBoundingTop = hoverBoundingRect.top + window.scrollY;
                        let hoverBoundingBottom = hoverBoundingRect.bottom + window.scrollY;

                        // Get middle
                        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
                        const hoverMiddleY = (hoverBoundingBottom - hoverBoundingTop) / 2;

                        // Get pixels to the top/left corner
                        const hoverClientX = mouseX - hoverBoundingRect.left;
                        const hoverClientY = mouseY - hoverBoundingTop;

                        // Special case where items have the same parent
                        if (content == movingItem.parent) {

                            // Vertically and horizontally aligned components must be treated differently
                            if (child.type.id == "column") {
                                if (movingPosition < child.position && hoverClientX < hoverMiddleX) continue;
                                if (movingPosition > child.position && hoverClientX > hoverMiddleX) continue;
                            } else {
                                if (movingPosition < child.position && hoverClientY < hoverMiddleY) continue;
                                if (movingPosition > child.position && hoverClientY > hoverMiddleY) continue;
                            }

                            onUpdatePosition(movingItem, child.position);
                        }

                    }
                }

            } else {
                setState({...state, isOver: false, canDrop: false});
            }
        },

        onDrop: event => {
            let isValid = validChildrenIds.includes(movingItem.type.id) && movingItem != content && !cnt.isAncestor(content, movingItem);

            setState({...state, canDrop: false, isOver: false});

            if (isValid) {
                if (!movingItem.parent || movingItem.parent.id != content.id) {
                    onDrop(
                        movingItem,
                        content as cnt.ContainerItem,
                        mode == actions.EditMode.ADD
                    );
                    delete domObjectCache[movingItem.id];
                }

                event.stopPropagation();
            } else {
                event.preventDefault();
            }
        }
    }

    // Get current edit status
    let editStatus = resolveComponetEditStatus(content, mode, editTargets, movingItem, selectedItem, state.canDrop, state.isOver);

    // Extract style from component properties
    const { style, ...extraProps } = compProps;
    let statusStyle = StatusStyles[editStatus];

    // Combine given styles and wrapper styles
    let compStyle: React.CSSProperties = {
        ...style,
        ...statusStyle,

        boxSizing: "border-box",
        MozBoxSizing: "border-box",
        WebkitBoxSizing: "border-box",
        
        opacity: state.visible ? 1 : 0,
        position: "relative"    // Needed for overlay handles,
    };

    // Add props back in
    extraProps["style"] = compStyle;
    extraProps["id"] = content.id;

    // Event handlers
    let eventHandlers = {

        onClick: event => {
            event.stopPropagation();
            
            if (mode == actions.EditMode.EDIT && content.type.edittable) {
                onClick(content, selectedItem);
            }
        },

        onMouseEnter: () => {
            if (mode == actions.EditMode.EDIT && !resizingColumn) {
                onHover(content);
            }
        },
        
        onMouseLeave: () => {
            if (mode == actions.EditMode.EDIT && !resizingColumn) {
                onLeave();
            }
        }
    };

    // Drag & info handles
    let contentHandles = (
        <>
            {/*state.isOver && state.canDrop && (
                <handles.DescriptorHandle item={content} />
            )*/}
            {isHovered && (
                <handles.DragHandle
                    item={content}
                    pushDown={getDOMElemById(content.id).getBoundingClientRect().top <= 0}

                    onMouseDown={() => {
                        setState({...state, draggable: true});
                    }}

                    onMouseUp={() => {
                        setState({...state, draggable: false});
                    }}

                    onSelectParent={() => {
                        onLeave();
                    }}
                />
            )}
        </>
    );


    // If in preview mode just render the element as it's supposed to look
    if (mode == actions.EditMode.PREVIEW) {
        return <Component {...compProps} style={compStyle}>{children}</Component>;
    } else {

        // It's not possible to insert the drag and info handles into non-container tags so we have to wrap them
        if (!cnt.isContainer(content)) {
            return (
                <div {...eventHandlers} {...dragProps} style={compStyle}>
                    <Component {...extraProps}>
                        {children}
                    </Component>

                    {contentHandles}
                </div>
            );
        } else {
            return (
                <Component {...extraProps} {...dragProps} {...eventHandlers}>
                    {children}
                    {contentHandles}
                </Component>
            );
        }

    }

};

const ComponentWrapper = connect(mapStateToProps, mapDispatchToProps)(PureComponentWrapper);

export default ComponentWrapper;