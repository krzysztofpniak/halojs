import {editorEvalFn} from '../editor';
import Pair from '../../../halo/helpers/pair';
import Maybe from '../../../halo/helpers/maybe';
import setupEval from '../../../halo/testing/setupEval';
import renderer from 'react-test-renderer';

const Z = () => <div className="as">dupa</div>;

describe('editorEvalFn', () => {
  it('should asd', () => {
    const {initialize, putState, getState} = setupEval(editorEvalFn);
    putState({slug: Maybe.Just('sdf')});

    expect(initialize()).toEqual(
      Pair(
        [
          'State',
          'GetArticle',
          'ChildQuery: Form.form.Query.InitFields({"a": "hello"})',
        ],
        ''
      )
    );
    expect(getState()).toEqual({slug: Maybe.Just('sdf')});
  });
  it('renders correctly', () => {
    const tree = renderer.create(<Z />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
