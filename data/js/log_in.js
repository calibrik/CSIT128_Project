function emailValidation() {
    var em = document.getElementById("email").value; 
    if (em == null || em.trim() == ""){
    document.getElementById("fieldError").innerHTML = "Fill out the email"; 
    return false;
    }else if
        (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(em) == false) {
        document.getElementById("fieldError").innerHTML = "Invalid email format.";
            return false;  
    }else{
        document.getElementById("fieldError").innerHTML = "";
        document.getElementById("email").value = em.trim();
    
    }
    return true; 
}

function validateForm() {
    var isValid = true;
    isValid &= emailValidation();
    return isValid? true:false;
}