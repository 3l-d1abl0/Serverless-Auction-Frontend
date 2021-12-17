$(document).ready(function() {

    function initializeClock(element, endingDate){

        function updateClock() {

            let deadline = new Date(endingDate) - new Date();
            console.log(deadline);

            if (deadline <= 0 || deadline === NaN) {
                clearInterval(timeinterval);
            }

            const seconds = Math.floor((deadline / 1000) % 60);
            const minutes = Math.floor((deadline / (1000 * 60) ) % 60);
            const hours = Math.floor((deadline / (1000 * 60 * 60)) % 60);

            let text = `${hours} hours ${minutes} minutes ${seconds} seconds`;
            $(element).text(text);
            console.log(element, text);

        }
        
        updateClock();
        const timeinterval = setInterval(updateClock, 1000);
 
    }
    
    $('.auctionCardFoot-details-header').map(function(item, index){
        let endingDate = $(index).data("endingat");
    
        if( endingDate !== undefined){
            initializeClock(index, endingDate);
        }
    })

});