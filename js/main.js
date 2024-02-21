const cheese = document.querySelector("#cheese");
const cheeseCount = document.querySelector("#cheese-count");
const cpsCount = document.querySelector("#cps-count");
const buildingsBar = document.querySelector(".buildings");
const upgradesBar = document.querySelector(".upgrades");

const loadButton = document.querySelector("#load-save");
const saveButton = document.querySelector("#get-save");

const buffdesc = document.querySelector("#buff-desc");

function suffixes(num) {
    const SUFFIXES = ['Thousand','Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sedecillion', 'Septendecillion', 'Octodecillion', 'Novendecillion', 'Vigintillion', 'Unvigintillion', 'Duovigintillion', 'Tresvigintillion', 'Quattuor­vigint­illion', 'Quinvigintillion', 'Sesvigintillion', 'Septemvigintillion', 'Octovigintillion', 'Novemvigintillion', 'Trigintillion', 'Untrigintillion', 'Duotrigintillion', 'Trestrigintillion', 'Quattuor­trigint­illion', 'Quintrigintillion', 'Sestrigintillion', 'Septentrigintillion', 'Octotrigintillion', 'Noventrigintillion', 'Quadragintillion', 'Quinquagintillion', 'Sexagintillion', 'Septuagintillion', 'Octogintillion', 'Nonagintillion', 'Centillion', 'Uncentillion', 'Decicentillion', 'Undecicentillion', 'Viginticentillion', 'Unviginticentillion', 'Trigintacentillion', 'Quadra­gintacent­illion', 'Quinqua­gintacent­illion', 'Sexagintacentillion', 'Septuagintacentillion', 'Octogintacentillion', 'Nonagintacentillion', 'Ducentillion', 'Trecentillion', 'Quadringentillion', 'Quingentillion', 'Sescentillion', 'Septingentillion', 'Octingentillion', 'Nongentillion', 'Millinillion']
    if (num === 0) {
      return num;
    }
    if (num < 1) {
      return Math.round(num*10)/10;
    }
    var power = Math.floor(Math.log10(num));
    var index = Math.floor(power / 3);
    num = Math.round(num * 10 / Math.pow(10, (index * 3))) / 10;
    return num + " " + (SUFFIXES[index - 1] || '');
}

const upgradeProgression = [
  // click upgrades
  {
    name: "Cheesy Fingers",
    description:
      "Your hands are faster than light! Increases click power by two times.",
    cost: 100,
    exhausted: false,
    url: "./assets/cheesy_fingers.webp"
  },
  // rat upgrades
  {
    name: "Reinforced Tails",
    description:
      "Rats work twice as fast as now their tails can also make cheese! Increase rat worker production by two times",
    cost: 88,
    exhausted: false,
  },
  {
    name: "Lazer Eyes",
    description: "They have lazer eyes now???? Doubles rat production",
    cost: 444,
    exhausted: false,
    url: "./assets/laser.webp"
  },
  {
    name: "Electric Tails",
    description: "You might as well call 'em pikachu now. \nDoubles rat production.",
    cost: 888,
    exhausted: false,
  },
  // hamster upgrades
  {
    name: "Hamster Wheel",
    description: "A nice hamster wheel for your hamsters to exercise. \nDoubles hamster production,",
    cost: 100
  }
];

upgradeProgression.sort(
  (a, b) => a.cost > b.cost ? 1 : -1
);

