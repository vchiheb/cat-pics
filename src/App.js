import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';

function Header(){
  return (
    <header>
      <h1>Cat Gallery</h1>
    </header>
  )
}

function PokemonCard({item, index, fnHandleShowInfo}) {
  const style = {
    backgroundImage: `url(${item[0].image})`
  }


  return (
    <>
    <div className="flex-item" key={index}>
        <div className="column-container">
          <div className="breed-info">{item[0].breeds}</div>
          <div className="breed-img" style={style} onClick={() => fnHandleShowInfo(index)}></div>
        </div>
    </div>
  </>
  )
}

const BASE_URL = 'https://api.thecatapi.com/v1/images/search';

function App() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [overlayActive, setOverlayActive] = useState(false);
  const [breed, setBreed] = useState('');
  const [breedDescription, setBreedDescription] = useState('');
  const [wikiLink, setWikiLink] = useState('');
  const [temperament, setTemperament] = useState('');

  async function getOnePokemon(id) {
    const url = BASE_URL + id;
    const response = await fetch(url);

    const data = await response.json();
    return data;
  }

  async function getPokemon(start, end) {
    let data = [];
    for (let i = start; i < end; i++ ) {
      try {
        let url = BASE_URL + '?has_breeds=1';
        console.log(' url: ' + url);
        let response = await fetch(url);
        let json = await response.json();
        console.log(' json: ' + json);
        const image = json[0]['url'];
        json[0].image = image;
        json[0].id = json[0]['id'];
        let catInfo = [];
        catInfo['image'] = image;
        catInfo['id'] = i;
        // get breed info
        url = 'https://api.thecatapi.com/v1/images/' + json[0].id;
        console.log('url2; ' + url);
        let response2 = await fetch(url);
        let json2 = await response2.json();
        json[0]["breeds"] = json2["breeds"][0]['name'];
        console.log(' json: ' + json2);
        console.log('BREED: ' + json.breeds);
        json[0]['breedDescription'] = json2["breeds"][0]["description"];
        //alert(' foo 2; ' + json2['wikipedia_url']);
        json[0]['wikiLink'] = json2["breeds"][0].wikipedia_url;
        console.log(' id: ' + json.id);
        json[0]['temperament'] = json2["breeds"][0].temperament;
        data.push(json);
        console.log("CAT INFO: " + JSON.stringify(data[i]));
      } catch(err) {
        console.log('API error: ' + err);
      }
    }   
    return data;
  }

  async function fetchData(){


    let newItems = await getPokemon(((page - 1) * itemsPerPage), page * itemsPerPage);

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

  function handleCloseModal() {
    setOverlayActive(false);
  }

  function fnHandleShowInfo(id) {
    setBreed(items[id][0].breeds);
    setTemperament(items[id][0].temperament)
    setBreedDescription(items[id][0].breedDescription);
    setWikiLink(items[id][0].wikiLink);
    setOverlayActive(true);
  }

  return (
    <>

    <div id="modalOverlay" className={overlayActive ? 'active modal-overlay' : 'modal-overlay'}>
    <div className="modal-content">
      <h2>{breed}</h2>
      <p>{temperament}</p>
      <p>{breedDescription}</p>
      <p><a href={wikiLink} target="_blank">Wikipedia Article</a></p>
      <button id="closeModalBtn" onClick={handleCloseModal}>Close</button>
    </div>
    </div>
      <Header />
      <InfiniteScroll
      dataLength={items.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <div className='flex-container'>
      {items.map((item, index) => (
        <PokemonCard key={index} item={item} index={index} fnHandleShowInfo={fnHandleShowInfo}/>
      ))
      }

      </div>
    </InfiniteScroll>
    </>
  )
}

export default App;
