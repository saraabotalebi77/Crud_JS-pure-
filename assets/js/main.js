let btnSubmit = document.getElementById("btn-submit");
let btnEdit = document.getElementById("btn-edit");
let divTitle = document.getElementById("title-box");
let tbodyTable = document.getElementById("tbodyTable");
let validFirstName = document.getElementById("valid-firstName");
let validLastName = document.getElementById("valid-lastName");
let validEmail = document.getElementById("valid-email");
let validPhoneNumber = document.getElementById("valid-phoneNumber");
let informationUser = new Array();

if(localStorage.getItem("userInformation"))
{
    let objLocalStorageUser = JSON.parse(localStorage.getItem("userInformation"));

    document.getElementById("firstName").value = objLocalStorageUser.firstName;
    document.getElementById("lastName").value = objLocalStorageUser.lastName;
    document.getElementById("email").value = objLocalStorageUser.email;
    document.getElementById("phoneNumber").value = objLocalStorageUser.phoneNumber;
}
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phonePattern = /^(\+98|0)?9\d{9}$/;

async function checkInformation(text,icon){
    let result = await Swal.fire({
        text: `${text}`,
        icon: `${icon}`,
        customClass:{
                icon : 'style-icon',
            },
            allowEnterKey: false,
            showCancelButton: true,
            confirmButtonText: 'بله',
            cancelButtonText: 'خیر',
        });
        return(result.isConfirmed);
    }

function removeUser(event)
{
    let removeUser = event.target.parentElement.parentElement;
    removeUser.remove();
    let objRemoveUser = {};
    objRemoveUser.firstName = event.target.parentElement.parentElement.children[2].innerHTML;
    objRemoveUser.lastName = event.target.parentElement.parentElement.children[3].innerHTML;
    objRemoveUser.email = event.target.parentElement.parentElement.children[4].innerHTML;
    objRemoveUser.phoneNumber = event.target.parentElement.parentElement.children[5].innerHTML;
    for(let i=0 ; i<informationUser.length ; i++)
    {
        if(informationUser[i].firstName == objRemoveUser.firstName && informationUser[i].lastName == objRemoveUser.lastName &&
        informationUser[i].email == objRemoveUser.email && informationUser[i].phoneNumber == objRemoveUser.phoneNumber)
        {
            informationUser.splice(i,1);
            break;
        }
    }
}

function editUser(event)
{
    divTitle.innerHTML = "ویرایش اطلاعات"
    btnSubmit.style.display ="none";
    btnEdit.style.display = "block";
    let editUser = event.target.parentElement.parentElement;
    let editFirstName = editUser.children[2].innerHTML;
    let editLastName = editUser.children[3].innerHTML;
    let editEmail = editUser.children[4].innerHTML;
    let editPhoneNumber = editUser.children[5].innerHTML;
    document.getElementById("firstName").value = editFirstName;
    document.getElementById("lastName").value = editLastName;
    document.getElementById("email").value = editEmail;
    document.getElementById("phoneNumber").value = editPhoneNumber;

    btnEdit.addEventListener("click",function(e){
        e.preventDefault();
        checkInformation("اطلاعات ویرایش شود ؟",'warning').then((data)=>{
                if(data){
                    for(let i=0 ; i<informationUser.length ; i++)
                    {
                        if(informationUser[i].firstName == editFirstName && informationUser[i].lastName == editLastName &&
                        informationUser[i].email == editEmail && informationUser[i].phoneNumber == editPhoneNumber)
                        {
                            informationUser[i].firstName = document.getElementById("firstName").value;
                            informationUser[i].lastName = document.getElementById("lastName").value;
                            informationUser[i].email = document.getElementById("email").value;
                            informationUser[i].phoneNumber = document.getElementById("phoneNumber").value;
                            break;
                        }
                    }
                    editUser.children[2].innerHTML = document.getElementById("firstName").value;
                    editUser.children[3].innerHTML = document.getElementById("lastName").value;
                    editUser.children[4].innerHTML = document.getElementById("email").value;
                    editUser.children[5].innerHTML = document.getElementById("phoneNumber").value;
                }
                document.getElementById("firstName").value = null;
                document.getElementById("lastName").value = null;
                document.getElementById("email").value = null;
                document.getElementById("phoneNumber").value = null;
                btnSubmit.style.display ="block";
                btnEdit.style.display = "none";
                divTitle.innerHTML = "ایجاد حساب کاربری";
            });
    })
}

btnSubmit.addEventListener("click",function(e){
    e.preventDefault(); 
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
   
    validFirstName.style.display = "none";
    validLastName.style.display = "none";
    validEmail.style.display = "none";
    validPhoneNumber.style.display ="none";

    if(firstName && lastName && email.match(emailPattern)  && phoneNumber.match(phonePattern))
    {
        let newUser = `<tr>
            <td><i class="fa fa-remove" style="cursor:pointer;" onclick="removeUser(event)"></i></td>
            <td><i class="fa fa-edit" style="cursor:pointer;" onclick="editUser(event)"></i></td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${email}</td>
            <td>${phoneNumber}</td>
        </tr>`;
        let checkExistingInformation = true;
        for(let i=0 ; i<informationUser.length ;i++)
        {
            if(informationUser[i].firstName == firstName && informationUser[i].lastName == lastName && 
                informationUser[i].email == email && informationUser[i].phoneNumber == phoneNumber)
            {
                checkExistingInformation = false;
                break;
            }
        }
        let icon , text;
        if(checkExistingInformation){
            icon = 'success';
            text = "اطلاعات وارد شده ذخیره شود ؟";
        }
        else{
            icon = 'warning';
            text = "این اطلاعات قبلا دخیره شده است! ذخیره شود ؟";
        }
        checkInformation(text,icon).then((data)=>{
            if(data)
            {
                let user = {firstName:`${firstName}`,lastName:`${lastName}`,email:`${email}`,phoneNumber:`${phoneNumber}`};
                localStorage.setItem("userInformation",JSON.stringify(user));
                informationUser.push(user);
                tbodyTable.insertAdjacentHTML("beforeend",newUser);
            }
            document.getElementById("firstName").value = null;
            document.getElementById("lastName").value = null;
            document.getElementById("email").value = null;
            document.getElementById("phoneNumber").value = null;
        });
           
    }
    else{
        if(!firstName){
            validFirstName.innerHTML = "وارد کردن نام الزامی است !";
            validFirstName.style.display = "block";
        }
        if(!lastName){
            validLastName.innerHTML = "وارد کردن نام خانوادگی الزامی است !";
            validLastName.style.display = "block";
        }
        if(email==""){
            validEmail.innerHTML = "وارد کردن ایمیل الزامی است !";
            validEmail.style.display = "block";
        }
        else if(!(email.match(emailPattern))){
            validEmail.innerHTML = "ایمیل وارد شده معتبر نیست !";
            validEmail.style.display = "block";
        }
        if(phoneNumber==""){
            validPhoneNumber.innerHTML = "وارد کردن شماره همراه الزامی است !";
            validPhoneNumber.style.display = "block";
        }
        else if(!(phoneNumber.match(phonePattern))){
            validPhoneNumber.innerHTML = "شماره همراه وارد شده معتبر نیست !";
            validPhoneNumber.style.display = "block";
        }
    }
});
