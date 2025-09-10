 const apiKey = "8bb9267a308549e69a20261f4a80be6d"; 
    const searchBtn = document.getElementById("searchBtn");
    const resultsDiv = document.getElementById("results");

    searchBtn.addEventListener("click", async () => {
      const ingredients = document.getElementById("ingredients").value;
      if (!ingredients) return alert("Please enter ingredients!");

      resultsDiv.innerHTML = '<div class="spinner"></div>';

      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`
        );
        const data = await res.json();

        resultsDiv.innerHTML = "";
        if (data.length === 0) {
          resultsDiv.innerHTML = "<p>No recipes found.</p>";
          return;
        }

        data.forEach(recipe => {
          const recipeDiv = document.createElement("div");
          recipeDiv.classList.add("recipe");

          recipeDiv.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
          `;
          resultsDiv.appendChild(recipeDiv);
        });
      } catch (error) {
        resultsDiv.innerHTML = "<p>Something went wrong. Try again later.</p>";
        console.error(error);
      }
    });