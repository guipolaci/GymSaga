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
    abrirModal('modalLogout');
}

function confirmarLogout() {
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
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/enviaFormulario.php', true);
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
                setTimeout(() => window.location.href = 'home.html?modal=modalBoasVindas', 1000);
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
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaInventario.php', true);
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
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaMapaDeFases.php', true);
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
                    console.log("Nivel requerido da fase: " + fase.nivel_requerido);

                    if (fase.fase_status === 'ativa') {
                        faseDiv.onclick = () => {
                            window.location.href = `fase.html?nivel=${fase.nivel_requerido}`;
                        };
                    } else if (fase.fase_status === 'bloqueada') {
                        faseDiv.style.cursor = 'not-allowed';
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

function carregarFases() {
    const urlParametros = new URLSearchParams(window.location.search);
    const nivel = urlParametros.get('nivel');

    if (!nivel) {
        alert("Nível não encontrado.");
        window.location.href = "home.html";
        return;
    }

    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaFases.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/carregaFases.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            const container = document.querySelector('.fase-container');

            container.innerHTML = '';

            if (resposta.status === 'success') {
                resposta.fases.forEach(fase => {
                    console.log("fase id=", fase.fase_id);
                    console.log("Fase completa:", fase);
                    const card = document.createElement('div');
                    card.className = 'fase-card';
                    card.innerHTML = `
                        <h3 class="fase-nome">${fase.nome}</h3>
                        <p class="fase-descricao">${fase.descricao}</p>
                        <div class="info-linhas">
                            <div class="info-item">
                                <strong>Dificuldade:</strong> ${fase.dificuldade}
                            </div>
                            <div class="info-item">
                                <strong>Objetivo:</strong> ${fase.objetivo}
                            </div>
                        </div>
                        <div class="info-linhas">
                            <div class="info-item">
                                <strong>Status:</strong> ${fase.status}
                            </div>
                            <div class="info-item">
                                <strong>Nível:</strong> ${fase.nivel_requerido}
                            </div>
                        </div>
                        <button class="btn btn w-100" onclick="iniciarFase(${fase.fase_id}, '${fase.status}')">
                        ${fase.status === 'em andamento' ? 'Continuar' : 'Iniciar fase'}</button>
                    `;
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = '<p>Você não possui fases associadas a este nível.</p>';
            }
        } catch (error) {
            console.error("Erro ao processar resposta JSON:", error);
            alert("Erro ao carregar fases. Tente novamente mais tarde.");
        }
    };

    xmlhttp.send(`user_id=${user_id}&nivel=${nivel}`);
}

function iniciarFase(fase_id, status) {
    if (status === 'em andamento') {
        console.log("Fase em andamento.");
        window.location.href = `treino.html?fase_id=${fase_id}`;
    }

    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/atualizaStatusFase.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/status_fase.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    console.log(this.responseText);
    xmlhttp.onload = function () {
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                window.location.href = `treino.html?fase_id=${fase_id}`;
            } else {
                console.error('Erro ao atualizar status:', resposta.message);
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&fase_id=${fase_id}`);

}

function carregarTreinos() {
    const user_id = verificarAutenticacao();
    const urlParametros = new URLSearchParams(window.location.search);
    const fase_id = urlParametros.get('fase_id');

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaTreinos.php', true);
    //xmlhttp.open('POST', 'http://localhost/gymsaga/carregarTreinos.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            const container = document.querySelector('.treino-container');

            if (resposta.status === 'success') {
                resposta.treinos.forEach(treino => {
                    console.log("treino_id=" + treino.treino_id);
                    const card = document.createElement('div');
                    card.className = 'treino-card';
                    card.innerHTML = `
                        <h3 class="treino-nome">${treino.nome}</h3>
                        <p class="treino-descricao">${treino.descricao}</p>
                        <div class="info-linhas">
                            <div class="info-item"><strong>Categoria:</strong> ${treino.categoria} </div>
                            <div class="info-item"><strong>Dificuldade:</strong> ${treino.dificuldade}</div>
                        </div>
                        <div class="info-linhas">
                            <div class="info-item"><strong>Tempo:</strong> ${treino.tempo} min</div>
                            <div class="info-item"><strong>Status:</strong> ${treino.status} </div>
                        </div>
                        <button class="btn btn-primary w-100 mt-2" onclick="iniciarTreino(${treino.treino_id}, ${fase_id}, '${treino.status}')" ${treino.status === 'concluído' ? 'disabled' : ''}>
                        ${treino.status === 'em andamento' ? 'Continuar' : 'Iniciar Treino'}</button>
                    `;
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = '<p>Nenhum treino disponível para esta fase.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar os treinos:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&fase_id=${fase_id}`);
}

function iniciarTreino(treino_id, fase_id, status) {

    if (status === 'em andamento') {
        console.log("Treino em andamento.");
        window.location.href = `exercicios.html?treino_id=${treino_id}&fase_id=${fase_id}`;
    }

    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/atualizaStatusTreino.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                window.location.href = `exercicios.html?treino_id=${treino_id}&fase_id=${fase_id}`;
            } else {
                console.error('Erro ao atualizar status:', resposta.message);
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&treino_id=${treino_id}`);

}

function carregarExercicios() {
    const urlParametros = new URLSearchParams(window.location.search);
    const treino_id = urlParametros.get('treino_id');
    const fase_id = urlParametros.get('fase_id');

    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaExercicios.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            const exerciciosContainer = document.querySelector('.exercicios-container');

            exerciciosContainer.innerHTML = '';

            if (resposta.status === 'success') {
                resposta.exercicios.forEach(exercicio => {
                    const card = document.createElement('div');
                    card.className = 'exercicios-card';
                    card.innerHTML = `
                        <h3 class="exercicios-nome">${exercicio.nome}</h3>
                        <div class="info-linhas">
                            <div class="info-item">
                                <strong>Categoria:</strong> ${exercicio.categoria}
                            </div>

                            <div class="info-item">
                                <strong>Grupo muscular:</strong> ${exercicio.grupo_muscular}
                            </div>
                        </div>
                        <div class="info-linhas">
                            <div class="info-item">
                                <strong>Status:</strong> ${exercicio.status}
                            </div>
                        </div>
                        <button class="btn btn w-100" onclick="iniciarExercicio(${exercicio.exercicio_id}, ${treino_id}, ${fase_id}, '${exercicio.status}')" ${exercicio.status === 'concluído' ? 'disabled' : ''}>
                        ${exercicio.status === 'em andamento' ? 'Continuar' : 'Iniciar'}</button>
                    `;
                    exerciciosContainer.appendChild(card);
                });
            } else {
                exerciciosContainer.innerHTML = '<p>Nenhum exercício encontrado para este treino.</p>';
            }
        } catch (error) {
            console.error('Erro ao processar a resposta dos exercícios:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&treino_id=${treino_id}`);
}

function iniciarExercicio(exercicio_id, treino_id, fase_id, status) {

    if (status === 'em andamento') {
        console.log("Exercicio em andamento.");
        window.location.href = `exercicio.html?exercicio_id=${exercicio_id}&treino_id=${treino_id}&fase_id=${fase_id}`;
    }

    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/atualizaStatusExercicio.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                window.location.href = `exercicio.html?exercicio_id=${exercicio_id}&treino_id=${treino_id}&fase_id=${fase_id}`;
            } else {
                console.error('Erro ao iniciar exercicioc:', resposta.message);
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&exercicio_id=${exercicio_id}`);

}

function carregarExercicio() {
    const urlParametros = new URLSearchParams(window.location.search);
    const exercicio_id = urlParametros.get("exercicio_id");

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/carregaExercicio.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);

            if (resposta.status === 'success') {
                const exercicio = resposta.exercicio;

                document.getElementById('exercicio-nome').textContent = exercicio.nome;
                document.getElementById('exercicio-descricao').textContent = exercicio.descricao;
                document.getElementById('grupo-muscular').textContent = exercicio.grupo_muscular;

                if (exercicio.imagem) {
                    const img = document.getElementById('exercicio-imagem');
                    img.src = exercicio.imagem;
                    img.style.display = 'block';
                }

                if (exercicio.video) {
                    const video = document.getElementById('exercicio-video');
                    video.querySelector('source').src = exercicio.video;
                    video.style.display = 'block';
                }

                if (exercicio.foto_grupo_muscular) {
                    const fotoGrupo = document.getElementById('foto-grupo-muscular');
                    fotoGrupo.src = exercicio.foto_grupo_muscular;
                    fotoGrupo.style.display = 'block';
                }

                if (exercicio.segundos) {
                    document.getElementById('exercicio-segundos').textContent = exercicio.segundos;
                    document.getElementById('cronometro-container').style.display = 'block';
                }
            } 

        } catch (error) {
            console.error('Erro ao carregar o exercício:', error);
        }
    };

    xmlhttp.send(`exercicio_id=${exercicio_id}`);
}

function finalizarExercicio() {
    const user_id = verificarAutenticacao();
    const urlParametros = new URLSearchParams(window.location.search);
    const exercicio_id = urlParametros.get('exercicio_id');
    const treino_id = urlParametros.get('treino_id');
    const fase_id = urlParametros.get('fase_id');

    const series = document.getElementById('series').value;
    const repeticoes = document.getElementById('repeticoes').value;
    const peso = document.getElementById('peso').value;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/finalizaExercicio.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                console.log("verificando conclusao treino");
                verificarConclusaoTreino(treino_id, fase_id);
                abrirModal('modalExercicioConcluido');
                setTimeout(() => window.location.href = `exercicios.html?treino_id=${treino_id}&fase_id=${fase_id}`, 2000);
            } else {
                console.log('Erro ao finalizar o exercício: ' + resposta.message);
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&exercicio_id=${exercicio_id}&series=${series}&repeticoes=${repeticoes}&peso=${peso}`);
}


