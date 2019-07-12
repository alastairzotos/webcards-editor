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

export interface ContentData {
    style: CSSProperties;

    [key: string]: any;
}

export interface ContentItem {
    id: string;
    type: itemTypes.ItemType;
    parent: ContainerItem;
    position: number;

    data: ContentData;
}

export interface ContainerItem extends ContentItem {
    children: ContentItem[];
}

export const createContentItem = (type: string, data: ContentData): ContentItem => ({
    id: uuid(),
    type: itemTypes.ItemTypes[type],
    data: data,
    parent: null,
    position: 0
});

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

export const isContainer = (content: ContentItem): boolean => (content as ContainerItem).children !== undefined;


export const generateDefault = (type: string, children?: ContentItem[], options?: ContentData): ContentItem => {
    return itemTypes.ItemTypes[type].generateDefault(children, options);
};


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

export const hasChildWithId = (content: ContentItem, id: string) => {
    if (!isContainer(content)) return false;

    let container = content as ContainerItem;
    return container.children.filter(child => child.id == id).length > 0;
};

export const traceAncestors = (item: ContentItem, includeThis: boolean = true): ContentItem[] => {
    let ancestors = [];

    let cur = includeThis ? item : item.parent;
    while (cur) {
        ancestors.push(cur);

        cur = cur.parent;
    }

    return ancestors;
};

export const isAncestor = (item: ContentItem, potentialAncestor: ContentItem): boolean => {
    let cur = item.parent;
    while (cur) {
        if (cur == potentialAncestor)
            return true;

        cur = cur.parent;
    }

    return false;
};

const updateChildrenPositions = (container: ContainerItem) => {
    container.children.forEach((child, index) => {
        child.position = index;
    });
};


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

export const deleteItem = (currentContent: ContentItem, item: ContentItem) => {

    if (item.parent) {
        item.parent.children = item.parent.children.filter(child => child.id != item.id);
        updateChildrenPositions(item.parent);

        item.parent = null;
    }

    return {...currentContent};
};


export const updateItemData = (currentContent: ContentItem, item: ContentItem, data: ContentData) => {
    item.data = {
        ...item.data,
        ...data
    };

    return {...currentContent};
};

export const updateItemDataProp = (currentContent: ContentItem, item: ContentItem, prop: string, value: any) => {
    let propData = {};
    propData[prop] = value;

    item.data = {
        ...item.data,
        ...propData
    };

    return {...currentContent };
};

export const updateItemStyle = (currentContent: ContentItem, item: ContentItem, style: CSSProperties) => {

    item.data.style = {
        ...item.data.style,
        ...style
    };

    return { ...currentContent };
};



export const getDefaultContent = (): ContentItem => (
    generateDefault("root", [
        generateDefault("body", [

        ])
    ])
);







