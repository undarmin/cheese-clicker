const cheese = document.querySelector("#cheese");
const cheeseCount = document.querySelector("#cheese-count");
const cpsCount = document.querySelector("#cps-count");
const buildingsBar = document.querySelector(".buildings");

function roundToN(num, n) {
    return Math.round(num * 10**n)/(10**n);
}

// Game object

Game = {
  cheese: 0,
  cps: 0,
  clickPower: 1,
  init() {
    for (let buildingKey in this.buildings) {
      // create building node
      let building = this.buildings[buildingKey];
      let buildingNode = document.createElement("div");

      let name = (building.nameNode = document.createElement("p"));
      building.nameNode.textContent = name.textContent = building.name;
      let cost = (building.costNode = document.createElement("p"));
      building.costNode.textContent = cost.textContent =
        "cost: " + building.cost;
      let cps = (building.cpsNode = document.createElement("p"));
      building.cpsNode.textContent = cps.textContent = "cps: " + building.cps;
      let number = (building.numberNode = document.createElement("p"));
      building.numberNode.textContent = number.textContent =
        "number: " + building.number;

      buildingNode.appendChild(name);
      buildingNode.appendChild(cost);
      buildingNode.appendChild(cps);
      buildingNode.appendChild(number);
      buildingNode.classList.add("building-std");
      buildingsBar.appendChild(buildingNode);

      // add event listener

      buildingNode.addEventListener("click", () => {
        building.buy();
      });
    }
  },
  update() {

    cheeseCount.textContent = roundToN(this.cheese, 2);
    cpsCount.textContent = roundToN(this.cps, 2);
    for (let key in this.buildings) {
      let building = this.buildings[key];
      building.costNode.textContent = "cost: " + building.cost;
      building.numberNode.textContent = "number: " + building.number;
    //   console.log(building);
    }
  },
  click() {
    this.earn(this.clickPower);
    this.update();
  },
  production() {
    setInterval(() => {
      for (let key in this.buildings) {
        building = this.buildings[key];
        // console.table({cookies:Game.cheese, cps:building.cps, number:building.number})
        Game.cheese += building.cps * building.number;
        this.update();
      }
    }, 1000);
  },
  earn(cheese) {
    this.cheese += cheese;
  },
  addBuilding(name, cps, cost) {
    this.buildings[name] = {
      name,
      cps,
      cost,
      number: 0,
      costNode: null,
      cpsNode: null,
      nameNode: null,
      numberNode: null,
      buy() {
        console.log(
          "oh noes",
          Game.cheese >= this.cost,
          Game.cheese,
          this.cost
        );
        if (Game.cheese >= this.cost) {
          console.log("oh noes 2");
          Game.cps += this.cps;
          Game.cheese -= this.cost;
          this.cost = roundToN(this.cost * 1.15, 2);
          this.number++;
          Game.update();
        }
      },
    };
  },
  buildings: {},
};

Game.addBuilding("Rat worker", 0.1, 15);
Game.addBuilding("Hamster worker", 1, 100);
Game.addBuilding("Dairy", 15, 1000);
Game.addBuilding("Factory", 102, 12000);

cheese.addEventListener("click", () => {
  cheese.classList.add("clicked");
  wobbleTimeout = setTimeout(() => {
    cheese.classList.remove("clicked");
  }, 50);
  Game.click();
});

Game.init();
Game.production();