 async function searchMusic() {
      const query = document.getElementById("searchInput").value;
      if (!query) return alert("Please enter a search term!");

      const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'f63a9c3878msh60fc019aa65e9e2p16511djsna081b8e81055',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        data.data.forEach(track => {
          const card = `
            <div class="card">
              <img src="${track.album.cover_medium}" alt="Album Art">
              <h3>${track.title}</h3>
              <p>${track.artist.name}</p>
              <audio controls>
                <source src="${track.preview}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            </div>
          `;
          resultsDiv.innerHTML += card;
        });

      } catch (error) {
        console.error(error);
        alert("Something went wrong!");
      }
    }