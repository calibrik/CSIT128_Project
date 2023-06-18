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
        document.getElementById("fieldError2").innerHTML = "Your password is not strong.";
            return false;    
    }else{    
        document.getElementById("fieldError2").innerHTML = "";
    }
            

    var p1 = document.getElementById("passwordC").value;
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()-_=+;:"'|/.,><])[A-Za-z\d@$!%*?&#^()-_=+;:"'|/.,><]{8,}$/.test(p1) == false) {
        document.getElementById("fieldError3").innerHTML = "Your password is not strong.";
            return false;    
    }else if (p !== p1) {    
        document.getElementById("fieldError3").innerHTML = "Passwords do not match";
            return false;
    }else{
        document.getElementById("fieldError3").innerHTML = "";
    }
    return true;
}

function fNameValidation() {
    var testfName = document.getElementById("fName").value;
     if (testfName == null || testfName.trim() == ""){
    document.getElementById("fN_fieldError").innerHTML = "Name cannot be blank"; 
    return false;
     }else if (/^[A-Z][a-z]{1,20}$/.test(testfName) == false) {
        document.getElementById("fN_fieldError").innerHTML = "First name must start with a capital letter and contain 2-20 letters only.";
    }else{
        document.getElementById("fN_fieldError").innerHTML = "";
        document.getElementById("fName").value = testfName.trim();
    
    }
    return true; 
}

function lNameValidation() {
    var testlName = document.getElementById("lName").value;
    if (testlName == null || testlName.trim() == ""){
    document.getElementById("lN_fieldError").innerHTML = "Last name cannot be blank"; 
    return false;
    }else if (/^[A-Z][a-z]{1,20}$/.test(testlName) == false) {
        document.getElementById("lN_fieldError").innerHTML = "Last name must start with a capital letter and contain 2-20 letters only.";
    }else{
        document.getElementById("lN_fieldError").innerHTML = "";
        document.getElementById("lName").value = testlName.trim();
    
    }
    return true; 
}

function validateForm() {
    var isValid = true;
    isValid &= passwordValidation();
    isValid &= emailValidation();
    isValid &= fNameValidation();
    isValid &=lNameValidation();
    isValid &=uNameValidation();
    return isValid? true:false;
}