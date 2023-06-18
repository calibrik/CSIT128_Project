function onSubmit(obj) {
    if (obj["total"].value == 0) {
        alert("Nothing in basket")
        return false;
    }
    if (confirm("Confirm purchase")) {
        alert(obj["total"].value);
        return true;
    }
    return false;
}