import React from 'react';
import {connect, H, mkComponent, mkEval} from '../../halo/halo';
import Header from '../components/header';
import {Routes} from '../../data/routes';
import {mergeLeft, prop} from 'ramda';
import Footer from '../../footer';
import daggy from 'daggy';
import Form from '../../halo/form';
import fieldTypes from '../form/fieldTypes';
import {A} from '../appM';
import go from '../../halo/helpers/go';
import Maybe from '../../halo/helpers/maybe';
import {unit} from '../../halo/helpers/fns';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  Form: ['formAction'],
});

const handleAction = action =>
  action.cata({
    Initialize: () =>
      go(function* () {
        const {slug} = yield H.get();
        const article = yield slug.cata({
          Just: x =>
            A.getArticle(x).chain(x =>
              x.cata({
                NotAsked: z => Maybe.Nothing,
                Loading: z => Maybe.Nothing,
                Failure: z => Maybe.Nothing,
                Success: article => Maybe.Just(article),
              })
            ),
          Nothing: () => H.of(unit),
        });

        return H.query('Form')('form')(Form.Query.InitFields(article));
      }),
    Receive: input => H.modify(mergeLeft(input)),
    Form: formAction =>
      formAction.cata({
        Submit: fields =>
          go(function* () {
            const {slug} = yield H.get();
            const z = yield slug.cata({
              Nothing: () => A.createArticle(fields),
              Just: s => A.updateArticle(s, fields),
            });
            return z.cata({
              NotAsked: z => H.of(unit),
              Loading: z => H.of(unit),
              Failure: z => H.of(unit),
              Success: ({slug}) => H.navigate(Routes.EditArticle(slug)),
            });
          }),
      }),
  });

const schema = [
  {id: 'title', placeholder: 'Article Title'},
  {id: 'description', placeholder: "What's this article about?"},
  {
    id: 'body',
    type: 'textarea',
    placeholder: 'Write your article (in markdown)',
  },
  {id: 'tagList', placeholder: 'Article Title'},
];

const evalFn = mkEval({
  initialize: Action.Initialize,
  handleAction,
  receive: Action.Receive,
});

const Editor = connect(s => s)(
  mkComponent({
    actionType: Action,
    initialState: ({currentUser}) => ({
      currentUser,
    }),
    evalFn,
  })(({currentUser, Slot, slug}) => (
    <div>
      <Header currentUser={currentUser} route={Routes.Editor} />
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <Slot
                component={Form}
                output={Action.Form}
                slotType="Form"
                slotId="form"
                schema={schema}
                fieldTypes={fieldTypes}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ))
);

export default Editor;

const editorEvalFn = evalFn;

export {editorEvalFn};
