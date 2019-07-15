import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, createStore } from 'redux';
import { bindShortcuts, mousetrap, Mousetrap } from 'redux-shortcuts';

import * as actions from './state/actions';
import * as content from './content/content';

import EditorHtmlGenerator from './render/editorHtmlGenerator';
import PageEditorScreen from './editorScreen';

interface IEditorProps {
    content?: content.ContentItem[];
    bodyOffset?: number;

    onSave?: (items: content.ContentItem, onComplete: ()=>void)=>void;
}

interface IEditorState {

}

export default class PageEditor extends React.Component<IEditorProps, IEditorState> {
    
    private _generator = new EditorHtmlGenerator;
    private _store: Store;
    
    constructor(props: IEditorProps) {
        super(props);

        this.state = {};

        this._store = createStore(actions.editorReducer, actions.createDefaultState(props.content, props.bodyOffset));

        bindShortcuts(
            [['command+z', 'ctrl+z'], actions.undo]
        )(this._store.dispatch);
    }

    render() {
        return (
            <Provider store={this._store}>
                <PageEditorScreen
                    generator={this._generator}
                    onSave={(items, cb) => {
                        if (this.props.onSave) {
                            this.props.onSave(items, cb);
                        }
                    }}
                />
            </Provider>
        );
    }
}