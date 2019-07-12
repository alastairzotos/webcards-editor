import * as React from 'react';

import * as content from '../content/content';
import { IconButton } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';


export const DescriptorHandle: React.SFC<{ item: content.ContentItem, handleDrag?: ()=>void }> = props => (
    <div
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "16px",
            color: "white",
            padding: "3px",
            backgroundColor: "#305da6",
            fontSize: "12px",

            cursor: "all-scroll"
        }}
    >
        <span>{props.item.type.name}</span>
    </div>
);

interface IDragHandleProps {
    item: content.ContentItem;

    onMouseDown: ()=>void;
    onMouseUp: ()=>void;

    onSelectParent: ()=>void;

    handleDrag?: ()=>void;
    handleNoDrop?: ()=>void;
}

export const DragHandle: React.FC<IDragHandleProps> = props => {

    return (
        <div
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}

            style={{
                position: "absolute",
                top: 0,
                left: 0,
                padding: "0 3px 3px 0",
                height: "16px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                textAlign: "center",
                fontSize: "12px",

                borderBottomRightRadius: "3px",

                cursor: "all-scroll"
            }}
        >
            {props.item.parent.type.id !== "body" && 
                <IconButton
                    size="small"
                    style={{ color: "#ffffff" }}

                    onClick={event => {
                        event.preventDefault();
                        event.stopPropagation();

                        props.onSelectParent();
                    }}
                >
                    <ArrowUpward style={{ fontSize: "12px" }} />
                </IconButton>
            }

            <span style={{ color: "#ffffff" }}>{props.item.type.name}</span>
        </div>
    );
};
