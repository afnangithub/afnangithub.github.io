var dbPromised = idb.open("football-data-org", 1, function (upgradeDb) {
  var competitionsObjectStore = upgradeDb.createObjectStore("competitions", {
    keyPath: "id"
  });
  competitionsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function saveForLater(competition) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("competitions", "readwrite");
      var store = tx.objectStore("competitions");
      console.log("data di saveForLater");
      console.log(competition);
      store.add(competition);
      return tx.complete;
    })
    .then(function () {
      console.log("Data berhasil di simpan.");
      M.toast({html: 'Data berhasil di simpan.'});
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("competitions", "readonly");
        var store = tx.objectStore("competitions");
        return store.getAll();
      })
      .then(function (competitions) {
        resolve(competitions);
      });
  });
}

function getAllByTitle(title) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("competitions", "readonly");
      var store = tx.objectStore("competitions");
      var titleIndex = store.index("name");
      var range = IDBKeyRange.bound(title, title + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function (competitions) {
      console.log(competitions);
    });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("competitions", "readonly");
        var store = tx.objectStore("competitions");
        return store.get(id);
      })
      .then(function (competition) {
        resolve(competition);
      });
  });
}
function deleteById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised.then(function (db) {
      var tx = db.transaction('competitions', 'readwrite');
      var store = tx.objectStore('competitions');
      store.delete(id);
      return tx.complete;
    }).then(function () {
      console.log('Item deleted');
      M.toast({html: 'Data berhasil di hapus.'});
    });
  });
}
/*
var dbPromised = idb.open("news-reader", 1, function(upgradeDb) {
  var articlesObjectStore = upgradeDb.createObjectStore("articles", {
    keyPath: "ID"
  });
  articlesObjectStore.createIndex("post_title", "post_title", {
    unique: false
  });
});

function saveForLater(article) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("articles", "readwrite");
      var store = tx.objectStore("articles");
      console.log(article);
      store.add(article.result);
      return tx.complete;
    })
    .then(function() {
      console.log("Artikel berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.getAll();
      })
      .then(function(articles) {
        resolve(articles);
      });
  });
}

function getAllByTitle(title) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("articles", "readonly");
      var store = tx.objectStore("articles");
      var titleIndex = store.index("post_title");
      var range = IDBKeyRange.bound(title, title + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function(articles) {
      console.log(articles);
    });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}

*/