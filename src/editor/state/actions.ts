import * as React from 'react';

import * as itemTypes from '../content/itemTypes';
import * as content from '../content/content';


export enum EditMode {
    EDIT = 'EDIT',
    ADD = 'ADD',
    PREVIEW = 'PREVIEW'
}

/*****************
 * Actions
 *****************/

interface IActionType {
    type: string;

    [key: string]: any;
}

const EDITOR_UNDO = 'EDITOR_UNDO';
const EDITOR_SET_MODE = 'EDITOR_SET_MODE';
const EDITOR_TOGGLE_ADD_DRAWER = 'EDITOR_TOGGLE_ADD_DRAWER';
const EDITOR_START_MOVING_ITEM = 'EDITOR_START_MOVING_ITEM';
const EDITOR_STOP_MOVING_ITEM = 'EDITOR_STOP_MOVING_ITEM';
const EDITOR_DROP_NEW_ITEM = 'EDITOR_DROP_NEW_ITEM';
const EDITOR_SET_MOVING_ITEM = 'EDITOR_SET_MOVING_ITEM';
const EDITOR_ADD_EDIT_TARGET = 'EDITOR_ADD_EDIT_TARGET';
const EDITOR_REMOVE_EDIT_TARGET = 'EDITOR_REMOVE_EDIT_TARGET';
const EDITOR_CHANGE_ITEM_DATA = 'EDITOR_CHANGE_ITEM_DATA';
const EDITOR_CHANGE_ITEM_DATA_PROP = 'EDITOR_CHANGE_ITEM_DATA_PROP';
const EDITOR_SELECT_ITEM = 'EDITOR_SELECT_ITEM';
const EDITOR_DESELECT_ITEMS = 'EDITOR_DESELECT_ITEMS';
const EDITOR_CHANGE_ITEM_STYLE = 'EDITOR_CHANGE_ITEM_STYLE';
const EDITOR_DELETE_ITEM = 'EDITOR_DELETE_ITEM';
const EDITOR_MOVE_ITEM = 'EDITOR_MOVE_ITEM';
const EDITOR_CHANGE_ITEM_PARENT = 'EDITOR_CHANGE_ITEM_PARENT';
const EDITOR_TOGGLE_COLUMN_RESIZE = 'EDITOR_TOGGLE_COLUMN_RESIZE';


const EDITOR_UNDOABLE_ACTIONS = [
    EDITOR_DROP_NEW_ITEM,
    EDITOR_CHANGE_ITEM_DATA,
    EDITOR_CHANGE_ITEM_DATA_PROP,
    EDITOR_CHANGE_ITEM_STYLE,
    EDITOR_DELETE_ITEM,
    EDITOR_MOVE_ITEM,
    EDITOR_CHANGE_ITEM_PARENT
];

export const undo = (): IActionType => ({
    type: EDITOR_UNDO
});

export const setMode = (mode: EditMode): IActionType => ({
    type: EDITOR_SET_MODE,
    mode
});

export const toggleAddDrawer = (open: boolean): IActionType => ({
    type: EDITOR_TOGGLE_ADD_DRAWER,
    open
});


export const startMovingItem = (item: content.ContentItem) => ({
    type: EDITOR_START_MOVING_ITEM,
    item
});

export const stopMovingItem = () => ({
    type: EDITOR_STOP_MOVING_ITEM
});

export const dropNewItem = (item: content.ContentItem, target: content.ContainerItem): IActionType => ({
    type: EDITOR_DROP_NEW_ITEM,
    item,
    target
});

export const setMovingItem = (item: content.ContentItem): IActionType => ({
    type: EDITOR_SET_MOVING_ITEM,
    item
});

export const addEditTarget = (target: content.ContentItem): IActionType => ({
    type: EDITOR_ADD_EDIT_TARGET,
    target
});

export const removeEditTarget = (): IActionType => ({
    type: EDITOR_REMOVE_EDIT_TARGET
});

export const changeItemData = (item: content.ContentItem, newData: content.ContentData): IActionType => ({
    type: EDITOR_CHANGE_ITEM_DATA,
    item,
    newData
});

export const changeItemDataProp = (item: content.ContentItem, prop: string, value: any): IActionType => ({
    type: EDITOR_CHANGE_ITEM_DATA_PROP,
    item,
    prop,
    value
});

export const selectItem = (item: content.ContentItem): IActionType => ({
    type: EDITOR_SELECT_ITEM,
    item
});

export const deselectItems = (): IActionType => ({
    type: EDITOR_DESELECT_ITEMS
});

export const changeItemStyle = (item: content.ContentItem, newStyle: React.CSSProperties) => ({
    type: EDITOR_CHANGE_ITEM_STYLE,
    item,
    newStyle
});

export const deleteItem = (item: content.ContentItem) => ({
    type: EDITOR_DELETE_ITEM,
    item
});

export const moveItem = (item: content.ContentItem, position: number) => ({
    type: EDITOR_MOVE_ITEM,
    item,
    position
});

export const changeItemParent = (item: content.ContentItem, parent: content.ContainerItem, position: number) => ({
    type: EDITOR_CHANGE_ITEM_PARENT,
    item,
    parent,
    position
});

