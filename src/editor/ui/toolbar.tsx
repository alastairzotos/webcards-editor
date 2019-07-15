import * as React from 'react';
import { Paper, IconButton, LinearProgress } from '@material-ui/core';
import * as Icons from '@material-ui/icons';

import * as content from '../content/content';

interface IToolbarProps {
    
    onSave: (onComplete: ()=>void)=>void;
}

interface IToolbarState {
    saving: boolean;
}


export default class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
    constructor(props: IToolbarProps) {
        super(props);

        this.state = {
            saving: false
        };
    }

    render() {
        return (
            <Paper square>
                <IconButton
                    size="small"

                    disabled={this.state.saving}

                    onClick={() => {
                        this.setState({
                            ...this.state,
                            saving: true
                        }, () => {
                            this.props.onSave(() => {
                                this.setState({
                                    ...this.state,
                                    saving: false
                                });
                            });
                        })
                    }}
                >
                    <Icons.Save />
                </IconButton>
                {this.state.saving && <LinearProgress  /> }
            </Paper>
        );
    }
}