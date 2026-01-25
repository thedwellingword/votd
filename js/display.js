document.addEventListener('eVotDImported', (event) => {
    
    if (document.getElementById('iVotDLibrary')) {
        fInsertVotDLibrary();
        
        
        const vLinkCurrent = document.getElementById('lCurrent');
        const vLinkRecent = document.getElementById('lRecent');
        const vLinkArchive = document.getElementById('lArchive');
        
        const vDivCurrent = document.getElementById('iVotDCurrent');
        const vDivRecent = document.getElementById('iVotDRecent');
        const vDivArchive = document.getElementById('iVotDArchive');
        
        if (vLinkCurrent) {
            vLinkCurrent.addEventListener('click', (e) => {
                e.preventDefault();
                
                vDivCurrent.classList.remove('votd-hidden');
                vDivRecent.classList.add('votd-hidden');
                vDivArchive.classList.add('votd-hidden');
            });
        }
        
        if (vLinkRecent) {
            vLinkRecent.addEventListener('click', (e) => {
                e.preventDefault();
                
                vDivCurrent.classList.remove('votd-hidden');
                vDivRecent.classList.remove('votd-hidden');
                vDivArchive.classList.add('votd-hidden');
            });
        }
        
        if (vLinkArchive) {
            vLinkArchive.addEventListener('click', (e) => {
                e.preventDefault();
                
                vDivCurrent.classList.remove('votd-hidden');
                vDivRecent.classList.remove('votd-hidden');
                vDivArchive.classList.remove('votd-hidden');
            });
        }
    }
})