//var base_url = "https://readerapi.codepolitan.com/";
var base_url = "https://api.football-data.org/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

var API_KEY = "37019a48f3cf40709e6e41b8122dc4f6";

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}

function getKlasemenLiga(standingType) {
  endpointApi = "v2/competitions/2001/standings?standingType=" + standingType;
  if ("caches" in window) {
    caches.match(base_url + endpointApi).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var competitionHTML = "";
          var d = new Date(data.competition.lastUpdated);
          if (data.season.winner === null) {
            data.season.winner = "??"
          }
          competitionHTML += `
          <div class="card">
            <div class="card-content">
              <span class="card-title truncate">Info Competition</span>
              <p>Name Competition : ${data.competition.name}</p>
              <p>Area Name : ${data.competition.area.name}</p>
              <p>Last Updated : ${d}</p>
              <span class="card-title truncate">Info Season</span>
              <p>Start Date : ${data.season.startDate}</p>
              <p>End Date : ${data.season.endDate}</p>
              <p>CurrentMatchday : ${data.season.currentMatchday}</p>
              <p>Winner : ${data.season.winner}</p>
            </div>
          </div>
          `;
          data.standings.forEach(function (standing) {
            competitionHTML += `
            <div class="card">
            <div class="card-content">
            <span class="card-title truncate">${standing.group}</span>
            `;
            standing.table.forEach(function (standing) {
              if (standing.team.crestUrl === null) {
                standing.team.crestUrl = "?";
              }
              standing.team.crestUrl = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
              competitionHTML += `
              <div class="card horizontal">
              <div class="card-image waves-effect waves-block waves-light">
              <img src="${standing.team.crestUrl}" style="width:128px;height:128px;"/>
              </div>
              <div class="card-stacked">
              <div class="card-content">
              <span class="card-title truncate">Position : ${standing.position}</span>
              <p>Name Team: ${standing.team.name}</p>
              <p>Played Games: ${standing.playedGames}</p>
              <p>Won: ${standing.won}</p>
              <p>Draw: ${standing.draw}</p>
              <p>Lost: ${standing.lost}</p>
              <p>Points: ${standing.points}</p>
              <p>Goals For: ${standing.goalsFor}</p>
              <p>Goals Against: ${standing.goalsAgainst}</p>
              <p>Goal Difference: ${standing.goalDifference}</p>
              </div>
              <div class="card-action">
              <a href="./team.html?id=${standing.team.id}">Info Team</a>
              </div>
              </div>
              </div>
              `;
            });
            competitionHTML += `
            </div>
            </div>
            `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("competition").innerHTML = competitionHTML;
        });
      }
    });
  }

  fetchApi(base_url + endpointApi)
    .then(status)
    .then(json)
    .then(function (data) {
      console.log(data);

      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var competitionHTML = "";
      var d = new Date(data.competition.lastUpdated);
      if (data.season.winner === null) {
        data.season.winner = "??"
      }
      competitionHTML += `
      <div class="card">
        <div class="card-content">
          <span class="card-title truncate">Info Competition</span>
          <p>Name Competition : ${data.competition.name}</p>
          <p>Area Name : ${data.competition.area.name}</p>
          <p>Last Updated : ${d}</p>
          <span class="card-title truncate">Info Season</span>
          <p>Start Date : ${data.season.startDate}</p>
          <p>End Date : ${data.season.endDate}</p>
          <p>CurrentMatchday : ${data.season.currentMatchday}</p>
          <p>Winner : ${data.season.winner}</p>
        </div>
      </div>
      `;
      data.standings.forEach(function (standing) {
        competitionHTML += `
        <div class="card">
        <div class="card-content">
        <span class="card-title truncate">${standing.group}</span>
        
        `;
        standing.table.forEach(function (standing) {
          if (standing.team.crestUrl === null) {
            standing.team.crestUrl = "?";
          }
          standing.team.crestUrl = standing.team.crestUrl.replace(/^http:\/\//i, 'https://');
          competitionHTML += `
          <div class="card horizontal">
          <div class="card-image waves-effect waves-block waves-light">
          <img src="${standing.team.crestUrl}" style="width:128px;height:128px;"/>
          </div>
          <div class="card-stacked">
          <div class="card-content">
          <span class="card-title truncate">Position : ${standing.position}</span>
          <p>Name Team: ${standing.team.name}</p>
          <p>Played Games: ${standing.playedGames}</p>
          <p>Won: ${standing.won}</p>
          <p>Draw: ${standing.draw}</p>
          <p>Lost: ${standing.lost}</p>
          <p>Points: ${standing.points}</p>
          <p>Goals For: ${standing.goalsFor}</p>
          <p>Goals Against: ${standing.goalsAgainst}</p>
          <p>Goal Difference: ${standing.goalDifference}</p>
          </div>
          <div class="card-action">
          <a href="./team.html?id=${standing.team.id}">Info Team</a>
          </div>
          </div>
          </div>
          `;
        });
        competitionHTML += `
        </div>
        </div>
        `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("competition").innerHTML = competitionHTML;
    })
    .catch(error);
}

function getInfoTeam() {
  endpointApi = "v2/teams/";
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + endpointApi + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            if (data.crestUrl === null) {
              data.crestUrl = "?";
            }
            data.crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
            var teamHTML = `
            <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.crestUrl}" style="width:128px;height:128px;"/>
            </div>
            <div class="card-content">
            <span class="card-title">${data.shortName}</span>
            <p>Name: ${data.name}</p>
            <p>tla: ${data.tla}</p>
            <p>Phone: ${data.phone}</p>
            <p>Website: ${data.website}</p>
            <p>Email: ${data.email}</p>
            <p>Founded: ${data.founded}</p>
            <p>Club Colors: ${data.clubColors}</p>
            <p>Venue: ${data.venue}</p>
            </div>
            </div>
            <div class="card">
            <div class="card-content">
            <span class="card-title">Squad</span>
            `;
            data.squad.forEach(function (squad) {
              var d = new Date(squad.dateOfBirth);
              teamHTML += `
              <div class="card">
              <div class="card-content">
              <span class="card-title">${squad.name}</span>
              <p>Position: ${squad.position}</p>
              <p>Date Of Birth: ${d}</p>
              <p>Country Of Birth: ${squad.countryOfBirth}</p>
              <p>Nationality: ${squad.nationality}</p>
              <p>Shirt Number: ${squad.shirtNumber}</p>
              <p>Role : ${squad.role}</p>
              </div>
              </div>
              `;
            });
            teamHTML += `
            </div>
            </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(base_url + endpointApi + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        if (data.crestUrl === null) {
          data.crestUrl = "?";
        }
        data.crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
        var teamHTML = `
        <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
        <img src="${data.crestUrl}" style="width:128px;height:128px;"/>
        </div>
        <div class="card-content">
        <span class="card-title">${data.shortName}</span>
        <p>Name: ${data.name}</p>
        <p>tla: ${data.tla}</p>
        <p>Phone: ${data.phone}</p>
        <p>Website: ${data.website}</p>
        <p>Email: ${data.email}</p>
        <p>Founded: ${data.founded}</p>
        <p>Club Colors: ${data.clubColors}</p>
        <p>Venue: ${data.venue}</p>
        </div>
        </div>
        <div class="card">
        <div class="card-content">
        <span class="card-title">Squad</span>
        `;
        data.squad.forEach(function (squad) {
          var d = new Date(squad.dateOfBirth);
          teamHTML += `
          <div class="card">
          <div class="card-content">
          <span class="card-title">${squad.name}</span>
          <p>Position: ${squad.position}</p>
          <p>Date Of Birth: ${d}</p>
          <p>Country Of Birth: ${squad.countryOfBirth}</p>
          <p>Nationality: ${squad.nationality}</p>
          <p>Shirt Number: ${squad.shirtNumber}</p>
          <p>Role : ${squad.role}</p>
          </div>
          </div>
          `;
        });
        teamHTML += `
        </div>
        </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedKlasemenLiga() {
  getAll().then(function (competitions) {
    var competitionHTML = "";
    competitions.forEach(function (data) {
      if (data.crestUrl === null) {
        data.crestUrl = "?";
      }
      data.crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
      competitionHTML += `
        <div class="card horizontal">
        <div class="card-image waves-effect waves-block waves-light">
        <img src="${data.crestUrl}" style="width:128px;height:128px;"/>
        </div>
        <div class="card-stacked">
        <div class="card-content">
        <span class="card-title">${data.shortName}</span>
        <p>Name: ${data.name}</p>
        <p>tla: ${data.tla}</p>
        <p>Phone: ${data.phone}</p>
        <p>Website: ${data.website}</p>
        <p>Email: ${data.email}</p>
        <p>Founded: ${data.founded}</p>
        <p>Club Colors: ${data.clubColors}</p>
        <p>Venue: ${data.venue}</p>
        <div class="card-action">
        <a href="./team.html?id=${data.id}&saved=true">Info Team</a>
        <a href="./#saved" onclick="delSavedInfoTeam(${data.id})">Hapus Info Team</a>
        </div>
        </div>
        </div>
        </div>
        `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("competition").innerHTML = competitionHTML;
  });
}

function getSavedInfoTeam() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  console.info(idParam);
  var id = parseInt(idParam);
  getById(id).then(function (data) {
    if (data.crestUrl === null) {
      data.crestUrl = "?";
    }
    data.crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
    teamHTML = '';
    var teamHTML = `
    <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
        <img src="${data.crestUrl}" style="width:128px;height:128px;"/>
        </div>
        <div class="card-content">
        <span class="card-title">${data.shortName}</span>
        <p>Name: ${data.name}</p>
        <p>tla: ${data.tla}</p>
        <p>Phone: ${data.phone}</p>
        <p>Website: ${data.website}</p>
        <p>Email: ${data.email}</p>
        <p>Founded: ${data.founded}</p>
        <p>Club Colors: ${data.clubColors}</p>
        <p>Venue: ${data.venue}</p>
        </div>
        </div>
        <div class="card">
        <div class="card-content">
        <span class="card-title">Squad</span>
        `;
    data.squad.forEach(function (squad) {
      var d = new Date(squad.dateOfBirth);
      teamHTML += `
          <div class="card">
          <div class="card-content">
          <span class="card-title">${squad.name}</span>
          <p>Position: ${squad.position}</p>
          <p>Date Of Birth: ${d}</p>
          <p>Country Of Birth: ${squad.countryOfBirth}</p>
          <p>Nationality: ${squad.nationality}</p>
          <p>Shirt Number: ${squad.shirtNumber}</p>
          <p>Role : ${squad.role}</p>
          </div>
          </div>
          `;
    });
    teamHTML += `
        </div>
        </div>
        `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
  });
}
function delSavedInfoTeam(idParam) {
  console.info(idParam);
  deleteById(idParam);
  getSavedKlasemenLiga();
}
/*
// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(base_url + "articles").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var articlesHTML = "";
          data.result.forEach(function (article) {
            articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.thumbnail}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.title}</span>
                      <p>${article.description}</p>
                    </div>
                  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetch(base_url + "articles")
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var articlesHTML = "";
      data.result.forEach(function (article) {
        articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                  <p>${article.description}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "article/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            var articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
          `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "article/" + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  getAll().then(function (articles) {
    console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    var articlesHTML = "";
    articles.forEach(function (article) {
      var description = article.post_content.substring(0, 100);

      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.ID}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${
        article.post_title
        }</span>
                      <p>${description}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  getById(idParam).then(function (article) {
    articleHTML = '';
    var articleHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${article.cover}" />
      </div>
      <div class="card-content">
        <span class="card-title">${article.post_title}</span>
        ${snarkdown(article.post_content)}
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}
*/