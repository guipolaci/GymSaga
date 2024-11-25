function mostrarSenha(inputId, checkId) {
    document.getElementById(checkId).addEventListener('change', function () {
        const senhaInput = document.getElementById(inputId);
        senhaInput.type = this.checked ? 'text' : 'password';
    });
}

function criarCookie(nome, valor, dias) {
    const data = new Date();
    data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
    const expira = "expires=" + date.toUTCString();
    document.cookie = nome + "=" + value + ";" + expira + ";path=/";
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
    xmlhttp.open('POST', 'http://localhost/gymsaga/cadastro.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            console.log("status=" + resposta.status);
            if (resposta.status === 'success') {
                mensagem.textContent = resposta.message;
                mensagem.style.color = "green";
                criarCookie('user_id', resposta.user_id, 30);
                // setTimeout(() => window.location.href = 'formulario.html', 1000);
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


