import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import CatCard from './components/GalleryCard';
import Gallery from './components/Gallery';
import BreedInformationDialog  from './components/BreedInformationDialog';
import Cat from './data/Cat';

const BASE_URL = 'https://api.thecatapi.com/v1/images/';

function App() {
  const itemsPerPage = 9;
  
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [overlayActive, setOverlayActive] = useState(false);
  const [catBreed, setCatBreed] = useState(null);

  async function getCats(start, end) {
    let data = [];
    for (let i = start; i < end; i++ ) {
      try {
        // get random cat that includes breed 
        let url = BASE_URL + 'search?has_breeds=1';
        let response = await fetch(url);
        let json = await response.json();
        
        let item = json[0];
        let info = {};
        
        info["image"] = item['url'];
        info["id"] = item['id'];  

        // get breed info
        url = BASE_URL + json[0].id;
        response = await fetch(url);
        json = await response.json();
        item = json["breeds"][0];

        info["breeds"] = item['name'];
        info['breedDescription'] = item["description"];
        info['wikiLink'] = item.wikipedia_url;
        info['temperament'] = item.temperament;
        data.push(info);
      } catch(err) {
        console.log('API error: ' + err);
      }
    }   
    return data;
  }

  async function fetchData(){
    let newItems = await getCats(((page - 1) * itemsPerPage), page * itemsPerPage);

    if (page == 1) {
        setItems((prevItems) => [...newItems]); 
    } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
    }
    if (page >= 100 ) { 
      setHasMore(false);
    }
    if (page == 1) {
      setPage(2);
    } else {
      setPage((prevPage) => prevPage + 1);
      }  
            
  };  

  useEffect(() => {
    fetchData(); // Load initial data
  }, []);

  function handleCloseBreedInfo() {
    setOverlayActive(false);
  }

  function fnHandleShowBreedInfo(id) {
    let info = items[id];
    let breedInfo = new Cat(info.breeds, info.temperament, info.breedDescription, info.wikiLink);
    setCatBreed(breedInfo);
    setOverlayActive(true);
  }

  return (
    <>
      <BreedInformationDialog overlayActive={overlayActive} breed={catBreed} handleCloseBreedInfo={handleCloseBreedInfo}/>
      <Header />
      <Gallery items={items} fetchData={fetchData} hasMore={hasMore} fnHandleShowInfo={fnHandleShowBreedInfo} />
    </>
  )
}

export default App;
