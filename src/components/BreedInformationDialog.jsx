export default function BreedInformationDialog({overlayActive, breed, handleCloseBreedInfo}) {
    return (
        
         (breed != null) &&       
         <div id="modalOverlay" className={overlayActive ? 'active modal-overlay' : 'modal-overlay'}>
            <div className="modal-content breed-info">
                <h2>{breed.breed}</h2>
                <p>{breed.temperament}</p>
                <p>{breed.description}</p>
                <p><a href={breed.wikilink} target="_blank">Wikipedia Article</a></p>
                <div class="button" id="closeModalBtn" onClick={handleCloseBreedInfo}>Close</div>
            </div>
        </div>
    
    )
}