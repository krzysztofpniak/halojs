import Tabs from './tabs';
import RemoteData from '../../../halo/helpers/remoteData';

const initialState = {
  tab: Tabs.Global,
  tags: RemoteData.NotAsked,
  articles: RemoteData.NotAsked,
};

export default initialState;
