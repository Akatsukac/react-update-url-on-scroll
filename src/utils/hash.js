import {createId} from './func';
import {setMetaTags} from './meta';

const basePath = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

const getCurrentHash = () => {
  if (typeof window !== 'undefined') 
    decodeURI(window.location.hash.slice(1))
};

export const getHash = ({manager}) => {
  const {basePath} = manager;
  const name = typeof window !== 'undefined' ? window.location.pathname.replace(basePath.replace(window.location.origin, ''), '').slice(1) : '';
  const hash = getCurrentHash();
  return createId({name, hash});
}

export const updateHash = ({anchor, affectHistory, manager}) => {
  const {hash, name, meta, exact} = anchor;
  const {basePath} = manager;
  const method = affectHistory ? 'pushState' : 'replaceState';
  const newPath = typeof window !== 'undefined' ? `${name ? `${exact ? window.location.origin : basePath}/${name}` : basePath}${hash ? `#${hash}` : ''}` : '';

  if (typeof window !== 'undefined') 
    window.history[method](undefined, undefined, newPath);
    console.log("window history: ", window.history);

  if (meta) {
    setMetaTags(meta);
  } else {
    manager.setDefaultMetaTags();
  }
}

// remove hash in url without affecting history or forcing reload
export const removeHash = ({manager}) => {
  if (typeof window !== 'undefined') 
    window.history.replaceState(
      undefined,
      manager.defaultMetaTags.title,
      manager ? manager.basePath : basePath
    );

  manager.setDefaultMetaTags();
}
