import * as React from 'react';
import { connect } from 'react-redux';

import { Drawer, IconButton } from '@material-ui/core';
import * as Icons from '@material-ui/icons';

import * as actions from '../state/actions';
import * as content from '../content/content';
import * as itemTypes from '../content/itemTypes';
import { FontWeightProperty } from 'csstype';


interface ITextSettingsEditorProps {
    open: boolean;
    selectedItem: content.ContentItem;
    content: content.ContentItem;

    setVariant: (item: content.ContentItem, variant: string) => void;
    setFontWeight: (item: content.ContentItem, weight: string) => void;
    setFontStyle: (item: content.ContentItem, style: string) => void;
    setUnderline: (item: content.ContentItem, underline: boolean) => void;
    setAlign: (item: content.ContentItem, align: string) => void;
}

interface ITextSettingsEditorState {

}

const mapStateToProps = (state: actions.IEditorReduxState, ownProps: ITextSettingsEditorProps): ITextSettingsEditorProps => ({
    ...ownProps,

    content: state.content,
    open: state.selectedItem !== null && state.selectedItem.type.id == "text",
    selectedItem: state.selectedItem
});

const mapDispatchToProps = (dispatch, ownProps: ITextSettingsEditorProps): ITextSettingsEditorProps => ({
    ...ownProps,

    setVariant: (item: content.ContentItem, variant: string) => dispatch(actions.changeItemDataProp(item, "variant", variant )),
    //setVariant: (item, variant) => dispatch(actions.changeItemData(item, { ...item.data, variant: variant })),
    setFontWeight: (item: content.ContentItem, weight: string) => dispatch(actions.changeItemStyle(item, { ...item.data.style, fontWeight: weight as FontWeightProperty } )),
    setFontStyle: (item: content.ContentItem, style: string) => dispatch(actions.changeItemStyle(item, { ...item.data.style, fontStyle: style } )),
    setUnderline: (item: content.ContentItem, underline: boolean) => dispatch(actions.changeItemStyle(item, { ...item.data.style, textDecoration: underline ? "underline" : "" } )),

    setAlign: (item: content.ContentItem, align: string) => dispatch(actions.changeItemStyle(item, { ...item.data.style, textAlign: align as any } ))
});


class PureTextSettingsEditor extends React.Component<ITextSettingsEditorProps, ITextSettingsEditorState> {
    constructor(props: ITextSettingsEditorProps) {
        super(props);

        this.state = {};
    }

