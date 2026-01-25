// votd-import.js
// Imports VotD data from monthly JSON libraries and makes it available as window.vVotD
// Supports 3 modes: recent (default), specific month, entire archive

(async function () {
    'use strict';
    
    // Helper: Get YYYY-MM string from a Date object
    function fYearMonthString(dateObj) {
        const vYear = dateObj.getFullYear();
        const vMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        return `${vYear}-${vMonth}`;
    }
    
    
    // Set current month
    const vToday = new Date();
    
    let vVotDLibrary = {
    };
    
    try {
        
        let vLibraryFilesToLoad =[];
        
        let iDate = new Date(vToday.getFullYear(), vToday.getMonth(), 1);
        let iTerminate = new Date(vToday.getFullYear(), vToday.getMonth() -1, 1);
        
        if (window.vImportOptions ?.pMonth) {
            iDate = new Date(window.vImportOptions.pMonth);
            iTerminate = new Date(window.vImportOptions.pMonth);
        } else if (window.vImportOptions ?.pArchive) {
            iTerminate = new Date(2025, 11, 1);
        }
        
        while (iDate >= iTerminate) {
            vLibraryFilesToLoad.push(`https://votd.thedwellingword.org/${fYearMonthString(iDate)}.json`);
            iDate.setMonth(iDate.getMonth() -1);
        }
        
        console.log(`Loading ${vLibraryFilesToLoad.length} month file(s)`);
        
        
        
        // Fetch all files in parallel
        const vResponses = await Promise.all(
        vLibraryFilesToLoad.map(vURL => fetch(vURL). catch (err => ({
            ok: false, vURL
        }))));
        
        
        
        for (let i = 0; i < vResponses.length; i++) {
            const vResponse = vResponses[i];
            const vURL = vLibraryFilesToLoad[i];
            
            if (vResponse.ok) {
                const vData = await vResponse.json();
                Object.assign(vVotDLibrary, vData);
            } else {
                console.warn(`Month file not found or failed: ${url}`);
            }
        }
        
        
        if (Object.keys(vVotDLibrary).length === 0) {
            throw new Error('No verse data loaded from any file');
        }
        
        console.log(`Successfully loaded ${Object.keys(vVotDLibrary).length} days of verses`);
    }
    catch (error) {
        console.error('Error loading verse data:', error);
        return; // Stop execution if both files fail
    }
    
    
    // Filter out future verses
    
    const vVotDLibraryFiltered = Object.fromEntries(
    Object.entries(vVotDLibrary).filter(([vDateString]) => {
        const vVerseDate = new Date(vDateString);
        return vVerseDate <= vToday;
    }));
    
    
    // Expose globally
    window.vVotD = vVotDLibraryFiltered;
    
    // Optional: Dispatch event when ready
    document.dispatchEvent(new CustomEvent('eVotDImported', {
        detail: vVotD
    }));
})();