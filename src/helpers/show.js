//  $$show :: String
const $$show = '@@show';

//  seen :: Array Any
const seen = [];

//  entry :: Object -> String -> String
const entry = o => k => show(k) + ': ' + show(o[k]);

//  sortedKeys :: Object -> Array String
const sortedKeys = o => Object.keys(o).sort();

//# show :: Showable a => a -> String
//.
//. Returns a useful string representation of the given value.
//.
//. Dispatches to the value's `@@show` method if present.
//.
//. Where practical, `show (eval ('(' + show (x) + ')')) = show (x)`.
//.
//. ```javascript
//. > show (null)
//. 'null'
//.
//. > show (undefined)
//. 'undefined'
//.
//. > show (true)
//. 'true'
//.
//. > show (new Boolean (false))
//. 'new Boolean (false)'
//.
//. > show (-0)
//. '-0'
//.
//. > show (NaN)
//. 'NaN'
//.
//. > show (new Number (Infinity))
//. 'new Number (Infinity)'
//.
//. > show ('foo\n"bar"\nbaz\n')
//. '"foo\\n\\"bar\\"\\nbaz\\n"'
//.
//. > show (new String (''))
//. 'new String ("")'
//.
//. > show (['foo', 'bar', 'baz'])
//. '["foo", "bar", "baz"]'
//.
//. > show ([[[[[0]]]]])
//. '[[[[[0]]]]]'
//.
//. > show ({x: [1, 2], y: [3, 4], z: [5, 6]})
//. '{"x": [1, 2], "y": [3, 4], "z": [5, 6]}'
//. ```
const show = x => {
  if (seen.indexOf(x) >= 0) return '<Circular>';

  const repr = Object.prototype.toString.call(x);

  switch (repr) {
    case '[object Null]':
      return 'null';

    case '[object Undefined]':
      return 'undefined';

    case '[object Boolean]':
      return typeof x === 'object'
        ? 'new Boolean (' + show(x.valueOf()) + ')'
        : x.toString();

    case '[object Number]':
      return typeof x === 'object'
        ? 'new Number (' + show(x.valueOf()) + ')'
        : 1 / x === -Infinity
        ? '-0'
        : x.toString(10);

    case '[object String]':
      return typeof x === 'object'
        ? 'new String (' + show(x.valueOf()) + ')'
        : JSON.stringify(x);

    case '[object RegExp]':
      return x.toString();

    case '[object Date]':
      return (
        'new Date (' + show(isNaN(x.valueOf()) ? NaN : x.toISOString()) + ')'
      );

    case '[object Error]':
      return 'new ' + x.name + ' (' + show(x.message) + ')';

    case '[object Arguments]':
      return (
        'function () { return arguments; } (' +
        Array.prototype.map.call(x, show).join(', ') +
        ')'
      );

    case '[object Array]':
      seen.push(x);
      try {
        return (
          '[' +
          x
            .map(show)
            .concat(
              sortedKeys(x)
                .filter(k => !/^\d+$/.test(k))
                .map(entry(x))
            )
            .join(', ') +
          ']'
        );
      } finally {
        seen.pop();
      }

    case '[object Object]':
      seen.push(x);
      try {
        return $$show in x &&
          (x.constructor == null || x.constructor.prototype !== x)
          ? x[$$show]()
          : '{' + sortedKeys(x).map(entry(x)).join(', ') + '}';
      } finally {
        seen.pop();
      }

    case '[object Set]':
      seen.push(x);
      try {
        return 'new Set (' + show(Array.from(x.values())) + ')';
      } finally {
        seen.pop();
      }

    case '[object Map]':
      seen.push(x);
      try {
        return 'new Map (' + show(Array.from(x.entries())) + ')';
      } finally {
        seen.pop();
      }

    default:
      return repr.replace(/^\[(.*)\]$/, '<$1>');
  }
};

export default show;
