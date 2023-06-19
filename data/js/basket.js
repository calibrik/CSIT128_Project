function onSubmit(obj) {
    if (obj["total"].value == 0) {
        alert("Nothing in basket")
        return false;
    }
    //alert(`${obj["userBalance"].value < obj["total"].value} ${obj["userBalance"].value} ${obj["total"].value}`);
    if (Number(obj["userBalance"].value) < Number(obj["total"].value)) {
        alert("Not enough money!");
        return false;
    }
    return confirm("Confirm purchase");
}