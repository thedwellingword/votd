
function fTodayString() {
    
    const vToday = new Date();
    
    return fDateString(vToday);
}

function fYesterdayString() {
    
    const vDate = new Date();
    vDate.setDate(vDate.getDate() - 1);
    
    return fDateString(vDate);
}

function fDateString(pDate) {
    const vYear = pDate.getFullYear();
    const vMonth = String(pDate.getMonth() + 1).padStart(2, '0');
    const vDay = String(pDate.getDate()).padStart(2, '0');
    return `${vYear}-${vMonth}-${vDay}`;
}

function fIsTodayVotMAvailable() {
    
    return new Date().getHours() >= 6;
}

function fIsTodayVotEAvailable() {
    
    return new Date().getHours() >= 15;
}

function fRetrieveVotM(pDate) {
    
    const vDate = fDateString(pDate);
    
    if (window.vVotD[vDate].AM) {
        return {
            D: vDate,
            P: 'AM',
            R: window.vVotD[vDate].AM.R,
            T: window.vVotD[vDate].AM.T
        }
    }
    return null;
}

function fRetrieveVotE(pDate) {
    
    const vDate = fDateString(pDate);
    
    if (window.vVotD[vDate].PM) {
        return {
            D: vDate,
            P: 'PM',
            R: window.vVotD[vDate].PM.R,
            T: window.vVotD[vDate].PM.T
        }
    }
    return null;
}

function fRetrieveVotD(pDate, pPeriod) {
    
    switch (pPeriod) {
        case 'AM':
        return fRetrieveVotM(pDate);
        case 'PM':
        return fRetrieveVotE(pDate);
        default:
        return null;
    }
}

function fRetrieveVotMMostRecent() {
    
    if (fIsTodayVotMAvailable()) {
        return fRetrieveVotM(new Date());
    } else {
        return fRetrieveVotMPrevious(1);
    }
}

function fRetrieveVotEMostRecent() {
    
    if (fIsTodayVotEAvailable()) {
        return fRetrieveVotE(new Date());
    } else {
        return fRetrieveVotEPrevious(1);
    }
}

function fRetrieveVotDMostRecent() {
    
    if (fIsTodayVotEAvailable()) {
        return fRetrieveVotE(new Date());
    } else if (fIsTodayVotMAvailable()) {
        return fRetrieveVotM(new Date());
    } else {
        return fRetrieveVotEPrevious(1);
    }
}

function fRetrieveVotMPrevious(pDays) {
    
    const vDate = new Date();
    vDate.setDate(vDate.getDate() - pDays);
    
    return fRetrieveVotM(vDate);
}

function fRetrieveVotEPrevious(pDays) {
    
    const vDate = new Date();
    vDate.setDate(vDate.getDate() - pDays);
    
    return fRetrieveVotE(vDate);
}

function fConstructVerseHTML(vVerse) {
    if (! vVerse) {
        return '<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-text">No verse available today.</div></div>';
    }
    
    let vHashTag = '#Null';
    let vColour = 'grey';
    let vPeriod = 'votd';
    
    switch (vVerse.P) {
        case 'AM':
        vHashTag = '#VerseOfTheMorning';
        vColour = 'yellow';
        vPeriod = 'votm';
        break;
        case 'PM':
        vHashTag = '#VerseOfTheEvening';
        vColour = 'purple';
        vPeriod = 'vote';
        break;
    }
    
    return '<div class="kg-card kg-callout-card kg-callout-card-' + vColour + ' ' + vPeriod + '">' +
    '<div class="kg-callout-text">' +
    '<div class="votd-text">' +
    vVerse.T +
    '</div>' +
    '<div class="votd-reference">~ ' +
    vVerse.R +
    '</div>' +
    '<div class="votd-date">' +
    vVerse.D +
    '</div>' +
    '<div class="votd-hashtag">' +
    vHashTag +
    '</div>' +
    '</div>' +
    '</div>';
}

function fConstructCurrent() {
    
    let vHTML = '';
    
    vHTML += '<div id="iVotDCurrent" class="votd-visible">';
    
    vHTML += fConstructVerseHTML(fRetrieveVotDMostRecent());
    
    vHTML += '</div>';
    
    return vHTML;
}

function fConstructRecent() {
    
    let vHTML = '';
    
    vHTML += '<div id="iVotDRecent" class="votd-hidden">';
    
    if (fIsTodayVotMAvailable()) {
        
        if (fIsTodayVotEAvailable()) {
            vHTML += fConstructVerseHTML(fRetrieveVotM(new Date));
        }
        
        vHTML += fConstructVerseHTML(fRetrieveVotEPrevious(1));
    }
    
    vHTML += fConstructVerseHTML(fRetrieveVotMPrevious(1));
    
    for (let vDay = 2; vDay <= 7; vDay++) {
        vHTML += fConstructVerseHTML(fRetrieveVotEPrevious(vDay));
        vHTML += fConstructVerseHTML(fRetrieveVotMPrevious(vDay));
    }
    
    vHTML += '</div>';
    
    return vHTML;
}

function fConstructArchive() {
    
    let vHTML = '';
    
    vHTML += '<div id="iVotDArchive" class="votd-hidden">';
    
    let iDate = new Date();
    iDate.setDate(iDate.getDate() - 8);
    
    const iTerminationDate = new Date(2025, 11, 31);
    
    while (iDate >= iTerminationDate) {
        
        vHTML += fConstructVerseHTML(fRetrieveVotE(iDate));
        vHTML += fConstructVerseHTML(fRetrieveVotM(iDate));
        
        iDate.setDate(iDate.getDate() - 1);
    }
    
    vHTML += '</div>';
    
    return vHTML;
}

function fConstructVotDLibrary() {
    
    let vHTML = '';
    
    vHTML += fConstructCurrent();
    vHTML += fConstructRecent();
    vHTML += fConstructArchive();
    
    return vHTML;
}

function fInsertVotDLibrary() {
    
    const vDivVotDLibrary = document.getElementById('iVotDLibrary');
    
    let vHTML = '';
    
    vHTML += fConstructVotDLibrary();
    
    vDivVotDLibrary.insertAdjacentHTML('beforebegin', vHTML);
    vDivVotDLibrary.remove();
}