import {chain} from 'ramda';
import immutagen from 'immutagen';

const rec2 = res =>
  !res.next
    ? res.value
    : chain(x => {
        return rec2(res.next(x));
      })(res.value);

const go = generator => {
  return rec2(immutagen(generator)());
};

export default go;
