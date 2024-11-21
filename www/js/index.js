 function mostrarSenha(inputId, checkId) {
    document.getElementById(checkId).addEventListener('change', function () {
        const senhaInput = document.getElementById(inputId);
        senhaInput.type = this.checked ? 'text' : 'password';
    });
}

function getCookie(nome) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(nome + '=')) {
            return cookie.substring((nome + '=').length, cookie.length);
        }
    }
    return null;
}

function criarCookie(nome, valor, dias) {
    const data = new Date();
    data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
    const expira = "expires=" + data.toUTCString();
    document.cookie = nome + "=" + valor + ";" + expira + ";path=/";
}

function deletarCookie(nome) {
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function logout() {
    deletarCookie('user_id');
    window.location.href = "index.html";
}

function verificarAutenticacao() {
    const user_id = getCookie('user_id');
    console.log("user_id = " + user_id);

    if (!user_id) {
        console.log("Você não tem permissão para ficar aqui.");
        alert("Erro: Usuário não autenticado. Redirecionando para a página de login.");
        window.location.href = 'index.html';
    }
    return user_id;
}

function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const mensagem = document.getElementById('cadastroMessage');

    mensagem.textContent = '';

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem. Por favor, tente novamente.";
        mensagem.style.color = "red";
        return;
    }

    if (senha.length < 6) {
        mensagem.textContent = "A senha deve ter no mínimo 6 caracteres.";
        mensagem.style.color = "red";
        return;
    }

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://testesw.infinityfreeapp.com/servidor/cadastro.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            console.log("status=" + resposta.status);
            if (resposta.status === 'success') {
                mensagem.textContent = resposta.message;
                mensagem.style.color = "green";

                const nome = document.getElementById('nome').value = '';
                const email = document.getElementById('email').value = '';
                const senha = document.getElementById('senha').value = '';
                const confirmarSenha = document.getElementById('confirmarSenha').value = '';

                criarCookie('user_id', resposta.user_id, 30);
                console.log("cookie user_id=" + getCookie('user_id'));
                setTimeout(() => window.location.href = 'formulario.html', 1000);
            } else if (resposta.message === "O email já está sendo usado.") {
                mensagem.textContent = "O email informado já está cadastrado. Por favor, utilize outro.";
                mensagem.style.color = "red";

                const nome = document.getElementById('nome').value = '';
                const email = document.getElementById('email').value = '';
                const senha = document.getElementById('senha').value = '';
                const confirmarSenha = document.getElementById('confirmarSenha').value = '';
            } else {
                mensagem.textContent = resposta.message;
                mensagem.style.color = "red";
            }
        } catch (error) {
            console.error("Erro ao processar resposta JSON:", error);
            mensagem.textContent = "Erro inesperado. Por favor, tente novamente.";
            mensagem.style.color = "red";
        }
    };
    xmlhttp.send(`nome=${nome}&email=${email}&senha=${senha}&confirmar_senha=${confirmarSenha}`);
};

function enviarFormulario(event) {
    event.preventDefault();

    const mensagem = document.getElementById('formMessage');

    const user_id = verificarAutenticacao();
    if (!user_id) {
        mensagem.textContent = "Erro: Usuário não autenticado.";
        mensagem.style.color = "red";
        return;
    }

    const local = document.getElementById('local').value;
    const objetivo = document.getElementById('objetivo').value;
    const experiencia = document.getElementById('experiencia').value;
    const sexo = document.getElementById('sexo').value;
    const data_nasc = document.getElementById('data_nasc').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://testesw.infinityfreeapp.com/servidor/formulario.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            console.log("status=" + resposta.status);
            if (resposta.status === 'success') {
                mensagem.textContent = resposta.message;
                mensagem.style.color = "green";
                setTimeout(() => window.location.href = 'home.html', 1000);
            } else {
                mensagem.textContent = resposta.message;
                mensagem.style.color = "red";
            }
        } catch (error) {
            console.error("Erro ao processar resposta JSON:", error);
            mensagem.textContent = "Erro inesperado. Tente novamente.";
            mensagem.style.color = "red";
        }
    };

    xmlhttp.send(`user_id=${user_id}&local=${local}&objetivo=${objetivo}&experiencia=${experiencia}&sexo=${sexo}&data_nasc=${data_nasc}&peso=${peso}&altura=${altura}`);
}

function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('loginMessage');

    mensagem.textContent = '';

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://testesw.infinityfreeapp.com/servidor/index.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            console.log("status=" + resposta.status);
            if (resposta.status === 'success') {
                mensagem.textContent = 'Login realizado com sucesso!';
                mensagem.style.color = 'green';
                criarCookie('user_id', resposta.user_id, 30);
                setTimeout(() => window.location.href = 'home.html', 1000);
            } else if (resposta.message === "E-mail não encontrado.") {
                mensagem.textContent = resposta.message;
                mensagem.style.color = 'red';
            } else if (resposta.message === "Senha incorreta.") {
                mensagem.textContent = resposta.message;
                mensagem.style.color = 'red';
            } else if (resposta.message === "Usuário não encontrado.") {
                mensagem.textContent = resposta.message;
                mensagem.style.color = 'red';
            } else {
                mensagem.textContent = resposta.message;
                mensagem.style.color = 'red';
            }
        } catch (error) {
            mensagem.textContent = 'Erro ao processar a resposta do servidor.';
            mensagem.style.color = 'red';
        }
    };

    xmlhttp.send(`email=${email}&senha=${senha}`);
}