const buildingProgression = [
  {
    name: "Rat worker",
    cps: 0.1,
    cost: 15,
    description:
      "A rat to make you some fresh cheese! He may eat some cheese though, and he's kinda lazy.",
  },
  {
    name: "Hamster worker",
    cps: 1,
    cost: 100,
    description:
      "A hamster! Faster than a rat and doesn't like cheese as much, but they are more expensive and love living a lavish lifestyle!",
  },
  {
    name: "Farmer",
    cps: 5,
    cost: 250,
    description:
      "He's one of us, he can understand you better and work faster!",
    url: "./assets/Farmer.webp"
  },
  {
    name: "Cattle farm",
    cps: 15,
    cost: 1000,
    description: "FRESH FRESH MILKSIES",
    url: "./assets/cow.webp"
  },
  {
    name: "Dairy",
    cps: 30,
    cost: 5000,
    description:
      "A whole dairy, you have it in your hands and you shall rule the world with it soon enough.",
  url: "./assets/dairy.webp"
    },
  {
    name: "Factory",
    cps: 102,
    cost: 12000,
    description: "We all hate child labour, but you love rat labour :).",
  },
  {
    name: "Warehouse",
    cps: 1122,
    cost: 112233,
    description: "A place to store your cheese, it might rot but who cares we are capitalists now!",
  },
  {
    name: "Bank",
    cps: 14141,
    cost: 1441144,
    description: "People take cheese loans and cheese are stored here, the interest rate is pretty low but you're popular!"
  },
  {
    name: "Mueseum",
    cps: 102011,
    cost: 10203040,
    description: "Apparently people are interested in the history of cheese, well that's more profit for you"
  },
  {
    name: "Temple",
    cps: 1920119,
    cost: 250000000,
    description: "People pray to cookie gods to give them cookies here!"
  },
];

function roundToN(num, n) {
  return Math.round(num * 10 ** n) / 10 ** n;
}

function random(min, max) {
  if (min > max) {
    let l = min;
    min = max;
    max = l;
  }
  return Math.random() * (max - min) + min;
}

// Game object

