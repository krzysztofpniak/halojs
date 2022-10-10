import {taggedSum} from './daggy';

const RequestMethod = taggedSum('RequestMethod', {
  Get: [],
  Post: ['content'],
  Put: ['content'],
  Delete: [],
});

export default RequestMethod;
