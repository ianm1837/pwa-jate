import { openDB } from 'idb';

export const initdb = async () =>
  openDB('jateDB', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jateObj')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jateObj', { keyPath: 'id' });
      console.log('jate database created');
    },
  })
  // .then((db) => {
  //   db.add('jateObj', {id: 'textData', content: ''});
  //   console.log('db value: ', db);
  // });

// : Add logic to a method that accepts some content and adds it to the database
export const putDb = async (data) => {

  const jateDb = await openDB('jateDB', 1);

  const tx = jateDb.transaction('jateObj', 'readwrite');

  const store = tx.objectStore('jateObj');

  const request = store.put({ id: 'textData', content: data });

  await request;

}

// : Add logic for a method that gets all the content from the database
export const getDb = async () => {
  //try to get data from the database
  try{
    const jateDb = await openDB('jateDB', 1);
  
    const tx = jateDb.transaction('jateObj', 'readonly');
  
    const store = tx.objectStore('jateObj');
  
    const request = store.get('textData');
  
    const result = await request;
  
    return result.content;
  }
  catch(err){
    //if there is an error (or data does not exist), return false to load defaults
    return false;
  }

}

initdb();
