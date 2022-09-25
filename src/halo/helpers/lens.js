//lens2 :: forall s t a b. (s -> Tuple a (b -> t)) -> Lens s t a b
//lens2 to pab = dimap to (\(Tuple b f) -> f b) (first pab)
import Pair from './pair';
import {curry} from 'ramda';
import Arrow from './arrow';

const lens2 = curry((to, pab, d) =>
  //(typeof pab === 'function' ? Arrow(pab) : pab)
  pab
    .first()
    .dimap(to, pair => pair.snd(pair.fst))
    .runWith(d)
);

//lens :: forall s t a b. (s -> a) -> (s -> b -> t) -> Lens s t a b
//lens get set = lens2 \s -> Tuple (get s) \b -> set s b
const lens = curry((get, set) => lens2(s => Pair(get(s), b => set(s, b))));

export {lens2, lens};