function iniciarCronometro() {
    let segundos = parseInt(document.getElementById('exercicio-segundos').textContent, 10);
    const display = document.getElementById('cronometro-display');

    const interval = setInterval(() => {
        if (segundos > 0) {
            segundos--;
            const minutos = Math.floor(segundos / 60);
            const seg = segundos % 60;
            display.textContent = `${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function verificarConclusaoTreino(treino_id, fase_id) {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/verificaConclusaoTreino.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);

            if (resposta.status === 'success') {
                console.log(`Treino ${treino_id} concluido`);
                console.log("total exercicios=" + resposta.totalExercicios);
                console.log("concluidos=" + resposta.concluidos);
                console.log("treinos concluidos da fase_id=" + fase_id);
                console.log("verificando conclusao fase=" + fase_id);
                verificarConclusaoFase(fase_id, () => {setTimeout(() => window.location.href = `treino.html?fase_id=${fase_id}`, 2000);});
                
            } else {
                console.log(`Treino ${treino_id} ainda não foi concluído.`);
            }
        } catch (error) {
            console.error('Erro ao processar a resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&treino_id=${treino_id}`);
}


function verificarConclusaoFase(fase_id, callback) {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/verificaConclusaoFase.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                console.log("fase concluida");
                console.log("total treinos=" + resposta.totalTreinos);
                console.log("concluidos=" + resposta.concluidos);
                console.log("fase=" + fase_id);
                window.location.href = `home.html?fase_id=${fase_id}&modal=modalFeedback`;
                //window.location.href = `home.html?fase_id=${fase_id}`;

            } else {
                console.log(resposta.message);
                console.log("a fase ainda não foi concluida");
                if (typeof callback === 'function') callback();
            } 

        } catch (error) {
            console.error('Erro ao processar a resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&fase_id=${fase_id}`);
}

function abrirModalPorURL() {
    const urlParametros = new URLSearchParams(window.location.search);
    const modal = urlParametros.get('modal');

    if (modal) {
        const modalContainer = document.getElementById(modal);
        if (modalContainer) {
            modalContainer.classList.remove('hidden');
        } else {
            console.error(`Modal id="${modal}" não encontrado.`);
        }
    }
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        console.error(`Modal id='${modalId}' não encontrado.`);
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    } else {
        console.error(`Modal id='${modalId}' não encontrado.`);
    }
}

function enviarFeedback() {
    const urlParametros = new URLSearchParams(window.location.search);
    const fase_id = urlParametros.get('fase_id');
    const user_id = verificarAutenticacao();
    const nota = document.getElementById('nota').value;
    const comentario = document.getElementById('comentario').value;
    const mensagem = document.getElementById('feedbackMessage');

    mensagem.textContent = '';

   if (nota < 0 || nota > 5 || nota === '') {
        mensagem.textContent = "Insira um valor entre 0 a 5 para nota.";
        mensagem.style.color = "red";
        return;
    }

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/enviarFeedback.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                console.log(resposta.message);
                mensagem.textContent = "Feedback enviado com sucesso";
                mensagem.style.color = "green";
                console.log("indo sortear recompensa");
                fecharModal("modalFeedback");
                sortearRecompensa(fase_id);
            } 
            else {
                mensagem.textContent = "Erro ao enviar feedback. " + resposta.message;
                mensagem.style.color = "red";
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&fase_id=${fase_id}&nota=${nota}&comentario=${comentario}`);
}

function sortearRecompensa(fase_id) {
    const user_id = verificarAutenticacao();

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'https://solumidia.com.br/etec/sorteaRecompensa.php', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xmlhttp.onload = function () {
        console.log(this.responseText);
        try {
            const resposta = JSON.parse(this.responseText);
            if (resposta.status === 'success') {
                const item = resposta.item;
                document.getElementById('recompensa-nome').textContent = item.nome;
                document.getElementById('raridade').textContent = item.raridade;

                const imagem = document.getElementById('recompensa-imagem');
                if (item.imagem) {
                    imagem.src = item.imagem;
                    imagem.style.display = 'block';
                } else {
                    imagem.style.display = 'none';
                }

                abrirModal('modalRecompensa');

            } else {
                console.error('Erro ao sortear item:', resposta.message);
            }
        } catch (error) {
            console.error('Erro ao processar resposta JSON:', error);
        }
    };

    xmlhttp.send(`user_id=${user_id}&fase_id=${fase_id}`);
}

function voltarPagina() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = "home.html";
    }
}











