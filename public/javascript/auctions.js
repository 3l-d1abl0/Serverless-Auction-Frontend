$(document).ready(function () {

    $(".backdrop").click(function () {
        console.log('clicked');
        $(".backdrop").hide();
        $(".modal").hide();
    });

    function initializeClock(element, endingDate) {

        function updateClock() {

            let deadline = new Date(endingDate) - new Date();

            if (deadline <= 0 || isNaN(deadline)) {
                clearInterval(timeinterval);
                $(element).text(`Auction Ended !`);
                return;
            }

            const seconds = Math.floor((deadline / 1000) % 60);
            const minutes = Math.floor((deadline / (1000 * 60)) % 60);
            const hours = Math.floor((deadline / (1000 * 60 * 60)));

            let text = `${hours} hrs ${minutes} min ${seconds} sec`;
            $(element).text(text);

        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);

    }

    $('.auctionCardFoot-details-header').map(function (item, index) {
        let endingDate = $(index).data("endingat");

        if (endingDate !== undefined) {
            initializeClock(index, endingDate);
        }
    });

    $('.auctionCardFooter-button-bid').click(function () {

        let auctionid = $(this).data("auctionid");

        let auctionNameEle = $(".auctionCardHead-avatar-name").filter(function (index, item) {
            return $(item).data("auctionid") == auctionid;
        });

        let auctionPriceEle = $(".auctionCardFoot-details-header").filter(function (index, item) {
            return $(item).data("auctionid") == auctionid;
        });

        $(".modal h2").text($(auctionNameEle).text());

        $(".modal .form-input-wrapper .form-input").val(parseInt($(auctionPriceEle).text().trim()) + 1);

        $(".modal .form-input-wrapper .form-input").data("auctionid", auctionid);

        $(".backdrop").show(); $(".modal").show();

    });


    $('.confirm-button').click(function () {

        let auctionId = $(".modal .form-input-wrapper .form-input").data("auctionid");
        let auctionBidPrice = $(".modal .form-input-wrapper .form-input").val();

        let message = $('div.modal-message');
        message.text('');

        $.ajax({
            url: `/auction/${auctionId}/bid`,
            type: 'POST',
            data: { auctionId: auctionId, auctionBidPrice: auctionBidPrice },
            success: function (result) {

                message.text('PLACED !');

                let targetEle = $('.auctionCardHead-avatar-name').filter(function (index, item) {
                    return $(item).data("auctionid") == auctionId;
                });

                let parentEle = targetEle.closest('.auctionsCardWrapper');

                let newHtml = `<button class="auctionCardHeader">

                   <div class="auctionCardHead">
                       <div class="auctionCardHead-avatar">
                           <div class="auctionCardHead-avatar-image">
                               ${result.data.seller[0].toUpperCase()}
                           </div>
                       </div>
                       <div class="auctionCardHead-content">
                           <span class="auctionCardHead-avatar-name" data-auctionId="${result.data.id}">
                               ${result.data.title}
                           </span>
                       </div>
                   </div>

                   <div class="auctionCardBody">
                   </div>

                   <div class="auctionCardFoot">
                       <div class="auctionCardFoot-details">
                           <div>
                               <span class="auctionCardFoot-details-header" data-auctionId="${result.data.id}">
                                    ${result.data.highestBid.amount}
                               </span>
                               <p class="auctionCardFoot-details-data">
                                   HIGHEST BID
                               </p>
                           </div>
                       </div>
                       <div class="auctionCardFoot-details">
                           <div>
                               <span class="auctionCardFoot-details-header auction-timer" data-endingAt="${result.data.endingAt}" >
                                   -- hours -- mins -- secs
                               </span>
                               <p class="auctionCardFoot-details-data">
                                   TIME REMAINING
                               </p>
                           </div>
                       </div>
                   </div>

               </button>

               <div class="auctionCardFooter">

                   <div class="auctionCardFooter-card">

                           <button class="auctionCardFooter-button">
                               <span class="auctionCardFooter-label">You are the Highest Bidder !</span>
                           </button>

                   </div>
                       

               </div>`;

                parentEle.html(newHtml);
                initializeClock($('.auctionCardFoot-details-header.auction-timer'), result.data.endingAt);

                $(".backdrop").hide(); $(".modal").hide();

            },
            error: function (error) {
                message.text(error.responseJSON.data);
            }
        });

    });
});