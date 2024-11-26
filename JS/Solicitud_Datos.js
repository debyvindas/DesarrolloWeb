document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('signUpForm');
    const Nombre = document.getElementById('nombre');
    const correoReg = document.getElementById('correoReg');
    const passwordReg = document.getElementById('passwordReg');
    const modal = document.getElementById('FirstModal');
    const toLoginButton = document.getElementById('toLogin');

    // Enviar el formulario de sign up
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar que recargue la página
        JSON.stringify(Nombre);
        const data = new FormData(signUpForm);
        data.append('action', 'signup');

        // Enviar los datos al servidor con Fetch
        fetch('http://localhost/DesarrolloWeb/JS/SignUp.php', {
            method: 'POST',
            dataType: "json",
            body: JSON.stringify({
                nombre: Nombre.value,
                correo: correoReg.value,
                password: passwordReg.value,
                action: 'signup'
              })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                document.querySelector('.modal-LogIn').style.display = 'block';
                document.querySelector('.modal-SignIn').style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al realizar el registro:', error));
    });

    // Cambiar al formulario de login
    toLoginButton.addEventListener('click', () => {
        document.querySelector('.modal-SignIn').style.display = 'none';
        document.querySelector('.modal-LogIn').style.display = 'block';
    });
});




/*
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("loginModal");
    const btn = document.getElementById("openModal");
    const btn1 = document.getElementsByClassName("close")[0];
    
    btn.onclick = function() {
        modal.style.display = "block"; 
    }

    btn1.onclick = function() {
        
        let correo = document.getElementById("correo").value;
        let password = document.getElementById("password").value;
        modal.style.display = "none"; 
        validar(correo, password); 
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none"; 
        }
    }
});
// const conectar = require('./dbConnection'); 

/*
conectar((err, connection) => {
    if (err) return; // Manejo de errores al conectar

    // Consulta a realizar
    const query = 'SELECT * FROM usuario'; // Cambia 'tu_tabla' por el nombre real de tu tabla
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta: ', err);
        } else {
            console.log('Resultados de la consulta:', results); // Muestra los resultados
    
            console.log('Lista de resultados (JSON):', JSON.stringify(results, null, 2));
        }
        
        // Cierra la conexión después de realizar la consulta
        connection.end((err) => {
            if (err) {
                console.error('Error al cerrar la conexión: ', err);
            } else {
                console.log('Conexión cerrada');
            }
        });
    });
});

//Log In exitoso
conectar((err, connection) => {
    if (err) return;

    const query = 'SELECT * FROM usuario'; 
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta: ', err);
        } else {
           
            console.log('Resultados de la consulta:', results);
            
            
            const lista = results.map(item => ({
                id: item.ID_Usuario,       
                nombre: item.Nombre,
                pass:item.Password
                
            }));
            var Id = results.map(item => item.ID_Usuario)
            var Name = results.map(item => item.Nombre)
            var Pass = results.map(item => item.Password)

            Id = parseInt(Id)
            Name = String(Name)
            Pass = String(Pass)

            
            console.log(Id);
            console.log(Name);
            console.log(Pass);

            //empezar a comparar datos (Funciona)
            if(Pass === "Tojjak.04F"){
                console.log('holaaaaaaaaa PUTOS');
            }
            
            console.log('Lista de resultados (JSON):', JSON.stringify(lista, null, 2));
            console.table(lista);
        }
        
        connection.end((err) => {
            if (err) {
                console.error('Error al cerrar la conexión: ', err);
            } else {
                console.log('Conexión cerrada');
            }
        });
        
    });
    
});



const lista = results.map(item => ({
                    Correo: item.Correo
                }));

const queryInsert = 'INSERT INTO usuario VALUES ('+Id+','+2+','+Nombre+','+Correo+','+'0,0,0,0,0,0,0,'+password+');';
*/
/*
//registro usuarios (sign in backend en proceso)
let Id;
let Nombre = 'chompi';
let Correo;
let password;

let authen;
let co = '';

Correo = 'augusto@gmail.com';
password = "Tojjak.04F";
function corre(){
    console.log('hola');
    for( let i = 0; i < Correo.length;i++){
        console.log(Correo.charAt(i));
        if(Correo.charAt(i) === '@'){
            for( let a = 0; a < Correo.length;a++){
                
                if(Correo.charAt(a)=== '.'){
                    authen = true;
                }
            
                if(authen === true){
                    
                    co = co + Correo.charAt(a);
                }
            };
        };
    };
};



function validar (Id,Nombre, Correo, password){
    
    conectar(  (err, connection) => {
        if (err) return;
    
        const query = "SELECT * FROM usuario where Correo = '" + Correo+"';"; 
        console.log(query);
        
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error en la consulta: ', err);
            } 
            else {
                let correo = results.map(item => item.Correo)
                
                correo = String(correo)
                
                
                //validar si el correo ya esta registrado
                if(correo === ''){
                    conectar((err, connection2)=>{
                        if(err) return;
                        const queryM = 'SELECT MAX(ID_Usuario) as ID_Usuario FROM usuario;'; 
            
                        connection2.query(queryM, (err, results) => {
                            if (err) {
                                console.error('Error en la consulta: ', err);
                            } else {
                                console.log('Resultados de la consulta:', results);
                                Id = results.map(item => item.ID_Usuario)
                                Id = parseInt(Id) + 1;
                                
            
            
                                const queryInsert = 'INSERT INTO usuario VALUES ('+Id+','+2+",'"+Nombre+"','"+Correo+"',"+"0,0,0,0,0,0,0,'"+password+"');";
                                
            
                                connection2.end((err) => {
                                    if (err) {
                                        console.error('Error al cerrar la conexión: ', err);
                                    } else {
                                        console.log('Conexión cerrada');
                                    }
                                });

                                conectar((err, insertar)=>{
                                    if (err) return;
                                    insertar.query(queryInsert, (err, results)=>{
                                        if (err) {
                                            console.log('error en la insercion: ', err)
                                        }
                                        else{
                                            console.log('registro exitoso')
            
                                            insertar.end((err)=> {
                                                if (err){
                                                    console.log('error al desconectar');
                                                }
                                                else{
                                                    console.log('registro cerrado');
                                                }
                                            });
                                        }
                                    });
                                });
                            }});
                    });
                    //tomar ultimo id por defecto

                    
                    
                
                    
                    
                }
                connection.end((err) => {
                    if (err) {
                        console.error('Error al cerrar la conexión: ', err);
                    } else {
                        console.log('Conexión cerrada');
                    }
                });
                
            }});
    });
}

corre();

if( co === ".com"){
    validar(Id,Nombre, Correo, password);
}
else{
    console.log('Correo ingresado Invalido');
    console.log(co);
}
*/



