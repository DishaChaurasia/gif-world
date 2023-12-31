import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader"
import Paginate from "./Paginate";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Giphy = () => {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false) 
  const [search, setSearch] = useState("") 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  
  useEffect(() => {
    
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
      try {
        const result = await axios("https://api.giphy.com/v1/gifs/trending", {
          params: {
            api_key: "wzWSigZr34jSBRIydDWKPbpz1IeCkYMX",
            limit: 50
          }
        });
        console.log(result)
        setData(result.data.data)
      } 
      catch (err) {
        setIsError(true)
        console.log(err)
      }

      setIsLoading(false)
    }
    fetchData()
  }, []);
  const renderGifs = () => {
    if (isLoading) {
      return <Loader />;
    }

    return currentItems.map(el => {
      return (<>
         
        <div key={el.id} className="gif">
          <img src={el.images.fixed_height.url} alt="Smiley face" />
          <div className="button-container">
          <Button onClick={() =>{
              localStorage[el.id]=el.images.fixed_height.url
          }} className="fav-button" variant="danger">
            <i class="fa fa-heart"></i>
          </Button>
          </div>
        </div>
        </>
      );
    });
  };

  const renderError = () => {
    if (isError) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Unable to get Gifs, please try again in a few minutes
        </div>
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const handleSubmit = async (event) => {
    setIsError(false);
    setIsLoading(true);
    try {
      event.preventDefault();
      const results = await axios("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "GlVGYHkr3WSBnllca54iNt0yFbjz7L65",
          q: search,
          limit: 50
        }
      })
      setData(results.data.data);
      setIsLoading(false);
    }
    catch {
      setIsError(true);
      console.log("error")
      setTimeout(() => setIsError(false), 4000);
    }
  }

  const pageSelected = pageNumber => {
      setCurrentPage(pageNumber);
  };
 
  

  return (
    <>
        
      <form className="form-inline justify-content-center m-2">        
      <input
        value={search}
        onChange={handleSearchChange}
        type="text"
        placeholder="Article name or keywords..."
        className="form-control new-form"
      />
      <span>
        <button
          onClick={handleSubmit}
          type="submit"
          className="new-btn btn btn-primary mx-4"
        >
          Search
        </button>

        <Button className="link-button">
            <Link to={"/favorites"}>
            Favorite GIFs
            </Link>
        </Button>
      </span>
      </form>
      
<div className="m-3"> {renderError()}</div>
      <div className="container gifs">{renderGifs()}</div>

      <Paginate
        pageSelected={pageSelected}
  
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />    
    </>
  );
};
export default Giphy;