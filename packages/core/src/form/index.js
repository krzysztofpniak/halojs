import React, {createElement} from 'react';
import {H, mkComponent, mkEval, taggedSum} from '../halo';
import {
  always,
  assocPath,
  compose,
  evolve,
  fromPairs,
  map,
  mergeLeft,
  mergeRight,
  pipe,
  pluck,
  tap,
} from 'ramda';

const Action = taggedSum('Action', {
  Receive: ['input'],
  SetField: ['id', 'value'],
  SubmitClick: [],
});

const Output = taggedSum('Output', {
  Submit: ['fields'],
});

const Query = taggedSum('Query', {
  Reset: [],
  InitFields: ['fields'],
});

const getDefaultValues = pipe(
  map(({id, defaultValue}) => [
    id,
    {value: defaultValue || '', touched: false},
  ]),
  fromPairs
);

const initForm = fields => map(f => ({value: f, touched: false}), fields);

const handleAction = action =>
  action.cata({
    Receive: ({schema, fieldTemplate, fieldTypes}) =>
      H.modify(
        compose(
          evolve({
            fields: mergeRight(getDefaultValues(schema)),
          }),
          mergeLeft({schema, fieldTemplate, fieldTypes})
        )
      ),
    SetField: (id, value) =>
      H.modify(assocPath(['fields', id, 'value'], value)),
    SubmitClick: () =>
      H.get()
        .map(x => pluck('value', x.fields))
        .chain(x => H.raise(Output.Submit(x))),
  });

const handleQuery = query =>
  query.cata({
    InitFields: fields =>
      H.modify(state =>
        evolve({
          fields: compose(tap(console.log), mergeLeft(initForm(fields))),
        })(state)
      ),
    Reset: () =>
      H.modify(state =>
        evolve({
          fields: mergeLeft(getDefaultValues(state.schema)),
        })(state)
      ),
  });

const FieldTemplate = ({title, input, error}) => (
  <fieldset className="form-group">
    <div>{title}</div>
    <div>{input}</div>
    <div>{error}</div>
  </fieldset>
);

const Form = mkComponent({
  initialState: always({
    schema: [],
    fieldTemplate: FieldTemplate,
    fieldTypes: {},
    fields: {},
  }),
  actionType: Action,
  evalFn: mkEval({receive: Action.Receive, handleAction, handleQuery}),
})(
  ({
    schema,
    fieldTemplate: FieldTemplate,
    fieldTypes,
    fields,
    SetField,
    SubmitClick,
  }) => (
    <form>
      {map(
        fieldSchema => (
          <FieldTemplate
            key={fieldSchema.id}
            title={fieldSchema.title}
            input={createElement(fieldTypes[fieldSchema.type || 'text'], {
              placeholder: fieldSchema.placeholder,
              value: fields[fieldSchema.id].value,
              onChange: e => SetField(fieldSchema.id, e.target.value),
            })}
          />
        ),
        schema
      )}
      <button
        className="btn btn-lg btn-primary pull-xs-right"
        type="submit"
        onClick={e => {
          e.preventDefault();
          SubmitClick(e);
        }}
      >
        Submit
      </button>
      <div>{JSON.stringify({schema, fields})}</div>
    </form>
  )
);

Form.defaultProps = {
  fieldTemplate: FieldTemplate,
  fieldTypes: {},
};

Form.Output = Output;
Form.Query = Query;

export default Form;
