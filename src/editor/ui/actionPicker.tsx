import * as React from 'react';
import { connect } from 'react-redux';

import * as MuiLab from '@material-ui/lab';
import * as MuiIcons from '@material-ui/icons';

import * as actions from '../state/actions';


interface IActionPickerProps {
    mode?: actions.EditMode;
    onSelectMode: (mode: actions.EditMode)=>void;
    onOpenAddDrawer: ()=>void;
}

interface IActionPickerState {
    open: boolean;
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: IActionPickerProps): IActionPickerProps => ({
    ...ownProps,

    mode: state.editorMode
});

const mapDispatchToProps = (dispatch, ownProps, IActionPickerProps): IActionPickerProps => ({
    ...ownProps,

    onSelectMode:       (mode: actions.EditMode) => dispatch(actions.setMode(mode)),
    onOpenAddDrawer:    () => dispatch(actions.toggleAddDrawer(true))
});


const pickerActions = [
    { icon: <MuiIcons.LaptopMac />, name: 'Preview', mode: actions.EditMode.PREVIEW },
    { icon: <MuiIcons.Edit />, name: 'Edit', mode: actions.EditMode.EDIT },
    { icon: <MuiIcons.Add />, name: 'Add', mode: actions.EditMode.ADD }
];


class PureActionPicker extends React.Component<IActionPickerProps, IActionPickerState> {
    constructor(props: IActionPickerProps) {
        super(props);

        this.state = {
            open: true
        };
    }

    handleActionClick = (mode: actions.EditMode) => {

        this.props.onSelectMode(mode);

        if (mode == actions.EditMode.ADD) {
            this.props.onOpenAddDrawer();
        } else if (mode == actions.EditMode.PREVIEW) {
            setTimeout(() => {
                this.handleClose();
            }, 100);
        }
    };

    handleClick = () => {
        this.setState(state => ({
            open: !state.open,
        }));
    };

    handleClose = () => {
        this.setState({
            ...this.state,
            open: false
        });
    };

    handleOpen = () => {
        this.setState({
            ...this.state,
            open: true
        });
    };


    render() {
        return (
            <MuiLab.SpeedDial
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "24px"
                }}
                ariaLabel="Action Picker"
                icon={<MuiLab.SpeedDialIcon />}
                onClick={this.handleClick}
                onClose={this.handleClose}
                open={this.state.open}
                direction={"up"}
            >
                {pickerActions.map((action, index) => {

                    let icon = (
                        <span
                            style={{
                                color: this.props.mode == action.mode ? "#f50057" : "rgba(0, 0, 0, 0.54)"
                            }}
                        >{
                            action.icon}
                        </span>
                    );

                    return (
                        <MuiLab.SpeedDialAction
                            key={index}
                            icon={icon}
                            tooltipTitle={action.name}
                            onClick={() => {
                                this.handleActionClick(action.mode);
                            }}
                        />
                    );
                })}
            </MuiLab.SpeedDial>
        );
    }
}

const ActionPicker = connect(mapStateToProps, mapDispatchToProps)(PureActionPicker);

export default ActionPicker;