$(document).ready(function(){

    const fileInput = document.getElementById("pictureInput");

    let myFiles = {};

    const messageBoard = $('.create-auction-progress');

    fileInput.addEventListener("change", async (event) => {
        // clean up earliest items
        myFiles = {};

        const inputKey = fileInput.getAttribute("name");

        var files = event.srcElement.files;
        
        console.log(Object.entries(files));

        const allowedExtensions =  ['jpg','png'], sizeLimit = 1_000_000; // 1 megabyte

        const filePromises = Object.entries(files).map((item) => {

            return new Promise((resolve, reject) => {

                const [index, file] = item;

                const { name:fileName, size:fileSize } = file;

                const fileExtension = fileName.split(".").pop();

                if(!allowedExtensions.includes(fileExtension)){
                    reject(`${fileExtension} not allowed, only png and jpeg`);
                  }else if(fileSize > sizeLimit){
                    reject(`file under ${sizeLimit} allowed !`);
                  }

                const reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = function (event) {
                    // if it's multiple upload field then set the object key as picture[0], picture[1]
                    // otherwise just use picture
                    const fileKey = `${inputKey}${
                        files.length > 1 ? `[${index}]` : ""
                    }`;
                    // Convert Base64 to data URI
                    // Assign it to your object
                    myFiles[fileKey] = `data:${file.type};base64,${btoa(
                        event.target.result
                    )}`;

                    resolve();
                };
                reader.onerror = function () {
                    console.log("can't read the file");
                    reject();
                };
            });

        });

        Promise.all(filePromises)
          .then(() => {

            messageBoard.text('Ready to Submit !');
            messageBoard.show();

          })
          .catch((error) => {
            messageBoard.text(error);
            messageBoard.show();
          });
    });


    document.getElementById("auction-form").addEventListener("submit", function(event){

        event.preventDefault();

        if (Object.entries(myFiles).length == 0) {
            messageBoard.text('Please Add an Image to your Auction !');
            messageBoard.show();
            return;
        }

        const formData = new FormData(document.getElementById("auction-form"));
        let title = formData.get("title").trim(); 

        if(title == ""){
            messageBoard.text('Please add a title for your Auction!');
            messageBoard.show();
            return;
        }

        let data = {
          title: title,
          picture: myFiles["picture"]
        };

        messageBoard.show();

        $.ajax({ 
            url: `/auction/`,
            type: 'POST',
            data: data,
            beforeSend: function(){
                messageBoard.text('Creating auction for you ... ');
            },
            success: function(result) {
                messageBoard.text(result.responseJSON.data);
            },
            error: function(error) {
                messageBoard.text(error.responseJSON.data);
            }
        });
        
    });



});