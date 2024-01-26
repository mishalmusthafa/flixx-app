const global = {
  currentPage: window.location.pathname
};

// Display 20 popular movies
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

// Display 20 popular TV shows
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

// Funtion to display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  // fetching the movieDeatails
  const movie = await fetchAPIData(`movie/${movieId}`);
  console.log(movie);
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

// Function to fetch data from the API
async function fetchAPIData(endpoint) {
  const API_KEY = 'c1f69dbd36b376c016d622294a642943';
  const API_URL = 'https://api.themoviedb.org/3/';
  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
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
      break;
    case '/shows.html':
      displyaPopularTvShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('tv details');
      break;
    case '/search.html':
      console.log('search');
      break;
  }

  highlightActiveLinks();

}


// Initialise the app on DOMContentLoader event listner
document.addEventListener('DOMContentLoaded', init);
