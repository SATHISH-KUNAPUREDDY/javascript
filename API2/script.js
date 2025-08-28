 const container = document.getElementById("dataContainer");
    const loading = document.getElementById("loading");

    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        loading.style.display = "none"; 
        data.forEach(product => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p> Price: $${product.price}</p>
          `;
          container.appendChild(card);
        });
      })
      .catch(err => {
        loading.textContent = " Error fetching products. Please try again.";
        console.error(err);
      });