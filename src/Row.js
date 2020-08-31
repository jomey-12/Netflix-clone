import React ,{useState,useEffect}from 'react';
import axios from './axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';


function Row({title,fetchURL,isLargeRow}) {
    const base_url="https://image.tmdb.org/t/p/original/";
    const [movies, setmovies] = useState([]);
    const [trailerUrl,setTrailerUrl]=useState("");

    useEffect( () => {
        async function fetchData() {
            const request = await axios.get(fetchURL);
            setmovies(request.data.results);
            
            return request;

        }
        fetchData();
    }, [fetchURL]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
      const handleClick=((movie) => {
          if(trailerUrl){
              setTrailerUrl('');
          }
          else{
              movieTrailer(movie?.name || "")
              .then((url) => {
                  const urlparams=new URLSearchParams(new URL(url).search);
                  setTrailerUrl(urlparams.get('v'));

              })
              .catch((error) => console.log(error));
          }

      });
      console.log(movies);

    return (
        <div className="row">
            <h1>{title}</h1>
            <div className="row_posters">
                {movies.map((movie) => (
                    <img 
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${isLargeRow && "row_poster_large"}`}
                    src={`${base_url}${isLargeRow ?  movie.poster_path:movie.backdrop_path}`}
                    alt={movie.original_name} />
                ))}
            </div>
            
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}  />}
            
            
        </div>
    )
}

export default Row
