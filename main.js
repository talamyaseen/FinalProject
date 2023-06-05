

const { prompt} = require('./IO');
const { displayMovieCatalog,
  addMovie,
  updateMovie,
  deleteMovie,
   searchAndFilterMovies,
  fetchMoviesFromAPI} = require('./Tasks');
async function execute(choice,fname){

    



      switch(choice){
          case 1:
          await displayMovieCatalog(fname);
          
              break;
          case 2:
            await addMovie(fname);
          
            break;
          case 3:
            await updateMovie(fname);
              break;  
  
          case 4:
            await deleteMovie(fname);
          break;
       case 5:
        await searchAndFilterMovies(fname);
          break;

          case 6:
           await fetchMoviesFromAPI(fname)
            break;
  
          
        default: return "yes";
  
  
      }
      return "next";
  }


  async function main() {
    const fname = 'moviesList.json';
    console.log("***************************");
    console.log("Welcome to Movie Catalog CLI Application");
    console.log("***************************");
    console.log("Select an action:\n" +
        "1) Display Movie Catalog:\n" +
        "2) Add New Movie:\n" +
        "3) Update Movie Details:\n" +
        "4) Delete Movie:\n" +
        "5) Search and Filter a Movie:\n" +
        "6) Add additional movies from the API \n" +
        "7) Exit\n" +
        "***************************");
  
   var choice = parseInt(await prompt('What is your choice? '));
      console.log(choice);
    while (true) {
      
     const r=await execute(choice, fname);
      if (r == "yes") break
      else if(r=='next'){
        console.log("Select an action:\n" +
        "1) Display Movie Catalog:\n" +
        "2) Add New Movie:\n" +
        "3) Update Movie Details:\n" +
        "4) Delete Movie:\n" +
        "5) Search and Filter a Movie:\n" +
        "6) Add additional movies from the API \n" +
        "7) Exit\n" +
        "***************************");
  
   var choice = parseInt(await prompt('What is your choice? '));
      console.log(choice);
      }
      }
    }
  main();