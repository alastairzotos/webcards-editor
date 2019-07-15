import { CSSProperties, Component } from 'react';
import * as uuid from 'uuid';

import * as itemTypes from './itemTypes';

export enum ComponentEditStatus {
    NONE = 'NONE',
    MOVING_ITEM = 'MOVING_ITEM',
    CAN_ACCEPT_DROP = 'CAN_ACCEPT_DROP',
    IS_OVER_DROP = 'IS_OVER_DROP',
    HOVERING = 'HOVERING',
    SELECTED = 'SELECTED',
    BEING_MOVED = 'BEING_MOVED'
}

export type IOneToTwelve = 1|2|3|4|5|6|7|8|9|10|11|12;

/**
 * Data associated with a content item. This includes style attributes and any other custom data
 */
export interface ContentData {
    style: CSSProperties;

    [key: string]: any;
}

/**
 * A content item to be rendered.
 */
export interface ContentItem {
    id: string;
    type: itemTypes.ItemType;
    parent: ContainerItem;
    position: number;

    data: ContentData;
}

/**
 * Just like ContentItem but can have children too
 */
export interface ContainerItem extends ContentItem {
    children: ContentItem[];
}


/********************************
 * Content creation utilities
 ********************************/

/**
 * Utility to create a content item
 * @param type The id of the ItemType
 * @param data Any associated data the item needs, including styling attributes
 */
export const createContentItem = (type: string, data: ContentData): ContentItem => ({
    id: uuid(),
    type: itemTypes.ItemTypes[type],
    data: data,
    parent: null,
    position: 0
});

/**
 * Utility to create a container
 * @param type The id of the ItemType
 * @param data Any associated data the item needs, including styling attributes
 * @param children An array of ContentItems
 */
export const createContainerItem = (type: string, data: ContentData, children: ContentItem[]): ContainerItem => {
    
    if (children === undefined) children = [];

    let item = {
        id: uuid(),
        type: itemTypes.ItemTypes[type],
        data: data,
        children: children,
        parent: null,
        position: 0
    };

    children.forEach((child, index) => { child.parent = item; child.position = index; });

    return item;
};


/**
 * Generates the default content for an ItemType, identified by 'type'.
 * If the type can't be found, returns null
 * @param type The id of the ItemType
 * @param options Any associated data the item needs, including styling attributes
 * @param children An array of ContentItems[]
 */
export const generateDefault = (type: string, options?: ContentData, children?: ContentItem[]): ContentItem => {
    if (itemTypes.ItemTypes[type] !== undefined)
        return itemTypes.ItemTypes[type].generateDefault(children, options);
    
    return null;
};


/**
 * Generates a text item
 * @param text The text value
 * @param options Optional. The variant of the text (h1, p, etc) and any styles
 */
