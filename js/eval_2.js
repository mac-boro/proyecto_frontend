function validarRUT(rutCompleto) {
    if (!rutCompleto || rutCompleto.trim() === "") return false;
    let rutLimpio = rutCompleto.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = '';
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();

    return dvIngresado === dvCalculado;
}

// Normalizar formato RUT (ej: 12345678-9 -> 12.345.678-9)
function normalizarRUT(rut) {
    let limpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (limpio.length <= 1) return rut;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let formatCuerpo = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
        if (formatCuerpo.length > 0) formatCuerpo = '.' + formatCuerpo;
        formatCuerpo = cuerpo.slice(Math.max(0, i - 3), i) + formatCuerpo;
    }
    return formatCuerpo + '-' + dv;
}

// Validar email
function validarEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
}

// Verificar mayoría de edad (>=18 años)
function esMayorEdad(fechaNacimiento) {
    if (!fechaNacimiento) return false;
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha.getTime())) return false;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
    }
    return edad >= 18;
}

// Validar contraseña robusta
function validarPassword(pass) {
    if (!pass) return false;
    if (pass.length < 8) return false;
    const tieneLetra = /[a-zA-Z]/.test(pass);
    const tieneNumero = /[0-9]/.test(pass);
    return tieneLetra && tieneNumero;
}

// Mostrar mensaje de error o éxito en un campo específico
function mostrarEstadoCampo(idError, idValido, mensajeError, esValido, mensajeValido = "✓ Correcto") {
    const errorDiv = document.getElementById(idError);
    const validoDiv = document.getElementById(idValido);
    if (!errorDiv || !validoDiv) return;
    if (esValido) {
        errorDiv.innerHTML = '';
        errorDiv.style.display = 'none';
        validoDiv.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${mensajeValido}`;
        validoDiv.style.display = 'flex';
    } else {
        errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> ${mensajeError}`;
        errorDiv.style.display = 'flex';
        validoDiv.innerHTML = '';
        validoDiv.style.display = 'none';
    }
}