export const toggleColumnResize = (column: content.ContentItem) => ({
    type: EDITOR_TOGGLE_COLUMN_RESIZE,
    column
});


/*****************
 * State
 *****************/

export interface IEditorReduxState {
    editorMode: EditMode;
    editorAddDrawerOpen: boolean;

    movingItem: content.ContentItem;
    editTargets: content.ContentItem[];
    selectedItem: content.ContentItem;
    resizingColumn: content.ContentItem;

    content: content.ContentItem;

    undoableChanges: content.ContentItem[];
}

const defaultState: IEditorReduxState = {
    editorMode: EditMode.EDIT,
    editorAddDrawerOpen: false,

    editTargets: [],
    movingItem: null,
    selectedItem: null,
    resizingColumn: null,

    content: content.getDefaultContent(),

    undoableChanges: []
};

defaultState.undoableChanges.push(content.deepCopyWithNewId(defaultState.content));


// This runs before the actual reducer. The actual reducer takes the new state and makes some updates that always have to happen
const beforeEditorReducer = (state: IEditorReduxState = defaultState, action: IActionType): IEditorReduxState => {

    switch (action.type) {

        case EDITOR_UNDO: {

            if (state.undoableChanges.length > 0) {
                let lastChange = state.undoableChanges.pop();

                return {
                    ...state,

                    content: state.undoableChanges.length > 0 ? state.undoableChanges[state.undoableChanges.length - 1] : state.content, //lastChange,
                    undoableChanges: [...state.undoableChanges],
                    editTargets: []
                };
            } else {
                return state;
            }
        }

        case EDITOR_SET_MODE: {
            return {
                ...state,
                editorMode: action.mode as EditMode,
                movingItem: null,
                selectedItem: null
            };
        }

        case EDITOR_TOGGLE_ADD_DRAWER: {
            return {
                ...state,

                editorAddDrawerOpen: action.open as boolean
            };
        }

        case EDITOR_ADD_EDIT_TARGET: {
            return {
                ...state,

                editTargets: content.traceAncestors(action.target, true).reverse().filter(item => item.type.edittable)
            };
        }

        case EDITOR_REMOVE_EDIT_TARGET: {
            return {
                ...state,

                editTargets: state.editTargets.slice(0, state.editTargets.length - 1)
            };
        }

        case EDITOR_DROP_NEW_ITEM: {
            if (state.movingItem !== null && state.movingItem !== undefined) {

                let newContent = content.insertItem(state.content, action.item, action.target);

                return {
                    ...state,

                    content: newContent,
                    movingItem: null,

                    editTargets: content.traceAncestors(action.item, true).reverse()
                };

            } else {
                return {
                    ...state,

                    content: content.insertItem(state.content, action.item, action.target),
                    movingItem: null
                };
            }
        }

        case EDITOR_START_MOVING_ITEM: {
            return {
                ...state,

                movingItem: action.item as content.ContentItem
            };
        }

        case EDITOR_STOP_MOVING_ITEM: {
            return {
                ...state,

                movingItem: null,
                editTargets: []
            };
        }

        case EDITOR_CHANGE_ITEM_DATA: {
            return {
                ...state,

                content: content.updateItemData(state.content, action.item, action.newData),
            };
        }

        case EDITOR_CHANGE_ITEM_DATA_PROP: {
            return {
                ...state,

                content: content.updateItemDataProp(state.content, action.item, action.prop, action.value),
            }
        }

        case EDITOR_CHANGE_ITEM_STYLE: {
            return {
                ...state,

                content: content.updateItemStyle(state.content, action.item, action.newStyle)
            };
        }

        case EDITOR_SELECT_ITEM: {
            return {
                ...state,

                selectedItem: action.item
            };
        }

        case EDITOR_DESELECT_ITEMS: {
            return {
                ...state,

                selectedItem: null
            };
        }

        case EDITOR_DELETE_ITEM: {
            return {
                ...state,

                content: content.deleteItem(state.content, action.item),
                movingItem: null,
                selectedItem: null
            };
        }

        case EDITOR_MOVE_ITEM: {
            return {
                ...state,

                content: content.moveItem(state.content, action.item, action.position)
            };
        }

        case EDITOR_CHANGE_ITEM_PARENT: {
            let newContent = content.changeParent(state.content, action.item, action.parent, action.position);
            return {
                ...state,

                content: newContent,
                editTargets: content.traceAncestors(action.item, true).reverse()
            };
        }

        case EDITOR_TOGGLE_COLUMN_RESIZE: {
            return {
                ...state,

                resizingColumn: action.column
            };
        }

        default:
            return state;
    }

};


// The actual reducer
// Here we collect all the undoable changes
export const editorReducer = (state: IEditorReduxState = defaultState, action: IActionType): IEditorReduxState => {

    let newState = beforeEditorReducer(state, action);

    if (EDITOR_UNDOABLE_ACTIONS.includes(action.type)) {
        let undoableChanges = [...state.undoableChanges];
        undoableChanges.push(content.deepCopy(state.content));

        newState.undoableChanges = undoableChanges;
    }

    return newState;
};