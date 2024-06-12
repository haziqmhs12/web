/*  The following script references code from the tutorial:
    "Build A Simple Lyrics Fetcher App w Javascript"
    https://www.youtube.com/watch?v=s6iuMAmWsOg&t=4s 
    https://medium.com/@mbu58569/book-api-data-retrieval-project-8537350a4fe8
    */

// DOM elements

const titleInput = document.querySelector("#title");
const output = document.querySelector(".search-output pre");
const btn = document.querySelector(".fetchBtn");
const btn1 = document.querySelector(".Nextbutton");
const btn2 = document.querySelector(".Prevbutton");
const loading = document.querySelector(".loading");
const topResults = document.querySelector("#top_results");

var prevSearch = "";
var size = 12;
var page = 1;
// Add click event to button
btn.addEventListener("click", (event) => {
  // Prevent the default form submission
  event.preventDefault();
  prevSearch = titleInput.value;
  size = 12;
  page = 1;
  fetchBook();
});

function next() {
  if (page > 0) {
    page++;
    fetchBook();
  }
}

function prev() {
  if (page > 1) {
    page--;
    fetchBook();
  }
}

function fetchBook() {
  // Root link
  let url = "https://openlibrary.org/search.json?";

  //  Check for non-empty fields
  if (titleInput.value !== "") {
    output.innerHTML = "";

    // Show loading div

    loading.style.opacity = "1";
    topResults.innerHTML = "";

    // Input parameters
    if (titleInput.value !== "") {
      url += "title=" + prevSearch + "&lang=eng&limit=12&page=" + page;
    }

    // Replace space characters with '+'
    url = url.replace(" ", "+");

    fetch(url) // Fetch results
      // Convert JSON-formatted data into a regular JS object
      .then((response) => response.json())

      .then((data) => {
        // If search results are found:
        if (data.docs !== undefined && data.numFound != 0) {
          btn1.style.display = "block";
          if (data.numFound - data.start < size) {
            size = data.numFound - data.start - 1;
            btn1.style.display = "disabled";
          }

          for (var i = 0; i < size; i++) {
            // const li = document.createElement("div");
            // const li1 = document.createElement("div");
            // const div = document.createElement("div");
            // const divc = document.createElement("div");
            // const div1 = document.createElement("div");
            // const h5 = document.createElement("h5");

            const div = document.createElement("div");
            const div1 = document.createElement("div");
            const div2 = document.createElement("div");
            const div3 = document.createElement("div");
            const h5 = document.createElement("h5");
            const img = document.createElement("img");
            const p = document.createElement("p");
            const add = document.createElement("button");
            // const p1 = document.createElement("p");
            // div.className = "col-md-4";
            // divc.className = "col-md-8";
            // div1.className = "card-body";
            // h5.className = "card-title";
            // li.className = "card m-2";
            // li1.className = "row g-0";
            div.className = "col";
            div1.className = "card h-100";
            div2.className = "card-body d-flex flex-column";
            div3.className = "card-footer";
            h5.className = "card-title";
            p.className = "card-text";
            add.className = "mt-auto btn btn-primary insert-button";
            img.className = "card-img-top img-fluid img-thumbnail";
            div1.style.maxWidth = "20rem";

            //Result:
            //<div class="example-class another-class"></div>

            let title = data.docs[i].title;
            // Rest of the code related to title

            // Handle the case where title is not found

            // let title = data.docs[i].title;
            let author = data.docs[i].author_name;

            // Attempt to fetch cover image
            try {
              let value = data.docs[i].isbn[0];

              let imageUrl =
                "https://covers.openlibrary.org/b/isbn/" + value + "-M.jpg";
              // div1.innerHTML = "<img src ='" + imageUrl
              //     + "' class='card-img-top img-fluid img-thumbnail' id='cover'>";
              img.src = imageUrl;

              fetch(imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                  if (blob.size === 43) {
                    // Check if image size is 43 bytes
                    // div1.innerHTML = "<img src='icons/avatar_book-sm.png'  class='card-img-top img-fluid img-thumbnail' id='cover'>";
                    img.src = "icons/avatar_book-sm.png";
                  } else {
                    const imgUrl = URL.createObjectURL(blob);
                    // div1.innerHTML = "<img src='" + imgUrl + "' class='card-img-top img-fluid img-thumbnail' id='cover' >";
                    img.src = imgUrl;
                  }
                })
                .catch(() => {
                  // div1.innerHTML = "<img src='icons/avatar_book-sm.png' class='card-img-top img-fluid img-thumbnail' id='cover'>";
                  img.src = "icons/avatar_book-sm.png";
                });
            } catch (error) {
              // No image available
              // div1.innerHTML = "<img src='icons/avatar_book-sm.png' class='card-img-top img-fluid img-thumbnail' id='cover'>";
              img.src = "icons/avatar_book-sm.png";
            }
            if (author !== undefined) {
              p.innerText = author;
            }

            // h5.innerHTML = title;
            h5.innerText = title;
            add.innerText = "Add to Database";

            div.appendChild(div1);
            div1.appendChild(img);
            div1.appendChild(div2);
            div2.appendChild(h5);
            div2.appendChild(p);
            div2.appendChild(add);
            // div3.appendChild(add);
            output.appendChild(div);
            topResults.style.opacity = "1";
            loading.style.opacity = "0";
            btn1.style.display = "block";
            btn2.style.display = "block";
            btn1.style.opacity = "1";
            btn2.style.opacity = "1";
          }
        } else {
          output.innerHTML = `No titles found for the given search.`;
          page = 0;
          btn1.style.display = "disabled";
          btn2.style.display = "disabled";
        }
        // Hide loading div

        topResults.innerHTML = "- Search Results -" + prevSearch;

        // Show output div (fade-in animation)
        document.querySelector(".search-output").style.opacity = "1";
      });
  }
}

// list

// add process to enter data into database
