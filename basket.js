let prices = document.getElementsByClassName("ItemPrice")
let total = 0;
for (let i = 0; i < prices.length; ++i) {
    total += Number(prices[i].innerHTML.slice(0, -3));
}
document.getElementById("total").innerHTML = `Total: ${total}AED`;
document.getElementById("totalPrice").value = total;
function onSubmit(obj) {
    alert(obj["total"].value);
}