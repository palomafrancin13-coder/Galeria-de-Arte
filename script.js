function salvarObras(dados) {
    localStorage.setItem("obras", JSON.stringify(dados));
}

function excluir(index) {
    let storage = JSON.parse(localStorage.getItem("obras")) || {};
    let obras = storage.obras || [];

    obras.splice(index, 1);

    salvarObras({
        obras: obras,
        iiif_url: storage.iiif_url
    });

    mostrarTabela();
}

function mostrarTabela() {
    let tabela = document.getElementById("resultado");
    tabela.innerHTML = "";

    let storage = JSON.parse(localStorage.getItem("obras")) || {};
    let dados = storage.obras || [];
    let iiif_url = storage.iiif_url || "";

    if (dados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="5">Nenhum resultado</td></tr>`;
        return;
    }

    dados.forEach((obra, i) => {

        let imagem = "Sem imagem";

        if (obra.image_id && iiif_url) {
    let urlOriginal = `${iiif_url}/${obra.image_id}/full/843,/0/default.jpg`;

    let url = `https://images.weserv.nl/?url=${encodeURIComponent(urlOriginal)}`;

    imagem = `<img src="${url}" onerror="this.style.display='none'">`;
}
        tabela.innerHTML += `
            <tr>
                <td>${imagem}</td>
                <td>${obra.title}</td>
                <td>${obra.artist_title || "Desconhecido"}</td>
                <td>${obra.date_display || "-"}</td>
                <td>
                    <button onclick="excluir(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function buscarObras() {
    let termo = document.getElementById("busca").value;

    if (termo.trim() === "") {
        Swal.fire("Erro", "Digite algo para buscar!", "warning");
        return;
    }

    try {
        let url = `https://api.artic.edu/api/v1/artworks/search?q=${termo}&fields=title,artist_title,image_id,date_display`;

        let resposta = await fetch(url);
        let dados = await resposta.json();

        let obras = dados.data;
        let iiif_url = dados.config.iiif_url;

        salvarObras({
            obras: obras,
            iiif_url: iiif_url
        });

        mostrarTabela();

    } catch (erro) {
        Swal.fire("Erro", "Falha ao buscar dados da API", "error");
        console.error(erro);
    }
}

// carrega automaticamente ao abrir
mostrarTabela();