import InfiniteScroll from 'react-infinite-scroll-component';
import CatCard from './GalleryCard';

export default function Gallery({items, fetchData, hasMore, fnHandleShowInfo}) {

    return (
     <InfiniteScroll
           dataLength={items.length}
           next={fetchData}
           hasMore={hasMore}
           loader={<div id="loading"><h4>Loading...</h4></div>}
           endMessage={
             <p style={{ textAlign: 'center' }}>
               <b>Yay! You have seen it all</b>
             </p>
           }
         >
           <div className='gallery'>
           {items.map((item, index) => (
             <CatCard key={index} item={item} index={index} fnHandleShowInfo={fnHandleShowInfo}/>
           ))
           }
     
           </div>
         </InfiniteScroll>
        )
}