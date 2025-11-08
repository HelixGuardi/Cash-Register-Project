/* === INITIAL CODE FOR THE PROJECT starts here === */
let price = 17.50; //3.26
let cid = [
  ['PENNY', 1.01], //1.01
  ['NICKEL', 2.05], //2.05
  ['DIME', 3.1], //3.1
  ['QUARTER', 4.25], //4.25
  ['ONE', 90], //90
  ['FIVE', 55], //55
  ['TEN', 20], //20
  ['TWENTY', 60], //60
  ['ONE HUNDRED', 100] //100
]; 

/* === GLOBAL VARIABLES === */
const displayChangeDue = document.getElementById('change-due');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');
const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const priceScreen = document.getElementById('price-screen');
const keypad = document.querySelector('.btns-grid');
const payBtn = document.getElementById('pay-btn');

/* === KEYPAD FUNCTIONALITY === */
keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('.keypad-btn');

  if (!btn) {
    return;
  }

  if (btn.classList.contains('delete-btn')) {
    cashInput.value = cashInput.value.slice(0, -1);
    return;
  }

  const value = btn.textContent.trim();

  if (value === '.' && cashInput.value.includes('.')) {
    return;
  }

  cashInput.value += value;
})

/* === CASH REGISTER FUNCTIONALITY === */
const formatResult = (status, change) => {
  displayChangeDue.style.display = 'flex'
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`
  displayChangeDue.innerHTML += change.map(([denomination, amount]) => {
    return `<p>${denomination}: $${amount}</p>`
  }).join('');
}

const checkCashRegister = () => {
  const cashInCents = Math.round(Number(cash.value) * 100);
  const priceInCents = Math.round(price * 100);

  if(cashInCents < priceInCents){
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if(cashInCents === priceInCents){
    displayChangeDue.style.display = 'flex'
    displayChangeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>` 
    cash.value = '';
    return;
  }

  let changeDue = cashInCents - priceInCents;
  const reverseCid = [...cid]
    .reverse()
    .map(([denomination, amount]) => [
      denomination,
      Math.round(amount * 100)
    ])
  const denominations = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];
  const result = { status: 'OPEN', change: [] };
  const totalInCid = reverseCid.reduce((acc, elem ) => {
    return acc + Math.round(elem[1])
  }, 0)
  
  if(totalInCid < changeDue){
    displayChangeDue.style.display = 'flex'
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if(totalInCid === changeDue){
    result.status = 'CLOSED';
  }

  for(let i = 0; i < reverseCid.length; i++){
    if(changeDue >= denominations[i] && changeDue > 0){
      const [denomination, amount] = reverseCid[i];
      const posibleChange = Math.min(amount, changeDue);
      const counter = Math.floor(posibleChange / denominations[i]);
      const changeAmount = counter * denominations[i];
      changeDue -= changeAmount

      if(counter > 0){
        result.change.push([denomination, changeAmount / 100]);
      }
    }
  }

  if(changeDue > 0){
    displayChangeDue.style.display = 'flex'
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  formatResult(result.status, result.change);
  updateUI(result.change);
}

const checkResults = () => {
  if(!cashInput.value){
    return;
  } else {
    checkCashRegister();
  }
}

const updateUI = (change) => {
  const cidNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  }

  if(change){
    change.forEach(([changeDenomination, changeAmount]) => {
      const targetArr = cid.find(([denomination,_]) => {
        return denomination === changeDenomination;
      });
      targetArr[1] = (Math.round(targetArr[1] * 100) - Math.round(changeAmount * 100)) / 100
    });
  }

  cash.value = ''
  cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
  ${cid.map(([denomination, amount]) => {
    return `<p>${cidNameMap[denomination]}: $${amount}</p>`
  }).join('')}`

}

/* === ADD EVENT LISTENER BTNs === */
purchaseBtn.addEventListener('click', checkResults);
payBtn.addEventListener('click', checkResults);

/* === UPDATE UI IN ANY SITUATION === */
updateUI()
