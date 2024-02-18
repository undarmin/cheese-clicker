const cheese = document.querySelector("#cheese");
const cheeseCount = document.querySelector("#cheese-count");
const cpsCount = document.querySelector("#cps-count");
const buildingsBar = document.querySelector(".buildings");
const upgradesBar = document.querySelector(".upgrades");

function roundToN(num, n) {
  return Math.round(num * 10 ** n) / 10 ** n;
}

// Game object

Game = {
  cheese: 0,
  cps: 0,
  clickPower: 1,
  clicks: 0,
  init() {
    for (let key in this.buildings) {
      // create building node
      let building = this.buildings[key];
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
    for (let key in this.upgrades) {
      let upgrade = this.upgrades[key];
      let upgradeNode = upgrade.node = document.createElement("div");
      upgradeNode.classList.add("upgrade-std");
      let infoNode = document.createElement("div");
      infoNode.classList.add("upgrade-std-info");
      upgradeNode.appendChild(infoNode);
      let h1 = document.createElement('h1');
      h1.textContent = upgrade.name;
      let desc = document.createElement('p');
      desc.textContent = upgrade.description;
      infoNode.appendChild(h1);
      infoNode.appendChild(desc);
      upgradesBar.appendChild(upgradeNode)
      upgradeNode.addEventListener("click", () => upgrade.buy());
      upgradeNode.style.display = "none";
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
    for (let key in this.upgrades) {
      let upgrade = this.upgrades[key];
      if (upgrade.exhausted) {
        upgrade.node.style.display = "none";
      } else {
        if (Game.showUpgrade(upgrade)) {
          upgrade.node.style.display = "block";
        }
      }
    }
  },
  showUpgrade(upgrade) {
    switch (upgrade.name) {
      case "Butter Fingers":
        return Game.clicks >= 1000;
        break;
    }
  }
  ,
  activateUpgrade(upgrade) {
    switch (upgrade.name) {
      case "Butter Fingers":
        Game.clickPower *= 2;
        break;
    }
  }
  ,
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
        //console.log(
        //"oh noes",
        //Game.cheese >= this.cost,
        //Game.cheese,
        //this.cost
        //);
        if (Game.cheese >= this.cost) {
          //console.log("oh noes 2");
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
  addUpgrade(name, description, cost, exhausted) {
    this.upgrades[name] = {
      name,
      description,
      cost,
      node: null,
      exhausted,
      buy() {
        if (Game.cheese >= this.cost) {
          Game.cheese -= this.cost;
          this.exhausted = true;
          Game.activateUpgrade(this);
          Game.update();
        }
      },
    };
  },
  upgrades: {},
};

Game.addBuilding("Rat worker", 0.1, 15);
Game.addBuilding("Hamster worker", 1, 100);
Game.addBuilding("Dairy", 15, 1000);
Game.addBuilding("Factory", 102, 12000);

Game.addUpgrade("Butter Fingers", "Increases your click power by 2 times, for a little butter may do a lot...", 1, false);

// // initial save
// let saveInitial;
// setInterval(() => {
//   saveInitial = [Game.cheese, Game.cps, Game.clickPower];
//   for (key in Game.buildings) {
//     let building = Game.buildings[key];
//     saveInitial.push(building.cost, building.number);
//   }
//   localStorage.setItem("save", btoa(String(saveInitial)));
// }, 10000);

// if (
//   atob(localStorage.getItem("save")) === "undefined" ||
//   !localStorage.getItem("save")
// ) {
//   console.log(String(saveInitial));
//   localStorage.setItem("save", btoa(String(saveInitial)));
//   Game.init();
// } else {
//   loadSave(atob(localStorage.getItem("save")));
// }

// function loadSave(save) {
//   saveArr = save.split(",");
//   Game.cheese = +saveArr[0];
//   Game.cps = +saveArr[1];
//   Game.clickPower = +saveArr[2];
//   let i = 3;
//   for (key1 in Game.buildings) {
//     let key2 = !(i % 2) ? "number" : "cost";
//     Game.buildings[key1][key2] = saveArr[i];
//     key2 = i % 2 ? "number" : "cost";
//     Game.buildings[key1][key2] = saveArr[i + 1];
//     //console.table({ building: Game.buildings[key1].name, key2, 1:saveArr[i], 2:saveArr[i+1] });
//     i += 2;
//   }
//   Game.init();
//   Game.update();
// }

cheese.addEventListener("click", () => {
  cheese.classList.add("clicked");
  Game.clicks++;
  wobbleTimeout = setTimeout(() => {
    cheese.classList.remove("clicked");
  }, 50);
  Game.click();
});

Game.production();
Game.init();