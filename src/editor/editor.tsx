import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore} from 'redux';
import { bindShortcuts, mousetrap, Mousetrap } from 'redux-shortcuts';

import * as actions from './state/actions';

import EditorHtmlGenerator from './render/editorHtmlGenerator';
import PageEditorScreen from './editorScreen';

const store = createStore(actions.editorReducer);

interface IEditorProps {
}

interface IEditorState {

}

export default class PageEditor extends React.Component<IEditorProps, IEditorState> {
    
    private _generator = new EditorHtmlGenerator;
    
    constructor(props: IEditorProps) {
        super(props);

        this.state = {};

        bindShortcuts(
            [['command+z', 'ctrl+z'], actions.undo]
        )(store.dispatch);
    }

    render() {
        return (
            <Provider store={store}>
                <PageEditorScreen generator={this._generator} />
            </Provider>
        );
    }
}