

const {readJSONFile,
    writeJSONFile,
    prompt} = require('./IO');
    const http = require('http');
    const fs = require('fs').promises;
    
async function addMovie(filename) {
  console.log('Please provide details for the new movie:');
  const title = await prompt('Title: ');
  const director = await prompt('Director: ');
  const rating = await prompt('Rating: ');
  const description =await prompt('Description: ');
  const releaseYear = await prompt('Release Year: ');
  const genreInput = await prompt('Genre (comma-separated): ');
  const genre = genreInput.split(',').map(item => item.trim());

  const newMovie = {
    title: title,
    director: director,
    rating:rating,
    description: description,
    release_year: parseInt(releaseYear),
    genre: genre
  };

  try {
    const jsonData = await readJSONFile(filename);
    jsonData.push(newMovie);
    await writeJSONFile(filename, jsonData);
    console.log('New movie added successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}


async function displayMovieCatalog(filename) {
  try {
    const jsonData = await readJSONFile(filename);
    jsonData.forEach(movie => {
      console.log('Title:', movie.title);
      console.log('Director:', movie.director);
      console.log('Rating:', movie.rating);
      console.log('Description:', movie.description);
      console.log('Release Year:', movie.release_year);
      console.log('Genre:', movie.genre.join(', '));
      console.log('------------------------');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateMovie(filename) {
  try {
    const jsonData = await readJSONFile(filename);
    console.log('Select the movie you want to update:');
    jsonData.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
    });
    const movieIndex = parseInt(await prompt('Enter the movie number: '));
    if (isNaN(movieIndex) || movieIndex < 1 || movieIndex > jsonData.length) {
      console.log('Invalid movie number!');
      return;
    }
    const movie = jsonData[movieIndex - 1];
    console.log('Current details:');
    console.log('Title:', movie.title);
    console.log('Director:', movie.director);
    console.log('Rating:', movie.rating);
    console.log('Description:', movie.description);
    console.log('Release Year:', movie.release_year);
    console.log('Genre:', movie.genre.join(', '));

    console.log('Please provide the updated details:');
    const title = await prompt('Title: ');
    const director = await prompt('Director: ');
    const rating = await prompt('Rating: ');
  const description =await prompt('Description: ');
    const releaseYear = await prompt('Release Year: ');
    const genreInput = await prompt('Genre (comma-separated): ');
    const genre = genreInput.split(',').map(item => item.trim());

    movie.title = title;
    movie.director = director;
    movie.rating=rating;
    movie.description=description;
    movie.release_year = parseInt(releaseYear);
    movie.genre = genre;

    await writeJSONFile(filename, jsonData);
    console.log('Movie details updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteMovie(filename) {
  try {
    const jsonData = await readJSONFile(filename);
    console.log('Select the movie you want to delete:');
    jsonData.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
    });
    const movieIndex = parseInt(await prompt('Enter the movie number: '));
    if (isNaN(movieIndex) || movieIndex < 1 || movieIndex > jsonData.length) {
      console.log('Invalid movie number!');
      return;
    }

    const deletedMovie = jsonData.splice(movieIndex - 1, 1)[0];
    await writeJSONFile(filename, jsonData);
    console.log('Movie deleted successfully!');
    console.log('Deleted Movie Details:');
    console.log('Title:', deletedMovie.title);
    console.log('Director:', deletedMovie.director);
    console.log('Rating:', deletedMovie.rating);
    console.log('Description:', deletedMovie.description);
    console.log('Release Year:', deletedMovie.release_year);
    console.log('Genre:', deletedMovie.genre.join(', '));
  } catch (error) {
    console.error('Error:', error);
  }
}

async function searchAndFilterMovies(filename) {
  try {
    const jsonData = await readJSONFile(filename);

    console.log('Search and Filter Movies:');
    console.log('1) Search by Title');
    console.log('2) Search by Director');
    console.log('3) Filter by Genre');
    console.log('4) Filter by Release Year');
    console.log('5) Cancel');

    const choice = parseInt(await prompt('Enter your choice: '));

    switch (choice) {
      case 1: {
        const searchTerm = await prompt('Enter the title to search: ');
        const searchResults = jsonData.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayMovies(searchResults);
        break;
      }
      case 2: {
        const searchTerm = await prompt('Enter the director to search: ');
        const searchResults = jsonData.filter(movie =>
          movie.director.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayMovies(searchResults);
        break;
      }
      case 3: {
        const genreFilter = await prompt('Enter the genre to filter: ');
        const filteredMovies = jsonData.filter(movie =>
          movie.genre.includes(genreFilter)
        );
        displayMovies(filteredMovies);
        break;
      }
      case 4: {
        const releaseYearFilter = parseInt(await prompt('Enter the release year to filter: '));
        const filteredMovies = jsonData.filter(movie =>
          movie.release_year === releaseYearFilter
        );
        displayMovies(filteredMovies);
        break;
      }
      case 5: {
        console.log('Cancelled');
        break;
      }
      default:
        console.log('Invalid choice');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayMovies(movies) {
  if (movies.length === 0) {
    console.log('No movies found.');
    return;
  }

  console.log('Movie Results:');
  movies.forEach(movie => {
    console.log('Title:', movie.title);
    console.log('Director:', movie.director);
    console.log('Rating:', movie.rating);
    console.log('Description:', movie.description);
    console.log('Release Year:', movie.release_year);
    console.log('Genre:', movie.genre.join(', '));
    console.log('------------------------');
  });
}



async function fetchMoviesFromAPI(filename) {
  try {
    const apiUrl = 'http://my-json-server.typicode.com/horizon-code-academy/fake-movies-api/movies';

    const req = http.get(apiUrl, async (res) => {
      if (res.statusCode !== 200) {
        throw new Error(`Failed to fetch movies from the API. Status: ${res.statusCode}`);
      }

      let apiData = '';

      res.on('data', (chunk) => {
        apiData += chunk;
      });

      res.on('end', async () => {
        try {
          apiData = JSON.parse(apiData);

          const jsonData = await readJSONFile(filename);
          jsonData.push(...apiData.map(movie => ({
            title: movie.title || '',
            director: movie.director || '',
            rating: movie.rating || '',
            description: movie.description || '',
            release_year: movie.releaseYear || '',
            genre: movie.genre || []
          })));

          await writeJSONFile(filename, jsonData);

          console.log('Movies fetched and added successfully!');
        } catch (error) {
          console.error('Error:', error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error);
    });

    req.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
    displayMovieCatalog,
    addMovie,
    updateMovie,
    deleteMovie,
     searchAndFilterMovies,
    fetchMoviesFromAPI
  };
  