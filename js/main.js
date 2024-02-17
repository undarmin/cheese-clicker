const cheese = document.querySelector("#cheese");

cheese.addEventListener('click', () => {
    cheese.classList.add("clicked");
    setTimeout(() => {
        cheese.classList.remove("clicked")
    }, 500);
})