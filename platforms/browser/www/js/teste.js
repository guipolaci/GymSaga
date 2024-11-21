console.log("JavaScript carregado");

const cadastroForm = document.getElementById('cadastroForm');
const formularioCadastro = document.getElementById('formularioCadastro');

console.log("cadastroForm:", cadastroForm);
console.log("formularioCadastro:", formularioCadastro);

if (cadastroForm) {
    document.getElementById('cadastroForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const mensagemCadastro = document.getElementById('cadastroMessage');

        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            mensagemCadastro.textContent = "As senhas não coincidem.";
            mensagemCadastro.style.color = "red";
            return;
        }

        // Limpa a mensagem de erro, se existir
        mensagemCadastro.textContent = "";

        // Cria um objeto com os dados a serem enviados
        const dados = {
            nome: nome,
            email: email,
            senha: senha
        };

        // Envia os dados ao servidor usando XMLHttpRequest
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://localhost/gymsaga/cadastro.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                const data = JSON.parse(xmlhttp.responseText);
                if (data.success) {
                    window.location.href = 'formulario.html'; // Redireciona para o formulário
                } else {
                    mensagemCadastro.textContent = "Erro: " + data.message;
                    mensagemCadastro.style.color = "red";
                }
            }
        };

        // Envia os dados em formato JSON
        xmlhttp.send(JSON.stringify(dados));
    });
}

if (formularioCadastro) {
    document.getElementById('formularioCadastro').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        // Coleta os dados do formulário
        const local = document.getElementById('local').value;
        const objetivo = document.getElementById('objetivo').value;
        const experiencia = document.getElementById('experiencia').value;
        const sexo = document.getElementById('sexo').value;
        const peso = document.getElementById('peso').value;
        const altura = document.getElementById('altura').value;

        // Cria um objeto com os dados a serem enviados
        const dados = {
            local: local,
            objetivo: objetivo,
            experiencia: experiencia,
            sexo: sexo,
            peso: peso,
            altura: altura
        };

        // Configura o XMLHttpRequest para enviar os dados
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://localhost/gymsaga/formulario.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        // Define o que fazer ao receber a resposta do servidor
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                // Sucesso: Redireciona o usuário para a página home
                window.location.href = 'home.html';
            } else if (xmlhttp.readyState === 4) {
                // Exibe um erro caso a resposta não seja bem-sucedida
                alert("Erro ao enviar o formulário. Por favor, tente novamente.");
            }
        };

        // Envia os dados em formato JSON
        xmlhttp.send(JSON.stringify(dados));
    });
}