// Mostrar mensaje global (para éxito o error del formulario)
function mostrarMensajeGlobal(mensaje, tipo = 'danger') {
    let globalMsg = document.getElementById('formGlobalMsg');
    if (!globalMsg) {
        // Crear el contenedor si no existe
        const form = document.getElementById('registroForm');
        const divMsg = document.createElement('div');
        divMsg.id = 'formGlobalMsg';
        divMsg.className = 'mt-3 text-center';
        form.insertAdjacentElement('afterend', divMsg);
        globalMsg = divMsg;
    }
    globalMsg.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show mb-0" role="alert">
                            <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-octagon'} me-2"></i> ${mensaje}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
    // Auto scroll al mensaje
    setTimeout(() => {
        const alertElem = globalMsg.querySelector('.alert');
        if (alertElem) alertElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Limpiar mensaje global
function limpiarMensajeGlobal() {
    const globalMsg = document.getElementById('formGlobalMsg');
    if (globalMsg) globalMsg.innerHTML = '';
}

function cancelar() {
    // Obtener el formulario por su ID 
    const formulario = document.getElementById('registroForm');
    if (formulario) {
        formulario.reset();  // Restablece todos los campos a su estado inicial (valores por defecto)
    }
    
    // Opcional: Forzar valores específicos para el campo oculto o el rango si reset no lo hace bien
    const inputOculto = document.getElementById('input_oculto');
    if (inputOculto) {
        inputOculto.value = '';  // o el valor por defecto que quieras, ej: "datos ocultos"
    }
    
    // También puedes limpiar los mensajes de validación (errores y éxitos)
    const allErrors = document.querySelectorAll('.invalid-feedback-custom');
    const allValid = document.querySelectorAll('.valid-feedback-custom');
    allErrors.forEach(div => div.style.display = 'none');
    allValid.forEach(div => div.style.display = 'none');
    
    // Limpiar mensaje global si existe
    const globalMsg = document.getElementById('formGlobalMsg');
    if (globalMsg) globalMsg.innerHTML = '';
    
    // Mostrar alerta de cancelación (opcional, manteniendo tu comportamiento original)
    alert('Formulario restablecido a valores por defecto');
}

function cambiar_fondo() {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    // Pequeño detalle: restaurar fondo de formulario para legibilidad
    let form = document.querySelector('form');
    if (form) form.style.backgroundColor = '#333';
}

// Validación completa del form
function validarFormularioCompleto() {
    let isValid = true;

    // 1. Nombre (fname)
    const nombre = document.getElementById('fname').value.trim();
    const nombreValido = nombre.length >= 3 && /^[a-zA-ZáéíóúñÑüÜ\s]+$/.test(nombre);
    if (!nombreValido) {
        mostrarEstadoCampo('nombreError', 'nombreValido', 'Nombre: mínimo 3 letras y solo caracteres válidos.', false);
        isValid = false;
    } else {
        mostrarEstadoCampo('nombreError', 'nombreValido', '', true, `Nombre válido ✓`);
    }

    // 2. Apellido (lname)
    const apellido = document.getElementById('lname').value.trim();
    const apellidoValido = apellido.length >= 3 && /^[a-zA-ZáéíóúñÑüÜ\s]+$/.test(apellido);
    if (!apellidoValido) {
        mostrarEstadoCampo('apellidoError', 'apellidoValido', 'Apellido: mínimo 3 letras y solo caracteres válidos.', false);
        isValid = false;
    } else {
        mostrarEstadoCampo('apellidoError', 'apellidoValido', '', true, `Apellido válido ✓`);
    }

    // 3. RUT
    const rutRaw = document.getElementById('rut').value.trim();
    const rutCorrecto = validarRUT(rutRaw);
    if (!rutCorrecto) {
        mostrarEstadoCampo('rutError', 'rutValido', 'RUT inválido (formato o dígito verificador incorrecto).', false);
        isValid = false;
    } else {
        const rutNormalizado = normalizarRUT(rutRaw);
        if (rutNormalizado !== rutRaw) document.getElementById('rut').value = rutNormalizado;
        mostrarEstadoCampo('rutError', 'rutValido', '', true, `RUT ${rutNormalizado} válido ✓`);
    }

    // 4. Email
    const email = document.getElementById('email').value.trim();
    const emailCorrecto = validarEmail(email);
    if (!emailCorrecto) {
        mostrarEstadoCampo('emailError', 'emailValido', 'Ingrese un correo electrónico válido (ej: nombre@dominio.com).', false);
        isValid = false;
    } else {
        mostrarEstadoCampo('emailError', 'emailValido', '', true, 'Email correcto ✓');
    }

    // 5. Fecha de nacimiento (mayoría de edad)
    const fechaNac = document.getElementById('fecha_nac').value;
    let fechaValida = false;
    let fechaMensajeError = '';
    if (!fechaNac) {
        fechaMensajeError = 'Debe seleccionar su fecha de nacimiento.';
        fechaValida = false;
    } else if (!esMayorEdad(fechaNac)) {
        fechaMensajeError = 'Debes ser mayor de 18 años para registrarte.';
        fechaValida = false;
    } else {
        fechaValida = true;
    }
    if (!fechaValida) {
        mostrarEstadoCampo('fechaError', 'fechaValido', fechaMensajeError, false);
        isValid = false;
    } else {
        mostrarEstadoCampo('fechaError', 'fechaValido', '', true, 'Fecha válida (Mayor de edad) ✓');
    }

    // 6. Género (radio buttons)
    const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
    const generoValido = generoSeleccionado !== null;
    if (!generoValido) {
        mostrarEstadoCampo('generoError', 'generoValido', 'Por favor, seleccione una opción de género.', false);
        isValid = false;
    } else {
        mostrarEstadoCampo('generoError', 'generoValido', '', true, `Género: ${generoSeleccionado.value} ✓`);
    }

    // 7. Contraseña
    const password = document.getElementById('password').value;
    const passValida = validarPassword(password);
    if (!passValida) {
        mostrarEstadoCampo('passError', 'passValido', 'Contraseña débil: mínimo 8 caracteres, debe incluir letras y números.', false);
        isValid = false;
    } else {
        mostrarEstadoCampo('passError', 'passValido', '', true, 'Contraseña segura ✓');
    }

    // 8. Confirmar contraseña
    const confirmPass = document.getElementById('confirmPassword').value;
    const confirmValida = (password === confirmPass) && passValida && confirmPass !== '';
    if (!confirmValida) {
        mostrarEstadoCampo('confirmError', 'confirmValido', 'Las contraseñas no coinciden.', false);
        isValid = false;
    } else if (passValida) {
        mostrarEstadoCampo('confirmError', 'confirmValido', '', true, 'Contraseñas coinciden ');
    } else {
        mostrarEstadoCampo('confirmError', 'confirmValido', 'Confirme la contraseña.', false);
        isValid = false;
    }

    return isValid;
}

// Función que se ejecuta al enviar el formulario (botón Aceptar)
function enviarFormulario(event) {
    event.preventDefault();  // Evita recarga y envío real
    limpiarMensajeGlobal();

    const esValido = validarFormularioCompleto();
    if (esValido) {
        const nombre = document.getElementById('fname').value.trim();
        const rut = document.getElementById('rut').value.trim();
        const email = document.getElementById('email').value.trim();
        mostrarMensajeGlobal(`¡Doxeo exitoso! Bienvenido/a ${nombre}. Rut: ${rut}. Para mas información contactenos al ${email}.`, 'success');        
    } else {
        mostrarMensajeGlobal('Por favor, corrija los errores marcados en el formulario antes de enviar.', 'danger');
        // Hacer scroll al primer error
        const firstError = document.querySelector('.invalid-feedback-custom:not(:empty)');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Eventos y validación en tiempo real
function asignarEventosValidacion() {
    const campos = ['fname', 'lname', 'rut', 'email', 'fecha_nac', 'password', 'confirmPassword'];
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', () => {
                validarFormularioCompleto();
                limpiarMensajeGlobal();
            });
            campo.addEventListener('input', () => {
                limpiarMensajeGlobal();
                validarFormularioCompleto();
            });
        }
    });
    // Radio buttons
    const radios = document.querySelectorAll('input[name="genero"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            validarFormularioCompleto();
            limpiarMensajeGlobal();
        });
    });
}

// Al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // Ocultar inicialmente todos los mensajes de error/éxito
    const allErrorDivs = document.querySelectorAll('.invalid-feedback-custom');
    const allValidDivs = document.querySelectorAll('.valid-feedback-custom');
    allErrorDivs.forEach(div => div.style.display = 'none');
    allValidDivs.forEach(div => div.style.display = 'none');

    asignarEventosValidacion();

    // Asignar evento al formulario
    const form = document.getElementById('registroForm');
    form.addEventListener('submit', enviarFormulario);
});