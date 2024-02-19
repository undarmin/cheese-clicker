const cheese = document.querySelector("#cheese");
const cheeseCount = document.querySelector("#cheese-count");
const cpsCount = document.querySelector("#cps-count");
const buildingsBar = document.querySelector(".buildings");
const upgradesBar = document.querySelector(".upgrades");

const loadButton = document.querySelector("#load-save");
const saveButton = document.querySelector("#get-save");

const upgradeProgression = [
  {
    name: "Cheesy Fingers",
    description: "Your hands are faster than light! Increases click power by two times.",
    cost: 100,
    exhausted: false
  }
];
const buildingProgression = [
  {
    name: "Rat worker",
    cps: 0.1,
    cost: 15,
    description: "A rat to make you some fresh cheese! He may eat some cheese though, and he's kinda lazy."
  },
  {
    name: "Hamster worker",
    cps: 1,
    cost: 100,
    description: "A hamster! Faster than a rat and doesn't like cheese as much, but they are more expensive and love living a lavish lifestyle!"
  },
  {
    name: "Farmer",
    cps: 5,
    cost: 250,
    description: "He's one of us, he can understand you better and work faster!"
  },
  {
    name: "Cattle farm",
    cps: 15,
    cost: 1000,
    description: "FRESH FRESH MILKSIES"
  },
  {
    name: "Dairy",
    cps: 30,
    cost: 5000,
    description: "A whole dairy, you have it in your hands and you shall rule the world with it soon enough."
  },
  {
    name: "Factory",
    cps: 102,
    cost: 12000,
    description: "We all hate child labour, but you love rat labour :)."
  }
];

function roundToN(num, n) {
  return Math.round(num * 10 ** n) / 10 ** n;
}

// Game object

