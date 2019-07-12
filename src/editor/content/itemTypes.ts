import Typography from '../render/typography';

import * as custom from './customSettings';
import * as content from './content';
import { DefaultStyles } from './defaults';


export enum SettingsEditorType {
    TEXT = 'TEXT',
    DEFAULT = 'DEFAULT'
}

export interface ItemType {
    id: string;
    name: string;
    desc: string;
    validChildren?: string | string[];
    invalidChildren?: string[];
    settingsEditorType: SettingsEditorType;
    edittable: boolean;

    customTypeSettings?: custom.CustomTypeSettings;

    generateDefault?: (children?: content.ContentItem[], options?: content.ContentData)=>content.ContentItem;
    generateProps?: (item: content.ContentItem)=>any;
}

export interface ItemTypeCategory {
    name: string;
    types: ItemType[];
}

/****************
 * Types
 ****************/

export const ItemTypes: { [key: string]: ItemType } = {

    // Basic
    "text": {
        id: "text",
        name: "Text",
        desc: "Versatile text component",
        validChildren: [],
        settingsEditorType: SettingsEditorType.TEXT,
        edittable: true,

        generateDefault: (children?, options?: content.ContentData) => {
            return content.createContentItem("text", { text: "Text", variant: "p", ...options, style: { fontFamily: "Lucida Sans Unicode, Lucida Grande, sans-serif", width: "100%", ...(options ? options.style : {}) } });
        },

        generateProps: (item: content.ContentItem) => ({
            component: Typography,
            textContent: item,
            variant: item.data.variant
        })
    },


    // Layout
    "container": {
        id: "container",
        name: "Container",
        desc: "A generic container",
        invalidChildren: ["column"],
        settingsEditorType: SettingsEditorType.DEFAULT,
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.createContainerItem("container", { style: { padding: "10px", width: "100%" } }, children);
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div"
        })
    },

    "row": {
        id: "row",
        name: "Row",
        desc: "A row that can contain a set of columns",
        validChildren: ["column"],
        settingsEditorType: SettingsEditorType.DEFAULT,
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.createContainerItem("row", { className: "row", style: { padding: "5px", width: "100%" } }, children);
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div",
            className: "row"
        })
    },

    "column": {
        id: "column",
        name: "Column",
        desc: "A responsive column",
        settingsEditorType: SettingsEditorType.DEFAULT,
        invalidChildren: ["column"],
        edittable: true,

        customTypeSettings: custom.ColumnCustomSettings,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            if (options && options.span) {
                return content.createContainerItem("column", { className: "col-" + options.span, span: options.span, style: { ...options.style, padding: "10px", width: (options.span / 12) * 100 + "%" } }, children);
            }
            return content.createContainerItem("column", { className: "col-3", span: 3, style: { padding: "10px" } }, children);
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div",
            className: "col-" + item.data.span
        })
    },

    "columns-2": {
        id: "columns-2",
        name: "Columns (2)",
        desc: "A 2-column layout",
        settingsEditorType: SettingsEditorType.DEFAULT,
        validChildren: '*',
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.generateDefault("row", [
                content.createContainerItem("column", { className: "col-6", span: 6, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-6", span: 6, style: { padding: "10px" } }, [])
            ]);
        }
    },

    "columns-3": {
        id: "columns-3",
        name: "Columns (3)",
        desc: "A 3-column layout",
        settingsEditorType: SettingsEditorType.DEFAULT,
        validChildren: '*',
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.generateDefault("row", [
                content.createContainerItem("column", { className: "col-4", span: 4, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-4", span: 4, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-4", span: 4, style: { padding: "10px" } }, [])
            ]);
        }
    },

    "columns-4": {
        id: "columns-4",
        name: "Columns (4)",
        desc: "A 4-column layout",
        settingsEditorType: SettingsEditorType.DEFAULT,
        validChildren: '*',
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.generateDefault("row", [
                content.createContainerItem("column", { className: "col-3", span: 3, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-3", span: 3, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-3", span: 3, style: { padding: "10px" } }, []),
                content.createContainerItem("column", { className: "col-3", span: 3, style: { padding: "10px" } }, [])
            ]);
        }
    },



    // Templates
    "generic-template": {
        id: "generic-template",
        name: "Generic Page Template",
        desc: "A generic page template",
        validChildren: '*',
        settingsEditorType: SettingsEditorType.DEFAULT,
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return (
                content.createContainerItem("generic-template", { style: { } }, [

                    // Header
                    content.createContainerItem("container", { style: { backgroundColor: "#dedede", padding: "10%" }}, [
                        content.generateDefault("row", [
                            content.createContainerItem("column", { className: "col-6", span: 6, style: {} }, [
                                content.generateDefault("text", [], { text: "Welcome", variant: "h1", style: {} }),
                                content.generateDefault("text", [], { variant: "h4", text: "Thank you for visiting my website", style: { color: "#555555" } })
                            ])
                        ])
                    ]),

                    // Main body
                    content.createContainerItem("container", { style: { padding: "30px", backgroundColor: "#ffffff" } }, [

                        content.createContainerItem("container", { style: { textAlign: "center" }}, [
                            content.generateDefault("text", [], { variant: "h2", text: "About Me", style: {} }),

                            content.generateDefault("text", [], { variant: "p", style: {}, text: "Lorem ipsum dolor sit amet, libris facilisi partiendo ad vix, cu iisque maluisset cum. Pertinax repudiare vim te, nec cu vide singulis, id iusto phaedrum platonem vis. Scripta facilisis delicatissimi eos ei, animal delectus expetendis an est. Lobortis persequeris definitiones vis no." })
                        ]),
                    ]),

                    // Footer
                    content.createContainerItem("container", { style: { padding: "20px", backgroundColor: "#333333" } }, [
                        content.generateDefault("row", [

                            content.createContainerItem("column", { className: "col-4", span: 4, style: { padding: "10px" } }, [
                                content.createContainerItem("container", { style: {} }, [
                                    content.generateDefault("text", [], { variant: "h3", text: "Sitemap", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "Home", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "About", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "Contact", style: { color: "white" } }),
                                ])
                            ]),

                            content.createContainerItem("column", { className: "col-4", span: 4, style: {  padding: "10px"} }, [
                                content.createContainerItem("container", { style: { padding: "5px" } }, [
                                    content.generateDefault("text", [], { variant: "h3", text: "Social", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "Facebook", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "Instagram", style: { color: "white" } }),
                                    content.generateDefault("text", [], { variant: "p", text: "Youtube", style: { color: "white" } }),
                                ])
                            ]),

                        ])
                    ])
                ])
            );
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div"
        })
    },


    // Hidden
    "root": {
        id: "root",
        name: "Root",
        desc: "Root container",
        validChildren: ["body"],
        settingsEditorType: SettingsEditorType.DEFAULT,
        edittable: false,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.createContainerItem("root", { style: {} }, children);
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div"
        })
    },

    "body": {
        id: "body",
        name: "Body",
        desc: "Main document body",
        invalidChildren: ["column"],
        settingsEditorType: SettingsEditorType.DEFAULT,
        edittable: true,

        generateDefault: (children?: content.ContentItem[], options?: content.ContentData) => {
            return content.createContainerItem("body", { style: { margin: "5px", backgroundColor: "white", minHeight: "calc(100vh - 120px)" } }, children);
        },

        generateProps: (item: content.ContentItem) => ({
            component: "div"
        })
    }

};


