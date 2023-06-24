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
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/.test(p) == false) {
        document.getElementById("fieldError2").innerHTML = "Your password is not strong.";
            return false;    
    }else{    
        document.getElementById("fieldError2").innerHTML = "";
    }
            

    var p1 = document.getElementById("passwordC").value;
    if (p != p1) {    
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
    return isValid? true:false;
}

function notMatchValidation() {
    var j = document.getElementById("old_password").value;
    var k = document.getElementById("password").value;
    if (j == k) {    
        document.getElementById("fieldError4").innerHTML = "New password matches the current password";
            return false;
    }else{
    document.getElementById("fieldError4").innerHTML = "";
    }
    return true;
}

function eraseSpans() {
    let o = document.getElementsByClassName("Error");
    for ( let i = 0; i <= o.length; i++) {
        o[i].innerHTML = "";
    }
}

function validateFormProfile() {
    var isValid = true;
    isValid &= passwordValidation();
    isValid &= emailValidation();
    isValid &= fNameValidation();
    isValid &=lNameValidation();
    isValid &=notMatchValidation();
    return isValid? true:false;
}