const Game = {
  cheese: 0,
  cps: 0,
  clickPower: 1,
  clicks: 0,
  multiplier: 1,
  clickMultiplier: 1,
  init() {
    for (let key in this.buildings) {
      // create building node
      let building = this.buildings[key];
      let buildingNode = document.createElement("div");

      let name = (building.nameNode = document.createElement("span"));
      building.nameNode.textContent = name.textContent = building.name;
      let cost = (building.costNode = document.createElement("span"));
      building.costNode.textContent = cost.textContent =
        suffixes(building.cost) + " 🧀";
      let cps = (building.cpsNode = document.createElement("span"));
      building.cpsNode.textContent = cps.textContent = "cps: " + building.baseCPS;
      let number = (building.numberNode = document.createElement("span"));
      building.numberNode.textContent = number.textContent =
        building.number;
      let hiddenNode = document.createElement("div");
      let img = document.createElement("img");
      img.src = building.url;
      img.style.height = "3lh";
      img.style.width = '3lh';
      hiddenNode.classList.add("building-std-hidden");
      let name2 = document.createElement("h1");
      name2.textContent = building.name;
      hiddenNode.appendChild(name2);
      hiddenNode.appendChild(cps)
      let desc = document.createElement("p");
      desc.classList.add("small");
      desc.textContent = building.description;
      hiddenNode.appendChild(desc);

      buildingNode.appendChild(img);
      buildingNode.appendChild(number);
      buildingNode.appendChild(name);
      buildingNode.appendChild(cost);
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
      if (upgrade.url) {
        upgradeNode.style.backgroundImage = `url(${upgrade.url})`;
        upgradeNode.style.backgroundSize = `contain`;
      }
      let infoNode = document.createElement("div");
      infoNode.classList.add("upgrade-std-info");
      upgradeNode.appendChild(infoNode);
      let h1 = document.createElement("h1");
      h1.textContent = upgrade.name;
      let cost = document.createElement("h2");
      cost.classList.add("bold");
      cost.textContent = suffixes(upgrade.cost) + " cheese";
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
    cheeseCount.textContent = suffixes(this.cheese);
    cpsCount.textContent = suffixes(this.cps);
    Game.cps = 0;
    this.buffs.forEach((buff) => {
      switch (buff.type) {
        case "production":
          this.multiplier *= buff.multiplier;
          Game.buffs.splice(
            Game.buffs.indexOf(buff), 1
          );
          setTimeout(() => {
            this.multiplier /= buff.multiplier;
            console.log("Buff has ended");
          }, buff.duration);
          break;


        case "click":
          this.clickMultiplier *= buff.multiplier;
          Game.buffs.splice(
            Game.buffs.indexOf(buff), 1
          );
          setTimeout(() => {
            this.clickMultiplier /= buff.multiplier;
            console.log("Buff has ended");
          }, buff.duration);
          break;
      }
    });
    for (let key in this.buildings) {
      let building = this.buildings[key];
      building.costNode.textContent = suffixes(building.cost) + " 🧀";
      building.numberNode.textContent = building.number;
      building.cpsNode.textContent = "cps: " + building.baseCPS;
      if (building.cps !== this.multiplier * building.baseCPS) {
        building.cps = building.baseCPS * this.multiplier;
      }
      //   console.log(building);
      Game.cps += building.cps * building.number;
    }
    for (let key in this.upgrades) {
      let upgrade = this.upgrades[key];
      if (!upgrade.exhausted && (upgrade.shown || Game.showUpgrade(upgrade))) {
        upgrade.node.style.display = "block";
      }
      if (upgrade.exhausted) {
        upgrade.node.style.display = "none";
      }
    }
  },
  showUpgrade(upgrade) {
    switch (upgrade.name) {
      case "Cheesy Fingers":
        return Game.clicks >= 100;
        break;
      case "Reinforced Tails":
        return Game.buildings["Rat worker"].number >= 5;
        break;
      case "Lazer Eyes":
        return Game.buildings["Rat worker"].number >= 10;
        break;
      case "Electric Tails":
        return Game.buildings["Rat worker"].number >= 25;
        break;
    }
  },
  activateUpgrade(upgrade) {
    switch (upgrade.name) {
      case "Cheesy Fingers":
        Game.clickPower *= 2;
        Game.update();
        break;
      case "Reinforced Tails":
      case "Lazer Eyes":
      case "Electric Tails":
        Game.buildings["Rat worker"].baseCPS *= 2;
        Game.update();
        break;
    }
  },
  click() {
    this.earn(this.clickPower * this.multiplier * this.clickMultiplier);
    this.update();
  },
  production() {
    setInterval(() => {
      for (let key in this.buildings) {
        building = this.buildings[key];
        // console.table({cookies:Game.cheese, cps:building.cps, number:building.number})
        this.earn(building.cps * building.number);
        this.update();
      }
    }, 1000);
  },
  earn(cheese) {
    this.cheese += cheese;
  },
  addBuilding(name, cps, cost, description, url="") {
    this.buildings[name] = {
      name,
      cps,
      baseCPS: cps,
      cost,
      description,
      number: 0,
      costNode: null,
      cpsNode: null,
      nameNode: null,
      numberNode: null,
      url,
      buy() {
        //console.log(
        //"oh noes",
        //Game.cheese >= this.cost,
        //Game.cheese,
        //this.cost
        //);
        if (Game.cheese >= this.cost) {
          //console.log("oh noes 2");
          Game.cheese -= this.cost;
          this.cost = roundToN(this.cost * 1.15, 2);
          this.number++;
          Game.update();
        }
      },
    };
  },
  buildings: {},
  addUpgrade(name, description, cost, exhausted, url="") {
    this.upgrades[name] = {
      name,
      description,
      cost,
      node: null,
      exhausted,
      url,
      shown: false,
      buy() {
        if (Game.cheese >= this.cost) {
          Game.cheese -= this.cost;
          Game.activateUpgrade(this);
          Game.update();
          this.exhausted = true;
        }
      },
    };
  },
  upgrades: {},
  activateBuff(buff) {
    this.buffs.push(buff);
    this.update();
  }
  ,
  newBuff(name) {
    let buff;
    switch (name) {
      case "Cheese Curds":
        buff = {
          name: "Cheese Curds",
          multiplier: 11,
          type: "production",
          duration: 71000,
        };
        break;
      case "Mozzarella Sticks":
        buff = {
          name: "Mozzarella Sticks",
          multiplier: 1111,
          type: "click",
          duration: 11000,
        }
        break;
    }
    let j = buff;
    return j;
  },
  createBuff(buff) {
    let buffnode = document.createElement("div");
    buffnode.style.backgroundColor = "yellow";
    buffnode.style.position = "absolute";
    buffnode.style.width = "100px";
    buffnode.style.height = "100px";
    buffnode.style.top = `${random(
      window.innerHeight - 100, 0
    )}px`;
    buffnode.style.left = `${random(
      window.innerWidth - 100, 0
    )}px`;
    let buffn = this.newBuff(buff);
    document.body.appendChild(buffnode);
    setTimeout(
      () => {
        
        if ([...document.body.children].indexOf(buffnode) !== -1) {
          buffnode.classList.add("golden")
          setTimeout(() => {
            document.body.removeChild(buffnode)
          }, 490)
        }
      }, 10000)
    buffnode.addEventListener('click', () => {
      document.body.removeChild(buffnode);
      this.activateBuff(buffn);
      let r = document.createElement('span');
      r.textContent =
      `${buffn.name}! ${
      buffn.multiplier}x ${buffn.type} for ${buffn.duration / 1000} seconds!`
      buffdesc.appendChild(r);
      
      setTimeout(
        () => {
          buffdesc.removeChild(r);
        }, buffn.duration)
    })
    return buffn;
  },
  buffs: [],
};

setInterval(
  () => {
    let buffn = (random(0, 1) > 0.5) ?  
    "Cheese Curds" :
    "Mozzarella Sticks";
    let buff = Game.createBuff(buffn);
  }
  , 300000)

buildingProgression.forEach((building) => {
  Game.addBuilding(
    building.name,
    building.cps,
    building.cost,
    building.description,
    building.url
  );
});

upgradeProgression.forEach((upgrade) => {
  Game.addUpgrade(
    upgrade.name,
    upgrade.description,
    upgrade.cost,
    upgrade.exhausted,
    upgrade.url
  );
});

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
  localStorage.setItem("save", "eyJjaGVlc2UiOjAsImNwcyI6MCwiY2xpY2tzIjowLCJjbGlja1Bvd2VyIjoxLCJidWlsZGluZ3MiOnsiUmF0IHdvcmtlciI6eyJuYW1lIjoiUmF0IHdvcmtlciIsImNwcyI6MC4xLCJiYXNlQ1BTIjowLjEsImNvc3QiOjE1LCJkZXNjcmlwdGlvbiI6IkEgcmF0IHRvIG1ha2UgeW91IHNvbWUgZnJlc2ggY2hlZXNlISBIZSBtYXkgZWF0IHNvbWUgY2hlZXNlIHRob3VnaCwgYW5kIGhlJ3Mga2luZGEgbGF6eS4iLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9LCJIYW1zdGVyIHdvcmtlciI6eyJuYW1lIjoiSGFtc3RlciB3b3JrZXIiLCJjcHMiOjEsImJhc2VDUFMiOjEsImNvc3QiOjEwMCwiZGVzY3JpcHRpb24iOiJBIGhhbXN0ZXIhIEZhc3RlciB0aGFuIGEgcmF0IGFuZCBkb2Vzbid0IGxpa2UgY2hlZXNlIGFzIG11Y2gsIGJ1dCB0aGV5IGFyZSBtb3JlIGV4cGVuc2l2ZSBhbmQgbG92ZSBsaXZpbmcgYSBsYXZpc2ggbGlmZXN0eWxlISIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiIn0sIkZhcm1lciI6eyJuYW1lIjoiRmFybWVyIiwiY3BzIjo1LCJiYXNlQ1BTIjo1LCJjb3N0IjoyNTAsImRlc2NyaXB0aW9uIjoiSGUncyBvbmUgb2YgdXMsIGhlIGNhbiB1bmRlcnN0YW5kIHlvdSBiZXR0ZXIgYW5kIHdvcmsgZmFzdGVyISIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiLi9hc3NldHMvRmFybWVyLndlYnAifSwiQ2F0dGxlIGZhcm0iOnsibmFtZSI6IkNhdHRsZSBmYXJtIiwiY3BzIjoxNSwiYmFzZUNQUyI6MTUsImNvc3QiOjEwMDAsImRlc2NyaXB0aW9uIjoiRlJFU0ggRlJFU0ggTUlMS1NJRVMiLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6Ii4vYXNzZXRzL2Nvdy53ZWJwIn0sIkRhaXJ5Ijp7Im5hbWUiOiJEYWlyeSIsImNwcyI6MzAsImJhc2VDUFMiOjMwLCJjb3N0Ijo1MDAwLCJkZXNjcmlwdGlvbiI6IkEgd2hvbGUgZGFpcnksIHlvdSBoYXZlIGl0IGluIHlvdXIgaGFuZHMgYW5kIHlvdSBzaGFsbCBydWxlIHRoZSB3b3JsZCB3aXRoIGl0IHNvb24gZW5vdWdoLiIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiLi9hc3NldHMvZGFpcnkud2VicCJ9LCJGYWN0b3J5Ijp7Im5hbWUiOiJGYWN0b3J5IiwiY3BzIjoxMDIsImJhc2VDUFMiOjEwMiwiY29zdCI6MTIwMDAsImRlc2NyaXB0aW9uIjoiV2UgYWxsIGhhdGUgY2hpbGQgbGFib3VyLCBidXQgeW91IGxvdmUgcmF0IGxhYm91ciA6KS4iLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9LCJXYXJlaG91c2UiOnsibmFtZSI6IldhcmVob3VzZSIsImNwcyI6MTEyMiwiYmFzZUNQUyI6MTEyMiwiY29zdCI6MTEyMjMzLCJkZXNjcmlwdGlvbiI6IkEgcGxhY2UgdG8gc3RvcmUgeW91ciBjaGVlc2UsIGl0IG1pZ2h0IHJvdCBidXQgd2hvIGNhcmVzIHdlIGFyZSBjYXBpdGFsaXN0cyBub3chIiwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9LCJ1cmwiOiIifSwiQmFuayI6eyJuYW1lIjoiQmFuayIsImNwcyI6MTQxNDEsImJhc2VDUFMiOjE0MTQxLCJjb3N0IjoxNDQxMTQ0LCJkZXNjcmlwdGlvbiI6IlBlb3BsZSB0YWtlIGNoZWVzZSBsb2FucyBhbmQgY2hlZXNlIGFyZSBzdG9yZWQgaGVyZSwgdGhlIGludGVyZXN0IHJhdGUgaXMgcHJldHR5IGxvdyBidXQgeW91J3JlIHBvcHVsYXIhIiwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9LCJ1cmwiOiIifSwiTXVlc2V1bSI6eyJuYW1lIjoiTXVlc2V1bSIsImNwcyI6MTAyMDExLCJiYXNlQ1BTIjoxMDIwMTEsImNvc3QiOjEwMjAzMDQwLCJkZXNjcmlwdGlvbiI6IkFwcGFyZW50bHkgcGVvcGxlIGFyZSBpbnRlcmVzdGVkIGluIHRoZSBoaXN0b3J5IG9mIGNoZWVzZSwgd2VsbCB0aGF0J3MgbW9yZSBwcm9maXQgZm9yIHlvdSIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiIn0sIlRlbXBsZSI6eyJuYW1lIjoiVGVtcGxlIiwiY3BzIjoxOTIwMTE5LCJiYXNlQ1BTIjoxOTIwMTE5LCJjb3N0IjoyNTAwMDAwMDAsImRlc2NyaXB0aW9uIjoiUGVvcGxlIHByYXkgdG8gY29va2llIGdvZHMgdG8gZ2l2ZSB0aGVtIGNvb2tpZXMgaGVyZSEiLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9fSwidXBncmFkZXMiOnsiUmVpbmZvcmNlZCBUYWlscyI6eyJuYW1lIjoiUmVpbmZvcmNlZCBUYWlscyIsImRlc2NyaXB0aW9uIjoiUmF0cyB3b3JrIHR3aWNlIGFzIGZhc3QgYXMgbm93IHRoZWlyIHRhaWxzIGNhbiBhbHNvIG1ha2UgY2hlZXNlISBJbmNyZWFzZSByYXQgd29ya2VyIHByb2R1Y3Rpb24gYnkgdHdvIHRpbWVzIiwiY29zdCI6ODgsIm5vZGUiOnt9LCJleGhhdXN0ZWQiOmZhbHNlLCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9LCJIYW1zdGVyIFdoZWVsIjp7Im5hbWUiOiJIYW1zdGVyIFdoZWVsIiwiZGVzY3JpcHRpb24iOiJBIG5pY2UgaGFtc3RlciB3aGVlbCBmb3IgeW91ciBoYW1zdGVycyB0byBleGVyY2lzZS4gXG5Eb3VibGVzIGhhbXN0ZXIgcHJvZHVjdGlvbiwiLCJjb3N0IjoxMDAsIm5vZGUiOnt9LCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9LCJDaGVlc3kgRmluZ2VycyI6eyJuYW1lIjoiQ2hlZXN5IEZpbmdlcnMiLCJkZXNjcmlwdGlvbiI6IllvdXIgaGFuZHMgYXJlIGZhc3RlciB0aGFuIGxpZ2h0ISBJbmNyZWFzZXMgY2xpY2sgcG93ZXIgYnkgdHdvIHRpbWVzLiIsImNvc3QiOjEwMCwibm9kZSI6e30sImV4aGF1c3RlZCI6ZmFsc2UsInVybCI6Ii4vYXNzZXRzL2NoZWVzeV9maW5nZXJzLndlYnAifSwiTGF6ZXIgRXllcyI6eyJuYW1lIjoiTGF6ZXIgRXllcyIsImRlc2NyaXB0aW9uIjoiVGhleSBoYXZlIGxhemVyIGV5ZXMgbm93Pz8/PyBEb3VibGVzIHJhdCBwcm9kdWN0aW9uIiwiY29zdCI6NDQ0LCJub2RlIjp7fSwiZXhoYXVzdGVkIjpmYWxzZSwidXJsIjoiLi9hc3NldHMvbGFzZXIud2VicCIsInNob3duIjpmYWxzZX0sIkVsZWN0cmljIFRhaWxzIjp7Im5hbWUiOiJFbGVjdHJpYyBUYWlscyIsImRlc2NyaXB0aW9uIjoiWW91IG1pZ2h0IGFzIHdlbGwgY2FsbCAnZW0gcGlrYWNodSBub3cuIFxuRG91YmxlcyByYXQgcHJvZHVjdGlvbi4iLCJjb3N0Ijo4ODgsIm5vZGUiOnt9LCJleGhhdXN0ZWQiOmZhbHNlLCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9fX0=");
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
      loadSave(JSON.parse(atob(save)));
    } catch (err) {
      localStorage.setItem("save", saveCipher);
    }
  } else {
    localStorage.setItem(
      "save",
      `eyJjaGVlc2UiOjAsImNwcyI6MCwiY2xpY2tzIjowLCJjbGlja1Bvd2VyIjoxLCJidWlsZGluZ3MiOnsiUmF0IHdvcmtlciI6eyJuYW1lIjoiUmF0IHdvcmtlciIsImNwcyI6MC4xLCJiYXNlQ1BTIjowLjEsImNvc3QiOjE1LCJkZXNjcmlwdGlvbiI6IkEgcmF0IHRvIG1ha2UgeW91IHNvbWUgZnJlc2ggY2hlZXNlISBIZSBtYXkgZWF0IHNvbWUgY2hlZXNlIHRob3VnaCwgYW5kIGhlJ3Mga2luZGEgbGF6eS4iLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9LCJIYW1zdGVyIHdvcmtlciI6eyJuYW1lIjoiSGFtc3RlciB3b3JrZXIiLCJjcHMiOjEsImJhc2VDUFMiOjEsImNvc3QiOjEwMCwiZGVzY3JpcHRpb24iOiJBIGhhbXN0ZXIhIEZhc3RlciB0aGFuIGEgcmF0IGFuZCBkb2Vzbid0IGxpa2UgY2hlZXNlIGFzIG11Y2gsIGJ1dCB0aGV5IGFyZSBtb3JlIGV4cGVuc2l2ZSBhbmQgbG92ZSBsaXZpbmcgYSBsYXZpc2ggbGlmZXN0eWxlISIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiIn0sIkZhcm1lciI6eyJuYW1lIjoiRmFybWVyIiwiY3BzIjo1LCJiYXNlQ1BTIjo1LCJjb3N0IjoyNTAsImRlc2NyaXB0aW9uIjoiSGUncyBvbmUgb2YgdXMsIGhlIGNhbiB1bmRlcnN0YW5kIHlvdSBiZXR0ZXIgYW5kIHdvcmsgZmFzdGVyISIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiLi9hc3NldHMvRmFybWVyLndlYnAifSwiQ2F0dGxlIGZhcm0iOnsibmFtZSI6IkNhdHRsZSBmYXJtIiwiY3BzIjoxNSwiYmFzZUNQUyI6MTUsImNvc3QiOjEwMDAsImRlc2NyaXB0aW9uIjoiRlJFU0ggRlJFU0ggTUlMS1NJRVMiLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6Ii4vYXNzZXRzL2Nvdy53ZWJwIn0sIkRhaXJ5Ijp7Im5hbWUiOiJEYWlyeSIsImNwcyI6MzAsImJhc2VDUFMiOjMwLCJjb3N0Ijo1MDAwLCJkZXNjcmlwdGlvbiI6IkEgd2hvbGUgZGFpcnksIHlvdSBoYXZlIGl0IGluIHlvdXIgaGFuZHMgYW5kIHlvdSBzaGFsbCBydWxlIHRoZSB3b3JsZCB3aXRoIGl0IHNvb24gZW5vdWdoLiIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiLi9hc3NldHMvZGFpcnkud2VicCJ9LCJGYWN0b3J5Ijp7Im5hbWUiOiJGYWN0b3J5IiwiY3BzIjoxMDIsImJhc2VDUFMiOjEwMiwiY29zdCI6MTIwMDAsImRlc2NyaXB0aW9uIjoiV2UgYWxsIGhhdGUgY2hpbGQgbGFib3VyLCBidXQgeW91IGxvdmUgcmF0IGxhYm91ciA6KS4iLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9LCJXYXJlaG91c2UiOnsibmFtZSI6IldhcmVob3VzZSIsImNwcyI6MTEyMiwiYmFzZUNQUyI6MTEyMiwiY29zdCI6MTEyMjMzLCJkZXNjcmlwdGlvbiI6IkEgcGxhY2UgdG8gc3RvcmUgeW91ciBjaGVlc2UsIGl0IG1pZ2h0IHJvdCBidXQgd2hvIGNhcmVzIHdlIGFyZSBjYXBpdGFsaXN0cyBub3chIiwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9LCJ1cmwiOiIifSwiQmFuayI6eyJuYW1lIjoiQmFuayIsImNwcyI6MTQxNDEsImJhc2VDUFMiOjE0MTQxLCJjb3N0IjoxNDQxMTQ0LCJkZXNjcmlwdGlvbiI6IlBlb3BsZSB0YWtlIGNoZWVzZSBsb2FucyBhbmQgY2hlZXNlIGFyZSBzdG9yZWQgaGVyZSwgdGhlIGludGVyZXN0IHJhdGUgaXMgcHJldHR5IGxvdyBidXQgeW91J3JlIHBvcHVsYXIhIiwibnVtYmVyIjowLCJjb3N0Tm9kZSI6e30sImNwc05vZGUiOnt9LCJuYW1lTm9kZSI6e30sIm51bWJlck5vZGUiOnt9LCJ1cmwiOiIifSwiTXVlc2V1bSI6eyJuYW1lIjoiTXVlc2V1bSIsImNwcyI6MTAyMDExLCJiYXNlQ1BTIjoxMDIwMTEsImNvc3QiOjEwMjAzMDQwLCJkZXNjcmlwdGlvbiI6IkFwcGFyZW50bHkgcGVvcGxlIGFyZSBpbnRlcmVzdGVkIGluIHRoZSBoaXN0b3J5IG9mIGNoZWVzZSwgd2VsbCB0aGF0J3MgbW9yZSBwcm9maXQgZm9yIHlvdSIsIm51bWJlciI6MCwiY29zdE5vZGUiOnt9LCJjcHNOb2RlIjp7fSwibmFtZU5vZGUiOnt9LCJudW1iZXJOb2RlIjp7fSwidXJsIjoiIn0sIlRlbXBsZSI6eyJuYW1lIjoiVGVtcGxlIiwiY3BzIjoxOTIwMTE5LCJiYXNlQ1BTIjoxOTIwMTE5LCJjb3N0IjoyNTAwMDAwMDAsImRlc2NyaXB0aW9uIjoiUGVvcGxlIHByYXkgdG8gY29va2llIGdvZHMgdG8gZ2l2ZSB0aGVtIGNvb2tpZXMgaGVyZSEiLCJudW1iZXIiOjAsImNvc3ROb2RlIjp7fSwiY3BzTm9kZSI6e30sIm5hbWVOb2RlIjp7fSwibnVtYmVyTm9kZSI6e30sInVybCI6IiJ9fSwidXBncmFkZXMiOnsiUmVpbmZvcmNlZCBUYWlscyI6eyJuYW1lIjoiUmVpbmZvcmNlZCBUYWlscyIsImRlc2NyaXB0aW9uIjoiUmF0cyB3b3JrIHR3aWNlIGFzIGZhc3QgYXMgbm93IHRoZWlyIHRhaWxzIGNhbiBhbHNvIG1ha2UgY2hlZXNlISBJbmNyZWFzZSByYXQgd29ya2VyIHByb2R1Y3Rpb24gYnkgdHdvIHRpbWVzIiwiY29zdCI6ODgsIm5vZGUiOnt9LCJleGhhdXN0ZWQiOmZhbHNlLCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9LCJIYW1zdGVyIFdoZWVsIjp7Im5hbWUiOiJIYW1zdGVyIFdoZWVsIiwiZGVzY3JpcHRpb24iOiJBIG5pY2UgaGFtc3RlciB3aGVlbCBmb3IgeW91ciBoYW1zdGVycyB0byBleGVyY2lzZS4gXG5Eb3VibGVzIGhhbXN0ZXIgcHJvZHVjdGlvbiwiLCJjb3N0IjoxMDAsIm5vZGUiOnt9LCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9LCJDaGVlc3kgRmluZ2VycyI6eyJuYW1lIjoiQ2hlZXN5IEZpbmdlcnMiLCJkZXNjcmlwdGlvbiI6IllvdXIgaGFuZHMgYXJlIGZhc3RlciB0aGFuIGxpZ2h0ISBJbmNyZWFzZXMgY2xpY2sgcG93ZXIgYnkgdHdvIHRpbWVzLiIsImNvc3QiOjEwMCwibm9kZSI6e30sImV4aGF1c3RlZCI6ZmFsc2UsInVybCI6Ii4vYXNzZXRzL2NoZWVzeV9maW5nZXJzLndlYnAifSwiTGF6ZXIgRXllcyI6eyJuYW1lIjoiTGF6ZXIgRXllcyIsImRlc2NyaXB0aW9uIjoiVGhleSBoYXZlIGxhemVyIGV5ZXMgbm93Pz8/PyBEb3VibGVzIHJhdCBwcm9kdWN0aW9uIiwiY29zdCI6NDQ0LCJub2RlIjp7fSwiZXhoYXVzdGVkIjpmYWxzZSwidXJsIjoiLi9hc3NldHMvbGFzZXIud2VicCIsInNob3duIjpmYWxzZX0sIkVsZWN0cmljIFRhaWxzIjp7Im5hbWUiOiJFbGVjdHJpYyBUYWlscyIsImRlc2NyaXB0aW9uIjoiWW91IG1pZ2h0IGFzIHdlbGwgY2FsbCAnZW0gcGlrYWNodSBub3cuIFxuRG91YmxlcyByYXQgcHJvZHVjdGlvbi4iLCJjb3N0Ijo4ODgsIm5vZGUiOnt9LCJleGhhdXN0ZWQiOmZhbHNlLCJ1cmwiOiIiLCJzaG93biI6ZmFsc2V9fX0=`
    );
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
      Game.buildings[key].cps = save.buildings[key].cps;
      Game.buildings[key].baseCPS = save.buildings[key].baseCPS;
    }
    for (let key in save.upgrades) {
      if (!(key in Game.upgrades && key in save.upgrades)) {
        continue;
      }
      Game.upgrades[key].exhausted = save.upgrades[key].exhausted;
      Game.upgrades[key].shown = save.upgrades[key].shown;
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
    alert(loadSave(JSON.parse(atob(save))));
  }
});

saveButton.addEventListener("click", () => {
  alert("your save is: " + saveCipher);
});

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
