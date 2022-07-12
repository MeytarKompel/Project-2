const liveCoinsToShow = [];
const coinsCache = {};
let cryptoArray = [];
const loadSpinner = document.getElementById("loaderContainer");

// Fetching API and show all crypto coins
// const crypto = document.getElementById("mainBox");
function getMain() {
  loadSpinner.classList.remove("hidden");
  fetch(`https://api.coingecko.com/api/v3/coins/list`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      cryptoArray = res;
      loadSpinner.classList.add("hidden");
      const htmlCards = res.map(
        (i) =>
          `<div id="cryptoCurrencyCard" class="card" style="width: 18rem;">
          <div class="card-body">
          <div class="form-check form-switch">
             <input onclick="addToggledCoins('${i.symbol}', '${i.id}')" class="form-check-input" type="checkbox" role="switch" id="toggle-Check-${i.id}" aria-checked="true">
             <label class="form-check-label" for="toggle-Check-${i.id}"></label>
           </div>
            <h5 class="card-title">${i.symbol}</h5>
            <p class="card-text">${i.id}</p>
            <button onclick="moreInfoData('${i.id}', '${i.symbol}')" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${i.symbol}" aria-expanded="false" aria-controls="${i.symbol}">
              More Info
            </button>
            <div class="collapse" id="coin-${i.symbol}"></div>
          </div>
       </div>`
      );
      document.getElementById("mainBox").innerHTML = htmlCards.join("");
    });
}

// Fetching coins and show the relevant info by clicking "More Info" button
function moreInfoData(id, symbol) {
  console.log(id, symbol);
  const collapse = document.getElementById(`coin-${symbol}`);
  if (collapse.classList.contains("show")) {
    collapse.classList.remove("show", "hidden");
  } else {
    loadSpinner.classList.remove("hidden");

    const cryptoUrlData = `https://api.coingecko.com/api/v3/coins/${id}`;
    fetch(cryptoUrlData)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        loadSpinner.classList.add("hidden");
        const cryptoData = `<div class="card card-body">
        <img class="cryptoImage" src="${res.image.small}">
        </br>
        <p>USD: ${res.market_data.current_price.usd}$</p>
        </br>
        <p>EUR: ${res.market_data.current_price.eur}€</p>
        </br>
        <p>ILS: ${res.market_data.current_price.ils}₪</p>
      </div>`;
        console.log(cryptoData);
        console.log(symbol);

        if (coinsCache[id]) {
          console.log("cache", coinsCache[id]);
        } else {
          console.log("api", res);
          coinsCache[id] = res;
          setTimeout(() => delete coinsCache[id], 120000);
        }

        console.log(coinsCache);

        collapse.innerHTML = cryptoData;
        collapse.classList.add("show");
      });
  }
}

//Toggeled Coins
function addToggledCoins(id, symbol) {
  console.log(symbol);
  checkCoinsArray(liveCoinsToShow, symbol, id);
  console.log(liveCoinsToShow);
}

function checkCoinsArray(liveCoinsToShow, symbol, id) {
  const coin = {
    id,
    symbol,
  };
  console.log(coin);

  const coinsIndex = liveCoinsToShow.findIndex((c) => c.id === id);
  console.log(id);

  // remove coin from array
  if (coinsIndex !== -1) {
    liveCoinsToShow.splice(coinsIndex, 1);
    return;
  }

  liveCoinsToShow.push(coin);
  if (liveCoinsToShow.length >= 6) {
    document.getElementById(
      `toggle-Check-${liveCoinsToShow[5].symbol}`
    ).checked = false;
    showModal(liveCoinsToShow, coin);
  }
}

// Toggled coins modal
const modalBody = document.getElementById("modalBody");

var exmpModal = new bootstrap.Modal(document.getElementById("coinsModal"));

function showModal(liveCoinsToShow) {
  console.log(liveCoinsToShow);
  modalBody.innerHTML = ``;
  for (let i = 0; i < 5; i++) {
    modalBody.innerHTML += `<div id="cryptoCurrencyCard" class="card" style="width: 18rem;">
      <div class="card-body">
      <div class="form-check form-switch">
        <input onclick="removeCoin('${liveCoinsToShow[i].id}', '${liveCoinsToShow[i].symbol}')" class="form-check-input" type="checkbox" role="switch" id="a-${liveCoinsToShow[i].symbol}" checked>
        <label class="form-check-label" for="data-id-${liveCoinsToShow[i].symbol}"></label>
      </div>
      <h5 class="card-title">${liveCoinsToShow[i].symbol}</h5>
      <p class="card-text">${liveCoinsToShow[i].id}</p>
      <div class="collapse" id="${liveCoinsToShow[i].symbol}"></div>
      </div>
    </div>`;
    exmpModal.toggle();
  }
}

//Removing coin from the modal when the toggle is off
function removeCoin(id, symbol) {
  const coin = {
    id,
    symbol,
  };

  const coinsIndex = liveCoinsToShow.findIndex((c) => c.id === id);
  console.log(coinsIndex);

  if (coinsIndex !== -1) {
    liveCoinsToShow.splice(coinsIndex, 1);
    const toggleSwitcher = document.getElementById(`toggle-Check-${symbol}`);
    console.log(toggleSwitcher);
    toggleSwitcher.checked = false;
    console.log(liveCoinsToShow);
    const toggleSwitcherOn = document.getElementById(
      `toggle-Check-${liveCoinsToShow[4].symbol}`
    );
    toggleSwitcherOn.checked = true;
    exmpModal.hide();

    return;
  } else {
    liveCoinsToShow.push(coin);
  }

  console.log(liveCoinsToShow);
}

function closeModal() {
  exmpModal.hide();
}

// Searching for specific coin
let coinToShow = "";
function searchCoin() {
  loadSpinner.classList.remove("hidden");

  const coinToSearch = coinSearch.value;
  const foundedCoin = cryptoArray.find((coin) => coin.symbol === coinToSearch);
  console.log(foundedCoin);
  if (!foundedCoin) {
    alert("Enter correct symbol!");
  }
  loadSpinner.classList.add("hidden");
  coinToShow = `<div id="searchedCoin" class="card" style="width: 18rem;">
  <div class="card-body">
  <div class="form-check form-switch">
     <input onclick="addToggledCoins('${foundedCoin.symbol}', '${foundedCoin.id}')" class="form-check-input" type="checkbox" role="switch" id="toggle-Check-${foundedCoin.id}" aria-checked="true">
     <label class="form-check-label" for="toggle-Check-${foundedCoin.id}"></label>
   </div>
    <h5 class="card-title">${foundedCoin.symbol}</h5>
    <p class="card-text">${foundedCoin.id}</p>
    <button onclick="moreInfoData('${foundedCoin.id}', '${foundedCoin.symbol}')" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${foundedCoin.symbol}" aria-expanded="false" aria-controls="${foundedCoin.symbol}">
      More Info
    </button>
    <div class="collapse" id="coin-${foundedCoin.symbol}"></div>
  </div>
</div>`;
  document.getElementById("mainBox").innerHTML = coinToShow;
  console.log(coinToShow);
}

async function getAbout() {
  await loadSpinner.classList.remove("hidden");
  let res = await fetch("./about.html");
  document.documentElement.innerHTML = await res.text();
  await loadSpinner.classList.add("hidden");
}
