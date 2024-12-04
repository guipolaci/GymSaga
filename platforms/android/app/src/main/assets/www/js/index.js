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
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/cadastro.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/cadastro.php', true);
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

    const local = document.getElementById('local').value;
    const objetivo = document.getElementById('objetivo').value;
    const experiencia = document.getElementById('experiencia').value;
    const sexo = document.getElementById('sexo').value;
    const data_nasc = document.getElementById('data_nasc').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/formulario.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/formulario.php', true);
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
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/index.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/index.php', true);
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

function carregaPerfil() {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaPerfil.php', true);
    //xmlhttp.open('POST', 'http://localhost/GymSaga/carregaPerfil.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log("Resposta completa:", resposta);
                console.log("Conteúdo de resposta.data:", resposta.data);
                const { nome, pontos, nivel, foto, email } = resposta.data;
                document.getElementById('nomeUsuario').textContent = nome;
                document.getElementById('pontosUsuario').textContent = pontos;
                document.getElementById('nivelUsuario').textContent = nivel;
                document.getElementById('emailUsuario').textContent = email;

                const fotoUsuario = document.getElementById('fotoUsuario');
                if (foto && fotoUsuario) {
                    fotoUsuario.src = `https://solumidia.com.br/etec/${foto}`;
                }

            } else {
                console.error("Erro ao carregar perfil:", resposta.message);
            }
        } catch (error) {
            console.error("Erro ao processar os dados do perfil:", error);
        }
    };

    xmlhttp.send(`user_id=${user_id}`);
}

function carregarDadosParaEdicao() {
    const user_id = verificarAutenticacao();

    if (!user_id) {
        console.error("Usuário não autenticado.");
        return;
    }

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaPerfil.php', true);
    //xmlhttp.open('POST', 'http://localhost/GymSaga/carregaPerfil.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        try {
            const resposta = JSON.parse(this.responseText);

            if (resposta.status === 'success') {
                const { nome, sexo, peso, altura, foto, data_nasc } = resposta.data;

                document.getElementById('nome').value = nome;
                document.getElementById('sexo').value = sexo;
                document.getElementById('peso').value = peso;
                document.getElementById('altura').value = altura;
                document.getElementById('data-nascimento').value = data_nasc;

                if (foto) {
                    const fotoPreview = document.createElement('img');
                    fotoPreview.src = foto;
                    fotoPreview.alt = "Foto Atual";
                    fotoPreview.style.maxWidth = "100px";
                    document.getElementById('foto-preview').appendChild(fotoPreview);
                }
            } else {
                console.error("Erro ao carregar dados do perfil:", resposta.message);
            }
        } catch (error) {
            console.error("Erro ao processar os dados do perfil:", error);
        }
    };

    xmlhttp.send(`user_id=${user_id}`);
}

function salvarAlteracoesPerfil(event) {
    event.preventDefault();
    const user_id = verificarAutenticacao();

    if (!user_id) {
        console.error("Usuário não autenticado.");
        return;
    }
    const mensagem = document.getElementById('perfilMessage');
    const nome = document.getElementById('nome').value;
    const sexo = document.getElementById('sexo').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const fotoInput = document.getElementById('foto');
    const foto = fotoInput.files[0];

    mensagem.textContent = '';

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('nome', nome);
    formData.append('sexo', sexo);
    formData.append('peso', peso);
    formData.append('altura', altura);
    formData.append('data_nasc', dataNascimento);
    if (foto) {
        formData.append('foto', foto);
    }

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/atualizaPerfil.php', true);
    //xmlhttp.open('POST', 'http://localhost/GymSaga/atualizaPerfil.php', true);

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                mensagem.textContent = 'Perfil atualizado com sucesso!';
                mensagem.style.color = 'green';
                setTimeout(() => window.location.href = 'perfil.html', 1000);
            } else {
                console.log("Erro ao salvar alterações:", resposta.message);
                mensagem.textContent = 'Erro ao salvar alterações:' + resposta.message;
                mensagem.style.color = 'red';
            }
        } catch (error) {
            console.error("Erro ao processar a resposta:", error);
        }
    };

    xmlhttp.send(formData);
}

function carregarRanking() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaRanking.php', true);
    //xmlhttp.open('GET', 'http://localhost/GymSaga/carregaRanking.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);

            if (resposta.status === 'success') {
                const ranking = resposta.data;
                const rankingBody = document.getElementById('rankingBody');

                rankingBody.innerHTML = '';

                ranking.forEach((usuario, index) => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.pontos}</td>
                    `;

                    rankingBody.appendChild(row);
                });
            } else {
                console.error("Erro ao carregar ranking:", resposta.message);
            }
        } catch (error) {
            console.error("Erro ao processar a resposta do ranking:", error);
        }
    };

    xmlhttp.send();
}

function carregarInventario(raridade = 'Todas') {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/inventario.php', true);
    //xmlhttp.open('POST', 'http://localhost/GymSaga/inventario.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            const inventoryGrid = document.querySelector('.inventory-grid');

            inventoryGrid.innerHTML = '';

            if (resposta.status === 'success') {
                resposta.itens.forEach(item => {
                    if (raridade === 'Todas' || item.raridade === raridade) {
                        const slot = document.createElement('div');
                        slot.className = 'inventory-slot';
                        slot.id = `item-${item.item_id}`;
                        slot.innerHTML = `
                            <p class="inventory-item-name">${item.item_nome}</p>
                            <p class="inventory-item-rarity">${item.raridade}</p>
                        `;
                        inventoryGrid.appendChild(slot);
                    }
                });

                if (inventoryGrid.innerHTML === '') {
                    inventoryGrid.innerHTML = '<p class="inventory-empty">Nenhum item encontrado para essa raridade.</p>';
                }
            } else {
                inventoryGrid.innerHTML = '<p class="inventory-empty">Você não possui nenhum item.</p>';
            }
        } catch (error) {
            console.error("Erro ao processar a resposta do inventário:", error);
        }
    };
    xmlhttp.send(`user_id=${user_id}`);
}

function carregarMapaDeFases() {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/mapa_fases.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/mapa_fases.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            const mapContainer = document.querySelector('.map-container');

            mapContainer.innerHTML = ''; 

            if (resposta.status === 'success') {
                resposta.fases.forEach((fase, index) => {
                    const faseDiv = document.createElement('div');
                    faseDiv.className = `fase ${fase.fase_status}`;
                    faseDiv.id = `fase-${fase.fase_id}`;
                    faseDiv.textContent = index + 1;

                    if (fase.fase_status === 'active') {
                        faseDiv.onclick = () => {
                            window.location.href = `fase.html?fase_id=${fase.fase_id}`;
                        };
                    }

                    mapContainer.appendChild(faseDiv);

                    if (index < resposta.fases.length - 1) {
                        const path = document.createElement('div');
                        path.className = 'path vertical';
                        mapContainer.appendChild(path);
                    }
                });
            } else {
                mapContainer.innerHTML = '<p>Você não possui fases associadas.</p>';
            }
        } catch (error) {
            console.error('Erro ao processar mapa de fases:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}`);
}