    render() {
        let headingIcons = [Icons.LooksOne, Icons.LooksTwo, Icons.Looks3, Icons.Looks4, Icons.Looks5, Icons.Looks6];
        let highlightColor = "#4287f5";

        let headingButtons = [1, 2, 3, 4, 5, 6].map(heading => {

            let HeadingIcon = headingIcons[heading - 1];
            let headingElem = 'h' + heading;

            return (
                <IconButton
                    size="small"
                    onClick={event => {
                        event.stopPropagation();

                        if (this.props.selectedItem.data.variant == headingElem)
                            this.props.setVariant(this.props.selectedItem, "p");
                        else
                            this.props.setVariant(this.props.selectedItem, headingElem);
                    }}
                >
                    <HeadingIcon
                        style={{
                            color: (
                                this.props.selectedItem && this.props.selectedItem.data.variant == headingElem
                                    ? highlightColor
                                    : 'white'
                            )
                        }}
                    />
                </IconButton>
            );
        });

        let iconButtons = headingButtons.concat([
            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();
                }}
            >
                <Icons.Link style={{ color: 'white' }} />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    if (this.props.selectedItem.data.style && this.props.selectedItem.data.style.fontWeight == "bold")
                        this.props.setFontWeight(this.props.selectedItem, "normal");
                    else
                        this.props.setFontWeight(this.props.selectedItem, "bold");
                }}
            >
                <Icons.FormatBold
                    style={{
                        color: (
                            this.props.selectedItem && this.props.selectedItem.data.style && this.props.selectedItem.data.style.fontWeight == "bold"
                                ? highlightColor
                                : 'white'
                        )
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    if (this.props.selectedItem.data.style && this.props.selectedItem.data.style.fontStyle == "italic")
                        this.props.setFontStyle(this.props.selectedItem, "normal");
                    else
                        this.props.setFontStyle(this.props.selectedItem, "italic");
                }}
            >
                <Icons.FormatItalic
                    style={{
                        color: (
                            this.props.selectedItem && this.props.selectedItem.data.style && this.props.selectedItem.data.style.fontStyle == "italic"
                                ? highlightColor
                                : 'white'
                        )
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    if (this.props.selectedItem.data.style && this.props.selectedItem.data.style.textDecoration == "underline")
                        this.props.setUnderline(this.props.selectedItem, false);
                    else
                        this.props.setUnderline(this.props.selectedItem, true);
                }}
            >
                <Icons.FormatUnderlined
                    style={{
                        color: (
                            this.props.selectedItem && this.props.selectedItem.data.style && this.props.selectedItem.data.style.textDecoration == "underline"
                                ? highlightColor
                                : 'white'
                        )
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                    let isLeftAligned = (
                        parent &&
                        parent.data.style &&
                        parent.data.style.textAlign == "left"
                    );

                    if (isLeftAligned)
                        this.props.setAlign(parent, "left");
                    else
                        this.props.setAlign(parent, "left");

                }}
            >
                <Icons.FormatAlignLeft
                    style={{
                        color: ((): string => {
                            let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                            let isLeftAligned = (
                                parent &&
                                parent.data.style &&
                                parent.data.style.textAlign == "left"
                            );

                            return isLeftAligned ? highlightColor : 'white';
                        })()
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                    let isCenterAligned = (
                        parent &&
                        parent.data.style &&
                        parent.data.style.textAlign == "center"
                    );

                    if (isCenterAligned)
                        this.props.setAlign(parent, "left");
                    else
                        this.props.setAlign(parent, "center");

                }}
            >
                <Icons.FormatAlignCenter
                    style={{
                        color: ((): string => {
                            let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                            let isCenterAligned = (
                                parent &&
                                parent.data.style &&
                                parent.data.style.textAlign == "center"
                            );

                            return isCenterAligned ? highlightColor : 'white';
                        })()
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                    let isRightAligned = (
                        parent &&
                        parent.data.style &&
                        parent.data.style.textAlign == "right"
                    );

                    if (isRightAligned)
                        this.props.setAlign(parent, "left");
                    else
                        this.props.setAlign(parent, "right");

                }}
            >
                <Icons.FormatAlignRight
                    style={{
                        color: ((): string => {
                            let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                            let isRightAligned = (
                                parent &&
                                parent.data.style &&
                                parent.data.style.textAlign == "right"
                            );

                            return isRightAligned ? highlightColor : 'white';
                        })()
                    }}
                />
            </IconButton>,

            <IconButton
                size="small"
                onClick={event => {
                    event.stopPropagation();

                    let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                    let isJustifyAligned = (
                        parent &&
                        parent.data.style &&
                        parent.data.style.textAlign == "justify"
                    );

                    if (isJustifyAligned)
                        this.props.setAlign(parent, "left");
                    else
                        this.props.setAlign(parent, "justify");

                }}
            >
                <Icons.FormatAlignJustify
                    style={{
                        color: ((): string => {
                            let parent = this.props.selectedItem && this.props.selectedItem.parent ? content.getContentById(this.props.content, this.props.selectedItem.parent.id) : null;

                            let isJustifyAligned = (
                                parent &&
                                parent.data.style &&
                                parent.data.style.textAlign == "justify"
                            );

                            return isJustifyAligned ? highlightColor : 'white';
                        })()
                    }}
                />
            </IconButton>,
        ]);


        return (
            <Drawer
                open={this.props.open}
                variant="persistent"
                anchor="bottom"
                style={{ top: 'auto', bottom: 0 }}
                PaperProps={{
                    square: false,
                    style: {
                        backgroundColor: 'black',
                        width: "700px",
                        margin: 'auto'
                    }
                }}
            >
                <div style={{ display: 'flex', width: "100%", height: "100%" }}>
                    {
                        iconButtons.map((btn, index) => {
                            return (
                                <div key={index} style={{ width: `${100 / iconButtons.length}%` }}>
                                    {btn}
                                </div>
                            );
                        })
                    }
                </div>
            </Drawer>
        );
    }
}


const TextSettingsEditor = connect(mapStateToProps, mapDispatchToProps)(PureTextSettingsEditor);

export default TextSettingsEditor;
