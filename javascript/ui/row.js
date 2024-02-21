window.addEventListener("load", function () {
  const cardsContainer = document.querySelector("#rectangle-container");

  setTimeout(() => {
      cardsContainer.classList.add("load-from-top", "active");
  }, 1000); // Ajustez ce délai au besoin
});
