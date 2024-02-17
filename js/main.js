const cheese = document.querySelector("#cheese");
const cheeseCount = document.querySelector("#cheese-count");
const cpsCount = document.querySelector("#cps-count")

// Game object

Game = {
    cheese: 0,
    cps: 0,
    clickPower: 1,
    update() {
        cheeseCount.textContent = Math.round(this.cheese);
        cpsCount.textContent = Math.round(this.cps);
    },
    click() {
        this.earn(this.clickPower);
        this.update();
    },
    earn(cheese) {
        this.cheese += cheese;
    }
};

cheese.addEventListener('click', () => {
    cheese.classList.add("clicked");
    wobbleTimeout = setTimeout(() => {
        cheese.classList.remove("clicked")
    }, 50);
    Game.click();
})