/****************
 * Categories
 ****************/

export const ItemTypeCategories: ItemTypeCategory[] = [
    {
        name: "Basic",

        types: [
            ItemTypes["text"]
        ]
    },

    {
        name: "Layout",
        types: [
            ItemTypes["container"],
            ItemTypes["row"],
            ItemTypes["column"],
            ItemTypes["columns-2"],
            ItemTypes["columns-3"],
            ItemTypes["columns-4"]
        ]
    },

    {
        name: "Templates",
        types: [
            ItemTypes["generic-template"]
        ]
    }
];


/****************
 * Utils
 ****************/

export const ItemTypesArray: ItemType[] = Object.keys(ItemTypes).map(key => ItemTypes[key]);
export const BlockLevelTypes: ItemType[] = [ItemTypes["row"], ItemTypes["container"], ItemTypes["column"]];

export const isBlockLevel = (type: ItemType): boolean => BlockLevelTypes.includes(type);

export const isColumn = (type: ItemType): boolean => type.id == "column";

export const resolveValidChildren = (type: ItemType): ItemType[] => {
    let validChildren = type.validChildren;
    let invalidChildren = type.invalidChildren;

    if (validChildren !== undefined) {
        if (validChildren == '*')
            return ItemTypesArray;

        if ((validChildren as string[]).length !== undefined) {
            let validIdsArray = validChildren as string[];

            return validIdsArray.map(id => ItemTypes[id]);
        }
    }

    if (invalidChildren !== undefined)
        return ItemTypesArray.filter(type => !invalidChildren.includes(type.id));

    return [];
};
