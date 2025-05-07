// --- Função para buscar e exibir todas as atividades da API ---
function getAtividades() {
    fetch('https://localhost:7125/api/atividades/atividades')
        .then(response => response.json())
        .then(data => {

            data.sort((a, b) => new Date(a.data_atividade) - new Date(b.data_atividade)); // Organiza as datas em ordem crescente

            const atividadeTable = document.getElementById('atividadeTable');
            const tbody = atividadeTable.querySelector('tbody');
            tbody.innerHTML = ''; // Limpa a tabela antes de preencher novamente

            data.forEach(atividade => { // Para cada atividade recebida da API...
                const row = document.createElement('tr'); // Cria uma nova linha da tabela

                // Cria e preenche a célula da matéria
                const materiaCell = document.createElement('td');
                materiaCell.textContent = atividade.materia;
                row.appendChild(materiaCell);

                const descricaoCell = document.createElement('td');
                descricaoCell.textContent = atividade.descricao;
                row.appendChild(descricaoCell);

                const dataCell = document.createElement('td');
                const [ano, mes, dia] = atividade.data_atividade.split('-'); // Desestruturando a data e guardando nas variáveis ano, mes e dia
                const dataAtividade = new Date(ano, mes - 1, dia); // Subtraindo um mes para ficar certo, no JS os meses vão de 0 a 11. Ex: abril = 3
                dataCell.textContent = dataAtividade.toLocaleDateString('pt-BR'); // Exibindo no formato brasileiro a data
                row.appendChild(dataCell);

                // --- Fazendo a contagem de vencimento da atividade ---
                const dataSistema = new Date();
                dataSistema.setHours(0, 0, 0, 0); // Zerando as horas
                dataAtividade.setHours(0, 0, 0, 0);

                // Calculando a diferença de dias inteiros entre duas datas
                const vencimentoAtividade = Math.floor((dataAtividade - dataSistema) / (1000 * 60 * 60 * 24));

                const vencimentoAtividadeCell = document.createElement('td');
                row.appendChild(vencimentoAtividadeCell);

                if (vencimentoAtividade === 1) {
                    vencimentoAtividadeCell.textContent = vencimentoAtividade + " dia restante";
                }
                else if (vencimentoAtividade === 0) {
                    vencimentoAtividadeCell.textContent = "O vencimento é hoje!";
                }
                else if (vencimentoAtividade > 1) {
                    vencimentoAtividadeCell.textContent = vencimentoAtividade + " dias restantes";
                }
                else if (vencimentoAtividade === -1) {
                    vencimentoAtividadeCell.textContent = "Venceu a " + Math.abs(vencimentoAtividade) + " dia";
                }
                else {
                    vencimentoAtividadeCell.textContent = "Venceu a " + Math.abs(vencimentoAtividade) + " dias";
                }
                // --- Fim da contagem de vencimento da atividade ---

                // Cria os botões de excluir e atualizar uma atividade
                const actionsCell = document.createElement('td');
                row.appendChild(actionsCell); // Adiciona os botões na linha
                tbody.appendChild(row); // Adiciona a linha na tabela

                // Botão de concluir ao lado de cada tarefa
                const concluirButton = document.createElement('button');
                concluirButton.className = 'btn btn-sm me-2'; // estilo Bootstrap
                concluirButton.innerHTML = '<img src="img/iconeCheck.png" alt="Concluir" width="20" height="20">';
                concluirButton.addEventListener('click', () => {
                    row.classList.toggle('riscado');
                });
                actionsCell.appendChild(concluirButton);

                // Botão de atualizar ao lado de cada tarefa
                const updateButton = document.createElement('button');
                updateButton.className = 'btn btn-sm'; // estilo Bootstrap
                updateButton.setAttribute('data-bs-toggle', 'modal');
                updateButton.setAttribute('data-bs-target', '#updateAtividade');
                updateButton.innerHTML = '<img src="img/iconeEditar.png" alt="Editar" width="20" height="20">';
                updateButton.addEventListener('click', () => preencherUpdateForm(atividade));
                actionsCell.appendChild(updateButton);

                // Função que preenche o formulário de atualização com os dados da atividade clicada
                function preencherUpdateForm(atividade) {
                    document.getElementById('updateId').value = atividade.id_tarefa;
                    document.getElementById('updateMateria').value = atividade.materia;
                    document.getElementById('updateDescricao').value = atividade.descricao;
                    document.getElementById('updateData').value = atividade.data_atividade;
                }

                // Botão de excluir ao lado de cada tarefa
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm me-2'; // estilo Bootstrap
                deleteButton.innerHTML = '<img src="img/iconeLixeira.png" alt="Excluir" width="20" height="20">';
                deleteButton.addEventListener('click', () => deleteAtividade(atividade.id_tarefa));
                actionsCell.appendChild(deleteButton);

            });
        });
}

// --- Função para adicionar uma nova atividade ---
function addAtividade(event) {
    event.preventDefault(); // Impede que a página recarregue ao enviar o formulário

    // Valores capturados dos campos do formulário
    const materia = document.getElementById('materia').value;
    const descricao = document.getElementById('descricao').value;
    const data = document.getElementById('data').value;

    // Objeto sendo criado com os dados da nova atividade
    const atividade =
    {
        materia: materia,
        descricao: descricao,
        data_atividade: data
    };

    // Envia os dados para a API usando o método POST
    fetch('https://localhost:7125/api/atividades',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atividade)
        })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário após o envio
                document.getElementById('materia').value = '';
                document.getElementById('descricao').value = '';
                document.getElementById('data').value = '';
                getAtividades(); // Atualiza a tabela após adicionar uma atividade
            }
        });
}

// --- Função para atualizar de uma atividade ---
function updateAtividade(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Captura os dados preenchidos no formulário de atualização
    const id_tarefa = parseInt(document.getElementById('updateId').value);
    const materia = document.getElementById('updateMateria').value;
    const descricao = document.getElementById('updateDescricao').value;
    const data = document.getElementById('updateData').value;

    const atividade =
    {
        // Monta o objeto com os dados atualizados
        id_tarefa: id_tarefa,
        materia: materia,
        descricao: descricao,
        data_atividade: data
    };

    // Envia os dados atualizados para a API usando PUT
    fetch(`https://localhost:7125/api/atividades/${id_tarefa}`,
        {
            method: 'PUT',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atividade)
        })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário após a atualização
                document.getElementById('updateId').value = '';
                document.getElementById('updateMateria').value = '';
                document.getElementById('updateDescricao').value = '';
                document.getElementById('updateData').value = '';
                getAtividades(); // Atualiza a tabela após atualizar uma atividade
            }
        });
}
// --- Função para deletar uma atividade pelo ID ---
function deleteAtividade(id_tarefa) {
    fetch(`https://localhost:7125/api/atividades/${id_tarefa}`,
        {
            method: 'DELETE'
        })

        .then(response => {
            if (response.ok) {
                getAtividades(); // Atualiza a tabela após excluir
            }
        });
}

// Liga os formulários às funções usando eventos
document.getElementById('addAtividadeForm').addEventListener('submit', addAtividade);
document.getElementById('updateAtividadeForm').addEventListener('submit', updateAtividade);

// Mostra as atividades já cadastradas ao carregar a página
getAtividades();