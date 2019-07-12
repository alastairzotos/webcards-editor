import * as React from 'react';

import {Typography} from '@material-ui/core';

interface ITaggedSettingProps {
    title: string;
    canClear: boolean;
    displayClear?: boolean;

    onCleared?: ()=>void;
}


export default class TaggedSetting extends React.Component<ITaggedSettingProps, {}> {
    constructor(props: ITaggedSettingProps) {
        super(props);

    }

    render() {
        return (
            <div style={{ marginBottom: "10px" }}>
                <Typography paragraph style={{ marginBottom: "0" }}>
                    <span style={{ fontSize: "12px" }}>{this.props.title}</span>

                    {(this.props.canClear && this.props.displayClear) &&
                        <a
                            href="javascript:void(0)"
                            style={{
                                marginLeft: "5px",
                                fontSize: "8px",
                                textDecoration: "none",
                                color: "white"
                            }}
                            onClick={this.props.onCleared}
                        >x</a>
                    }
                </Typography>

                <>{this.props.children}</>
            </div>
        );
    }
}