export const generateText = (text: string, options?: { variant?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span', style?: CSSProperties }): ContentItem => {

    return generateDefault("text", {
        ...({
            text: text,
            variant: "p",
            style: {}
        }),

        ...options
    });

};


/**
 * Generates a generic container
 * @param children The children of the container
 * @param options Any additional options, including styling attributes
 */
export const generateContainer = (children: ContentItem[], options?: ContentData): ContainerItem => {
    return generateDefault("container", options, children) as ContainerItem;
};


/**
 * Generates a row
 * @param children The columns in the row
 */
export const generateRow = (children?: ContainerItem[]): ContainerItem => {
    return generateDefault("row", null, children) as ContainerItem;
};

/**
 * Generates a column
 * @param span The span of the column (1 to 12)
 * @param children The children of the column
 */
export const generateColumn = (span: IOneToTwelve, children?: ContentItem[]): ContainerItem => {
    return createContainerItem("column", { span: span, className: "col-" + span, style: { padding: "10px" } }, children) as ContainerItem;
};


/**
 * Creates a row prepopulated with a set of columns
 * @param columns An array of column settings. 'span' = a number between 1 and 12. 'children' = the children in the column
 * @param fillRest Optional. If true fills the rest of the containing row with a column to create a total span of 12
 */
export const generateColumns = (columns: { span: IOneToTwelve, children?: ContentItem[] }[], fillRest?: boolean): ContainerItem => {

    let totalSpan = 0;
    let children = columns.map(col => {
        totalSpan += col.span;
        return generateColumn(col.span, col.children);
    });

    if (fillRest === true) {
        if (totalSpan < 12) {
            children.push(generateColumn(12 - totalSpan as any, []));
        }
    }

    return generateRow(children);
};



/********************************
 * Query utilities
 ********************************/


/**
 * Returns a content item identified by 'id' or null if none is found
 * Checking starts from the 'root' item provided
 * @param root The root element to start checking from
 * @param id The id of the content item we wish to find
 */
export const getContentById = (root: ContentItem, id: string): ContentItem => {
    if (root.id == id) return root;

    if (isContainer(root)) {
        let container = root as ContainerItem;

        for (let child of container.children) {
            let found = getContentById(child, id);
            if (found) return found;
        }
    }

    return null;
};

/**
 * Retrieves a list of parent elements from an item all the way to the root
 * @param item The item whose ancestors we want to retrieve
 * @param includeThis Include the provided item in the resulting array
 */
export const traceAncestors = (item: ContentItem, includeThis: boolean = true): ContentItem[] => {
    let ancestors = [];

    let cur = includeThis ? item : item.parent;
    while (cur) {
        ancestors.push(cur);

        cur = cur.parent;
    }

    return ancestors;
};


/**
 * Checks if a content item is a container or not
 * @param content The item to check
 */
export const isContainer = (content: ContentItem): boolean => (content as ContainerItem).children !== undefined;


/**
 * Checks if an item is the ancestor of another item
 * @param item The descendant
 * @param potentialAncestor The item that may or may not be the ancestor of the descendant
 */
export const isAncestor = (item: ContentItem, potentialAncestor: ContentItem): boolean => {
    let cur = item.parent;
    while (cur) {
        if (cur == potentialAncestor)
            return true;

        cur = cur.parent;
    }

    return false;
};


/**
 * Checks if an item has a child with an id. Returns false if the item is not a container
 * @param content The item to check
 * @param id The id of the child
 */
export const hasChildWithId = (content: ContentItem, id: string) => {
    if (!isContainer(content)) return false;

    let container = content as ContainerItem;
    return container.children.filter(child => child.id == id).length > 0;
};



/********************************
 * Copying utilities
 ********************************/


/**
 * Creates a deep copy of a content item, including all checking, content data and styles
 * @param content The content to copy
 */
export const deepCopy = (content: ContentItem): ContentItem => {
    if ((content as ContainerItem).children !== undefined) {
        let container = content as ContainerItem;

        return {
            ...container,
            children: container.children.map(child => deepCopy(child)),
            data: {
                ...container.data,

                style: {
                    ...container.data.style
                }
            }
        } as ContainerItem;
    }

    return {
        ...content,

        data: {
            ...content.data,

            style: {
                ...content.data.style
            }
        }
    };
};


/**
 * Same as deepCopy() but also generates new IDs for every item
 * This is useful if you want to render something twice without having two items with the same ID on the page
 * @param content The content to copy
 */
export const deepCopyWithNewId = (content: ContentItem): ContentItem => {

    if ((content as ContainerItem).children !== undefined) {
        let container = content as ContainerItem;

        return {
            ...container,
            id: uuid(),

            children: container.children.map(child => deepCopyWithNewId(child))
        } as ContainerItem;
    }

    return {
        ...content,

        id: uuid()
    };

};




/********************************
 * Update utilities
 ********************************/


const updateChildrenPositions = (container: ContainerItem) => {
    container.children.forEach((child, index) => {
        child.position = index;
    });
};


/**
 * Inserts an item into a target container. If the item already has a parent is it detatched from it first.
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item we wish to insert
 * @param target The target container to insert the item into
 */
export const insertItem = (currentContent: ContentItem, item: ContentItem, target: ContainerItem) => {
    if (item.parent) {
        item.parent.children = item.parent.children.filter(child => child.id != item.id);
        updateChildrenPositions(item.parent);
    }

    item.parent = target;
    target.children.push(item);
    updateChildrenPositions(target);

    if (isAncestor(item, item)) {
        debugger;
    }

    return {...currentContent};
};


/**
 * Moves an item off its current parent and onto a target container, and places it in a 0-based position relative to
 * its new siblings.
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item we want to move
 * @param parent The target parent we want to move to
 * @param position The (0-based) position of the item relative to the other items
 */
export const changeParent = (currentContent: ContentItem, item: ContentItem, parent: ContainerItem, position: number) => {
    if (item.parent) {
        item.parent.children = item.parent.children.filter(child => child.id != item.id);
        updateChildrenPositions(item.parent);
    }

    item.parent = parent;
    if (parent.children && parent.children.length > 0) {
        parent.children.splice(position, 0, item);
    } else {
        parent.children.push(item);
    }
    updateChildrenPositions(parent);

    if (isAncestor(item, item)) {
        debugger;
    }

    return {...currentContent};
};


/**
 * Moves an item to a new position relative to its siblings within its current parent container.
 * All other sibling positions are updated.
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item to move
 * @param position The new (0-based) position to move to
 */
export const moveItem = (currentContent: ContentItem, item: ContentItem, position: number) => {

    if (item.parent) {
        item.parent.children.splice(item.position, 1);
        item.parent.children.splice(position, 0, item);

        updateChildrenPositions(item.parent);
    }

    if (isAncestor(item, item)) {
        debugger;
    }

    return {...currentContent};
};


/**
 * Deletes an item and removes it from its parent container
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item to delete
 */
export const deleteItem = (currentContent: ContentItem, item: ContentItem) => {

    if (item.parent) {
        item.parent.children = item.parent.children.filter(child => child.id != item.id);
        updateChildrenPositions(item.parent);

        item.parent = null;
    }

    return {...currentContent};
};


/**
 * Updates the ContentData of an item, preserving any existing data unless overridden by new data.
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item whose data we're updating
 * @param data The updated ContentData props
 */
export const updateItemData = (currentContent: ContentItem, item: ContentItem, data: ContentData) => {
    item.data = {
        ...item.data,
        ...data
    };

    return {...currentContent};
};


/**
 * Updates a single property in an item's data
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item whose data we're updating
 * @param prop The name of the data property to update
 * @param value The new value of the data property
 */
export const updateItemDataProp = (currentContent: ContentItem, item: ContentItem, prop: string, value: any) => {
    let propData = {};
    propData[prop] = value;

    item.data = {
        ...item.data,
        ...propData
    };

    return {...currentContent };
};


/**
 * Updates an item's style, preserving any existing styles unless overridden
 * Returns a copy of the 'currentContent' argument
 * @param currentContent A reference to the root of the whole document
 * @param item The item whose style we're updating
 * @param style The styles to apply
 */
export const updateItemStyle = (currentContent: ContentItem, item: ContentItem, style: CSSProperties) => {

    item.data.style = {
        ...item.data.style,
        ...style
    };

    return { ...currentContent };
};



export const getDefaultContent = (initial?: ContentItem[], offset?: number): ContentItem => (
    generateDefault("root", null, [
        generateDefault("body", { offset: offset, style: {} }, initial ? initial : [])
    ])
);







