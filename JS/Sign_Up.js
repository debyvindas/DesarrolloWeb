document.addEventListener('DOMContentLoaded', function(){
    const Sign_Up = document.getElementById('signUpForm');
    const correo = document.getElementById('correoReg');
    const pass = document.getElementById('passwordReg');
    const nombre = document.getElementById('nombreReg');
    const modal = document.getElementById('FirstModal');
    const toLogInpButton = document.getElementById('toLogin');
    
    document.getElementById('openModal').addEventListener('click', () => {
        modal.style.display = 'block';
    });

    Sign_Up.addEventListener('submit',(event) =>{
        event.preventDefault();

        const data = new FormData(Sign_Up);
        data.append('actrion','signup');

        fetch('http://localhost/DesarrolloWeb/JS/server.php',{
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            if(data.properties){
                alert(message)
            }
            if(data.success){
                alert('Sign Up exisotso');
                modal.style.isplay = 'none';
            }
            else{
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al realizar el SignUp:', error));
    });

    toLogInpButton.addEventListener('click', () => {
        document.querySelector('.modal-LogIn').style.display = 'block';
        document.querySelector('.modal-SignIn').style.display = 'none';
    });

});