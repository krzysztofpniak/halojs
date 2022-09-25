import daggy from 'daggy';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  ShowTab: ['tab'],
  LoadTags: [],
  LoadArticles: ['params'],
  LoadFeed: ['params'],
});

export default Action;
