let pageOnLocalStorage = localStorage.getItem('page');

// Global Objects
const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: `${pageOnLocalStorage}`,
    totalPage: 1,
    totalResult: 0,
  },
  api: {
    key: 'c1f69dbd36b376c016d622294a642943',
    url: 'https://api.themoviedb.org/3/',
  },
};


// Display 20 popular movies Function
async function displayPopularMovies() {
  const { results } = await fetchAPIData('/movie/popular');
  // creating popular movie element
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
        : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  </div>`;
    document.getElementById('popular-movies').appendChild(div);
  });
}

// Display 20 popular TV shows Function
async function displayPopularTvShows() {
  const { results } = await fetchAPIData('tv/popular');
  // creating the Tv shows element

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">

        ${show.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top" alt="${show.original_name}" />`
        : `<img src =./images/no-image.jpg class="card-img-top" alt="${show.original_name}" />`
      }
              
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.original_name}</h5>
            <p class="card-text">
              <small class="text-muted">Since: ${show.first_air_date}</small>
            </p>
          </div>
        </div>`;
    document.getElementById('popular-shows').appendChild(div);
  });
}

//Display movie details Function
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
      : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
    }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')
    }
    </ul>
    <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> ${movie.budget.toLocaleString()}</li>
    <li><span class="text-secondary">Revenue:</span> ${movie.revenue.toLocaleString()}</li>
    <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minuites</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name} </span>`).join(', ')
    }
  
  </div>
</div>
  `;

  document.getElementById('movie-details').appendChild(div);
}

// Search Function
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchAPIData();

    global.search.totalPage = total_pages;
    global.search.totalResult = total_results;

    if (results.length === 0) {
      showAlert('No results Found');
      return;
    }

    displaySearchResult(results);

  } else {
    showAlert('Please Enter a search Term', 'error');
  }


}

// Display Search Result function
function displaySearchResult(results) {

  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');

    div.classList.add('card');
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
      ${result.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />`
        : `<img src="images/no-image.jpg" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">${global.search.type === 'movie' ? 'Release:' : 'Since:'} ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
    </div>
  </div>`;
    document.getElementById('search-results').appendChild(div);

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} out of ${global.search.totalResult} results for ${global.search.term} </h2>
    `;
  });
  console.log(global.search.page);

  displayPagination();
}

// Create and Display Pagination for search Function
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPage}</div>
      `;
  document.querySelector('#pagination').appendChild(div);

  // Disable prev button on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button on last page
  if (global.search.page === global.search.totalPage) {
    document.querySelector('#next').disabled = true;
  }

  // Next Page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    localStorage.setItem('page', global.search.page);
    const { results, total_pages } = await searchAPIData();
    displaySearchResult(results);

  });

  // Prev Page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    localStorage.setItem('page', global.search.page);
    const { results, total_pages } = await searchAPIData();
    displaySearchResult(results);
  });
}

//Display TV-Show details Function
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}`);

  // overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${show.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.title}" />`
      : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.title}" />`
    }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted"> Since: ${show.first_air_date
    }</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>
  `;
  document.querySelector('#show-details').appendChild(div);
}


// Display Backdrop on details page Function
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0px';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Display slider Function
async function displaySlider(medium) {

  const { results } = await fetchAPIData(`${medium === 'movie' ? `${medium}/now_playing` : `${medium}/on_the_air`}`);
  console.log(results);
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="${medium === 'movie' ? `movie` : `tv`}-details.html?id=${result.id}">
              <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="${medium === 'movie' ? result.original_title : result.original_name}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(1)} / 10
            </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
}


// @todo flip effect

// Initialising the swiper Function
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    autoplay: {
      delay: 0,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,

    },
    spaceBetween: 30,
    speed: 4000,
    slidesPerView: 1,



    breakpoints: {
      500: {

        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,

      },
    }
  });
}

//Showing Alert Function
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

//Fetch data from the API Function
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;
  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  hideSpinner();

  return data;
}

//Search data from the API Function;
async function searchAPIData() {
  const API_KEY = global.api.key;
  const API_URL = global.api.url;
  showSpinner();

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&query=${global.search.term}&language=en-US&page=${global.search.page}`);
  const data = await response.json();
  hideSpinner();

  return data;
}

// Spinner Functions
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active links
function highlightActiveLinks() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}




// Init the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      displaySlider('movie');
      break;
    case '/shows.html':
    case '/shows':
      displayPopularTvShows();
      displaySlider('tv');
      break;
    case '/movie-details.html':
    case '/movie-details':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  highlightActiveLinks();

}

// Local Storage ----------------

// Set current search page to local storage



// Initialise the app on DOMContentLoader event listner
document.addEventListener('DOMContentLoaded', init);

// Changing the page no. in local storage back to 1 
document.querySelector('#search-btn').addEventListener('click', () => { localStorage.setItem('page', 1); });