const Game = {
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
      let hiddenNode = document.createElement("div");
      hiddenNode.classList.add("building-std-hidden");
      let name2 = document.createElement("h1");
      name2.textContent = building.name;
      hiddenNode.appendChild(name2);
      let desc = document.createElement("p");
      desc.classList.add("small");
      desc.textContent = building.description;
      hiddenNode.appendChild(desc);

      buildingNode.appendChild(name);
      buildingNode.appendChild(cost);
      buildingNode.appendChild(cps);
      buildingNode.appendChild(number);
      buildingNode.appendChild(hiddenNode);
      buildingNode.classList.add("building-std");
      buildingsBar.appendChild(buildingNode);

      // add event listener

      buildingNode.addEventListener("click", () => {
        building.buy();
      });
    }
    for (let key in this.upgrades) {
      let upgrade = this.upgrades[key];
      let upgradeNode = (upgrade.node = document.createElement("div"));
      upgradeNode.classList.add("upgrade-std");
      let infoNode = document.createElement("div");
      infoNode.classList.add("upgrade-std-info");
      upgradeNode.appendChild(infoNode);
      let h1 = document.createElement("h1");
      h1.textContent = upgrade.name;
      let cost = document.createElement("h2");
      cost.classList.add("bold");
      cost.textContent = upgrade.cost + " cheese";
      let desc = document.createElement("p");
      desc.textContent = upgrade.description;
      infoNode.appendChild(h1);
      infoNode.appendChild(cost);
      infoNode.appendChild(desc);
      upgradesBar.appendChild(upgradeNode);
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
      case upgradeProgression[0].name:
        return Game.clicks >= 1000;
        break;
    }
  },
  activateUpgrade(upgrade) {
    switch (upgrade.name) {
      case upgradeProgression[0].name:
        Game.clickPower *= 2;
        break;
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
  addBuilding(name, cps, cost, description) {
    this.buildings[name] = {
      name,
      cps,
      cost,
      description,
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

buildingProgression.forEach((building) => {
  Game.addBuilding(building.name, building.cps, building.cost, building.description);
})

upgradeProgression.forEach((upgrade) => {
  Game.addUpgrade(upgrade.name, upgrade.description, upgrade.cost, upgrade.exhausted);
})

// game save

const initialSave = {
  cheese: Game.cheese,
  cps: Game.cps,
  clicks: Game.clicks,
  clickPower: Game.clickPower,
  buildings: Game.buildings,
  upgrades: Game.upgrades,
};

let saveCipher = btoa(JSON.stringify(initialSave));

setInterval(() => {
  updateSave();
}, 5000);

function wipeSave() {
  localStorage.setItem("save", "");
  getSave();
}

function updateSave() {
  initialSave.cheese = Game.cheese;
  initialSave.cps = Game.cps;
  initialSave.clicks = Game.clicks;
  initialSave.clickPower = Game.clickPower;
  initialSave.buildings = Game.buildings;
  initialSave.upgrades = Game.upgrades;
  saveCipher = btoa(JSON.stringify(initialSave));
  localStorage.setItem("save", saveCipher);
}

function getSave() {
  if (localStorage.getItem("save")) {
    let save = localStorage.getItem("save");
    try {
      loadSave(
        JSON.parse(atob(save))
      );
    } catch (err) {
      localStorage.setItem("save", saveCipher);
    }
  } else {
    localStorage.setItem("save", `eyJjaGVlc2UiOjAsImNwcyI6MCwiY2xpY2tzIjowLCJjbGlja1Bvd2VyIjoxLCJidWlsZGluZ3MiOnsiUmF0IHdvcmtlciI6eyJuYW1lIjoiUmF0IHdvcmtlciIsImNwcyI6MC4xLCJjb3N0IjoxNSwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9fSwiSGFtc3RlciB3b3JrZXIiOnsibmFtZSI6IkhhbXN0ZXIgd29ya2VyIiwiY3BzIjoxLCJjb3N0IjoxMDAsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fX0sIkRhaXJ5Ijp7Im5hbWUiOiJEYWlyeSIsImNwcyI6MTUsImNvc3QiOjEwMCwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9fSwiRmFjdG9yeSI6eyJuYW1lIjoiRmFjdG9yeSIsImNwcyI6MTAyLCJjb3N0IjoxMjAwMCwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9fX0sInVwZ3JhZGVzIjp7IkNoZWVzeSBGaW5nZXJzIjp7Im5hbWUiOiJDaGVlc3kgRmluZ2VycyIsImRlc2NyaXB0aW9uIjoiWW91ciBoYW5kcyBhcmUgZmFzdGVyIHRoYW4gbGlnaHQhIEluY3JlYXNlcyBjbGljayBwb3dlciBieSB0d28gdGltZXMuIiwiY29zdCI6MTAwLCJub2RlIjp7fSwiZXhoYXVzdGVkIjpmYWxzZX19fQ==`);
    getSave();
  
  }
}

function loadSave(save) {
  if (
    "cheese" in save &&
    "cps" in save &&
    "clicks" in save &&
    "clickPower" in save &&
    "buildings" in save &&
    "upgrades" in save
  ) {
    Game.cheese = save.cheese;
    Game.cps = save.cps;
    Game.clicks = save.clicks;
    Game.clickPower = save.clickPower;
    for (let key in save.buildings) {
      if (!(key in Game.buildings && key in save.buildings)) {
        continue;
      }
      Game.buildings[key].number = save.buildings[key].number;
      Game.buildings[key].cost = save.buildings[key].cost;
    }
    for (let key in save.upgrades) {
      if (!(key in Game.upgrades && key in save.upgrades)) {
        continue;
      }
      Game.upgrades[key].exhausted = save.upgrades[key].exhausted;
    }
  } else {
    return "Invalid Save File";
  }
  Game.update();
  return "Loaded Successfully!";
}

loadButton.addEventListener("click", () => {
  let save = prompt("Whatcha save?");
  if (save) {
    alert(
      loadSave(
        JSON.parse(atob(save))
      )
    );
  }
});

saveButton.addEventListener("click", () => {
  alert("your save is: " + saveCipher);
})

cheese.addEventListener("click", () => {
  cheese.classList.add("clicked");
  Game.clicks++;
  wobbleTimeout = setTimeout(() => {
    cheese.classList.remove("clicked");
  }, 50);
  Game.click();
});

window.onload = () => getSave();
Game.production();
Game.init();
