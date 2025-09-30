export default function GalleryCard({item, index, fnHandleShowInfo}) {
  const style = {
    backgroundImage: `url(${item.image})`
  }

  return (
    <>
    <div className="flex-item" key={index}>
        <div className="column-container">
          <div className="breed-info">{item.breeds}</div>
          <div className="breed-img" style={style} onClick={() => fnHandleShowInfo(index)}></div>
        </div>
    </div>
  </>
  )
}