/*
Validar login


const conectar = require('./dbConnection'); 


let id_U;
let password;
let Correo;

function validar (Correo,password){
   
    password='Tojjak.04F';
    Correo='fa@gmail.com';    
    conectar(  (err, connection) => {
         console.log();
        if (err) {
            console.log(err);
            return
        };
        const query = "SELECT * FROM usuario where Correo = '" + Correo+"'"; 
        connection.query(query, (err, results) => {
            if (err) {
                
                console.log('Error en la consulta: ', err);
            } 
            else {
                
                let Id = results.map(item => item.ID_Usuario)
                let Name = results.map(item => item.Nombre)
                let Pass = results.map(item => item.Password)

                
    
                Id = parseInt(Id)
                Name = String(Name)
                Pass = String(Pass)
    
                
                console.log(query);
        
                //empezar a comparar datos (Funciona)
                if(Pass === password){
                    console.log("Validación comprobada");
                
                }
                else {
                    console.log("credenciales invalidas");
                }

                
            
            connection.end((err) => {
                if (err) {
                    console.log('Error al cerrar la conexión: ', err);
                } else {
                    console.log('Conexión cerrada');
                }
            });
            
        }});
        
    });
}

validar();
module.exports = validar;

/*
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("loginModal");
    const btn = document.getElementById("openModal");
    const btn1 = document.getElementsByClassName("close")[0];
    

    btn.onclick = function() {
        modal.style.display = "block";
    }

    btn1.onclick = function() {
        modal.style.display = "none";
        Correo = document.getElementById("correo").value;
        id_U = 0;
        password = document.getElementById("password").value;
        validar(Correo,password);
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});


const conecta = require('./dbConnection'); 
const modal = document.getElementById("loginModal");
const btn = document.getElementById("openModal");
const btn1 = document.getElementsByClassName("close")[0];


btn.onclick = function() {
    modal.style.display = "block";
}

btn1.onclick = function() {
    modal.style.display = "none";
    Correo = document.getElementById("correo").value;
    id_U = 0;
    password = document.getElementById("password").value;
    validar(Correo,password);
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let id_U;
let password;
let Correo;

function validar (Correo,password){
   
    password='Tojjak.04F';
    Correo='fa@gmail.com';    
    conecta(  (err, connection) => {
         console.log();
        if (err) {
            console.log(err);
            return
        };
        const query = "SELECT * FROM usuario where Correo = '" + Correo+"'"; 
        connection.query(query, (err, results) => {
            if (err) {
                
                console.log('Error en la consulta: ', err);
            } 
            else {
                
                let Id = results.map(item => item.ID_Usuario)
                let Name = results.map(item => item.Nombre)
                let Pass = results.map(item => item.Pass)

                
    
                Id = parseInt(Id)
                Name = String(Name)
                Pass = String(Pass)

                
                console.log(query);
        
                //empezar a comparar datos (Funciona)
                if(Pass === password){
                    console.log("Validación comprobada");
                
                }
                else {
                    console.log("credenciales invalidas");
                }

                
            
            connection.end((err) => {
                if (err) {
                    console.log('Error al cerrar la conexión: ', err);
                } else {
                    console.log('Conexión cerrada');
                }
            });
            
        }});
        
    });
}

module.exports = validar;




*/