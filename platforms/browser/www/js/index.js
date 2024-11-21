console.log("JavaScript carregado");

cadastroForm = document.getElementById('cadastroForm');
formularioCadastro = document.getElementById('formularioCadastro');

console.log("cadastroForm:", cadastroForm);
console.log("formularioCadastro:", formularioCadastro);

if (cadastroForm) {
    console.log("cadastroForm encontrado");

    cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Formulário de cadastro enviado");

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const mensagemCadastro = document.getElementById('cadastroMessage');

        console.log("Dados capturados:", { nome, email, senha, confirmarSenha });

        if (senha !== confirmarSenha) {
            console.log("As senhas não coincidem");
            mensagemCadastro.textContent = "As senhas não coincidem.";
            mensagemCadastro.style.color = "red";
            return;
        }

        mensagemCadastro.textContent = "";

        const dados = {
            nome: nome,
            email: email,
            senha: senha
        };

        console.log("Dados a serem enviados:", dados);

        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://localhost/gymsaga/cadastro.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        xmlhttp.onreadystatechange = function () {
            console.log("XMLHttpRequest readyState:", xmlhttp.readyState, "status:", xmlhttp.status);
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                const data = JSON.parse(xmlhttp.responseText);
                console.log("Resposta do servidor:", data);
                if (data.success) {
                    console.log("Usuário cadastrado com sucesso!");
                    document.getElementById('nome').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('senha').value = "";
                    document.getElementById('confirmarSenha').value = "";
                    mensagemCadastro.textContent = "Usuário cadastrado";
                    mensagemCadastro.style.color = "green";
                    //window.location.href = 'formulario.html';
                } else {
                    mensagemCadastro.textContent = "Erro: " + data.message;
                    mensagemCadastro.style.color = "red";
                }
            }
        };

        xmlhttp.send(JSON.stringify(dados));
        console.log("Dados enviados via XMLHttpRequest");
    });
} else {
    console.log("cadastroForm não encontrado");
}

if (formularioCadastro) {
    console.log("formularioCadastro encontrado");

    formularioCadastro.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Formulário de dados enviado");

        const local = document.getElementById('local').value;
        const objetivo = document.getElementById('objetivo').value;
        const experiencia = document.getElementById('experiencia').value;
        const sexo = document.getElementById('sexo').value;
        const peso = document.getElementById('peso').value;
        const altura = document.getElementById('altura').value;
        const data_nasc = document.getElementById('data_nasc').value;


        console.log("Dados capturados:", { local, objetivo, experiencia, sexo, peso, altura });

        const dados = {
            local: local,
            objetivo: objetivo,
            experiencia: experiencia,
            sexo: sexo,
            data_nasc: data_nasc,
            peso: peso,
            altura: altura
        };


        console.log("Dados a serem enviados:", dados);

        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://localhost/gymsaga/formulario.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");

        xmlhttp.onreadystatechange = function () {
            console.log("XMLHttpRequest readyState:", xmlhttp.readyState, "status:", xmlhttp.status);
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                console.log("Resposta do servidor recebida com sucesso");
                const data = JSON.parse(xmlhttp.responseText);
                console.log("Resposta do servidor:", data);
                //window.location.href = 'home.html';
            } else if (xmlhttp.readyState === 4) {
                console.log("Erro ao enviar o formulário.");
                alert("Erro ao enviar o formulário. Por favor, tente novamente.");
            }
        };

        xmlhttp.send(JSON.stringify(dados));
        console.log("Dados enviados via XMLHttpRequest");
    });
} else {
    console.log("formularioCadastro não encontrado");
}

function verificaSessao() {
    console.log("Verificando sessão...");

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost/gymsaga/verifica_sessao.php", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            console.log("Status da requisição:", xmlhttp.status);
            if (xmlhttp.status === 200) {
                const resposta = JSON.parse(xmlhttp.responseText);
                console.log("Resposta do servidor:", resposta);
                if (!resposta.logado) {
                    console.log("Usuário não logado, redirecionando para login.");
                    console.log(resposta);
                    //window.location.href = 'index.html';
                } else {
                    console.log("Usuário logado.");
                    console.log(resposta);
                }
            } else {
                console.error("Erro ao verificar a sessão.");
            }
        }
    };
    xmlhttp.send();
}

