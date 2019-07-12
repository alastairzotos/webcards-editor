import * as React from 'react';
import { connect } from 'react-redux';
import * as markdown from 'markdown';
import * as uuid from 'uuid';

import * as actions from '../state/actions';
import * as cnt from '../content/content';

interface ITypographyProps {
    mode?: actions.EditMode;
    textContent?: cnt.ContentItem;
    variant: string;

    onChangeText?: (item: cnt.ContentItem, text: string)=>void;
    onReturn?: ()=>void;
}

interface ITypographyState {
    innerText: string;
}


const mapStateToProps = (state: actions.IEditorReduxState, ownProps: ITypographyProps): ITypographyProps => ({
    ...ownProps,

    mode: state.editorMode
});

const mapDispatchToProps = (dispatch, ownProps: ITypographyProps): ITypographyProps => ({
    ...ownProps,

    onChangeText: (item: cnt.ContentItem, text: string) => dispatch(actions.changeItemDataProp(item, "text", text )),
    onReturn: () => dispatch(actions.deselectItems())
});


class PureTypography extends React.Component<ITypographyProps, ITypographyState> {

    constructor(props: ITypographyProps) {
        super(props);

        this.state = {
            innerText: props.textContent.data.text
        };
    }

    onChangeText = event => {
        this.setState({
            ...this.state,

            innerText: event.target.innerText
        });
    };

    onBlur = () => {
        this.props.onChangeText(this.props.textContent, this.state.innerText);
    };

    onReturn = e => {
        this.props.onChangeText(this.props.textContent, this.state.innerText);
        this.props.onReturn();
    };


    private _renderCounter = 0;
    renderMDHTMLTree = (object: string | string[]):any => {
        if (Array.isArray(object)) {
            let list = object as string[];
            let elemType = list.shift();
            if (elemType == 'p') elemType = 'span';

            let children = list.map(item => this.renderMDHTMLTree(item));

            if (elemType !== 'html') {
                return React.createElement(elemType, { key: this._renderCounter++ }, ...children);
            } else {
                return <React.Fragment key={this._renderCounter++}>{children}</React.Fragment>;
            }
        } else {
            return <span key={this._renderCounter++}>{object as string}</span>;
        }
    }

    render() {
        const {
            textContent,
            variant,
            onChangeText,
            onReturn,
            ...extraProps
        } = this.props;


        // React wants capitalised components
        let Variant = variant as any;


        /*this._renderCounter = 0;
        let html = markdown.markdown.toHTMLTree(textContent.data.text);
        let rendered = this.renderMDHTMLTree(html);
        console.log(html);
        console.log(rendered);*/

        let rendered = textContent.data.text;

        return (
            <Variant
                {...extraProps}

                contentEditable={this.props.mode !== actions.EditMode.PREVIEW}
                suppressContentEditableWarning

                onInput={this.onChangeText}
                onBlur={this.onBlur}

                onKeyPress={e => {

                    // Prevent newlines and set text when enter
                    if (e.which == 13) {
                        e.preventDefault();
                        onReturn();
                    }
                }}
            >
                {rendered}
            </Variant>
        );
    }
}


const Typography = connect(mapStateToProps, mapDispatchToProps)(PureTypography);
export default Typography;