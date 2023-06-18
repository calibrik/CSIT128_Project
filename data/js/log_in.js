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


function passwordValidation() {
    var p = document.getElementById("password").value;
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()-_=+;:"'|/.,><])[A-Za-z\d@$!%*?&#^()-_=+;:"'|/.,><]{8,}$/.test(p) == false) {
        document.getElementById("fieldError2").innerHTML = "Password is not strong.";
            return false;    
    }else{    
        document.getElementById("fieldError2").innerHTML = "";
    }
    return true;             
}

function validateForm() {
    var isValid = true;
    isValid &= passwordValidation();
    isValid &= emailValidation();
    return isValid? true:false;
}