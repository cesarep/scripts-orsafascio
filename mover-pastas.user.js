// ==UserScript==
// @name         Mover pastas
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/mover-pastas.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/mover-pastas.user.js
// @version      0.3
// @description  Move pastas inteiras
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    // Puxa dados basicos de autenticação da página
    var auth = {
        token: document.querySelector('meta[name=csrf-token]').content,
        empresa: document.getElementById('orc_pasta_empresa_id').value,
        user: document.getElementById('orc_pasta_usuario_id').value
    }

    // puxa a arvore de pastas
    var pastas = await todas_pastas()

    // adiciona os botoes para mover a pasta
    document.querySelectorAll("#lista tr[data-id] td:last-of-type").forEach( (node) => {
        node.innerHTML = '<a title="Mover a pasta" data-pasta="'+node.parentElement.dataset.id+'" href="javascript:;"><span class="material-icons">drive_file_move_rtl</span></a>'
        // adiciona o evento para abrir o modal
        node.children[0].onclick = (e) => abrir_modal(auth, pastas, node.parentElement.dataset.id);
    })

})();

// cria pasta novas
async function criar_pasta(nome, auth, pasta=null) {
    let id;

    // caso seja pasta raiz, anula
    if(pasta == "raiz") pasta=null;

    // se não tiver pasta pai, cria
    await window.jQuery.post("/orc/pastas", {
        'utf8': "✓",
        'authenticity_token': auth.token,
        'orc_pasta[empresa_id]': auth.empresa,
        'orc_pasta[usuario_id]': auth.user,
        'orc_pasta[pasta_id]': pasta,
        'orc_pasta[nome]': nome
    }).done( (data) => {
        id = window.jQuery(data).find("#orc_pasta_pasta_id").val()
    });

    return id;
}

// deleta pastas
async function deletar_pasta(auth, pastaid) {
    await window.jQuery.post("/orc/pastas/"+pastaid, {
        '_method': "delete",
        'authenticity_token': auth.token
    }).done( (data, s) => {
        let docu = window.jQuery(data);
        // captura a mensagem de erro caso houver
        let erro = docu.find('div.alert.alert-error')[0]
        console.log(erro ? `Pasta ${pastaid}: ${erro.textContent}` : `Pasta ${pastaid} deletada`);
        return Boolean(erro)
    });
}

// move o orçamento
async function move_orc(orcid, pastaid = 'raiz') {
    await window.jQuery.get("/orc/pastas/"+pastaid+"/mover_orcamento?orcamento_id="+orcid).done( (data, s) => {
        console.log(`Orçamento ${orcid} movido para ${pastaid}`);
    });
}

// lista com nome da pasta e codigos das subpasta e orçamentos
async function pasta_list(pastaid) {
    var pastas, orcs, nome;

    await window.jQuery.get("/orc/orcamentos?pasta_id="+pastaid).done( (data) => {
        let docu = window.jQuery(data);
        nome = docu.find("#orc_pasta_nome[value]").val();
        pastas = [...docu.find("#lista tr[data-id]")].map( el => el.dataset.id );
        orcs = [...docu.find("#lista tr:not([data-id]):not(:first-of-type) td:first-of-type a")].map( el => el.href.split('/').reverse()[0] );
    });

    return {
        nome: nome,
        pastas: pastas,
        orcamentos: orcs
    };
}

// conta o total de itens a serem movidos
async function count_itens(pastaid) {
    var total = 0
    var itens = await pasta_list(pastaid);

    total += itens.orcamentos.length;

    // recursivo, move as pastas dentro para a nova pasta
    for(const pasta of itens.pastas) {
        total += await count_itens(pasta);
    }

    return total;
}

// move os orçamentos e subpastas recursivamente
async function move_pasta(auth, origemid, destinoid) {
    // monta a árvore de itens da pasta de origem
    var itens = await pasta_list(origemid)

    // cria pasta nova com mesmo nome
    console.log(itens.nome)
    let pasta_nova = await criar_pasta(itens.nome, auth, destinoid)

    // recursivo, move as pastas dentro para a nova pasta
    for(const pasta of itens.pastas) {
        await move_pasta(auth, pasta, pasta_nova);
    }

    // move os orçamentos para a nova pasta
    for(const orc of itens.orcamentos) {
        await move_orc(orc, pasta_nova);
        // incrementa a barra de progresso
        document.getElementById('mover-progress').value++;
    }

    // deleta a pasta antiga quanto terminar
    await deletar_pasta(auth, origemid);
}

// monta a árvore com todas as pastas
async function todas_pastas(pastaid = null) {
    var pastas, cod, nome, subpastas;

    await window.jQuery.get("/orc/orcamentos" + (pastaid ? "?pasta_id="+pastaid : "") ).done( data => {
        let docu = window.jQuery(data);
        nome = docu.find("#orc_pasta_nome[value]").val() ?? '/';
        cod = pastaid ?? 'raiz'
        pastas = [...docu.find("#lista tr[data-id]")].map(el => el.dataset.id );
    });

    pastas = await Promise.all(pastas.map(pasta => todas_pastas(pasta)));

    return {
        nome: nome,
        cod: cod,
        subpastas: pastas,
    };
}

// renderiza a lista de pastas
function html_lista_pasta(pasta, origem, pad = 5, pad_inc = 25) {
    let html;
    if(pasta.cod == origem) {
        html = `<tr class="info"><td style="padding-left: ${pad}px;">${pasta.nome}</td></tr>`;
    } else {
        html = `<tr><td style="padding-left: ${pad}px;"><a href="javascript:;" class="mover_pasta" data-destino="${pasta.cod}">${pasta.nome}</a></td></tr>`;
        pasta.subpastas.forEach(pasta => {
            html += html_lista_pasta(pasta, origem, pad+pad_inc, pad_inc)
        })
    }
    return html;
}

// renderiza a lista de pastas
function html_lista_pasta2(pasta, origem, pad = 5, pad_inc = 25) {
    let html;
    if(pasta.cod == origem) {
        html = `<li class="info" style="padding-left: ${pad}px;">${pasta.nome}</li>`;
    } else {
        html = `<li style="padding-left: ${pad}px;"><a href="javascript:;" class="mover_pasta" data-destino="${pasta.cod}">${pasta.nome}</a>`;
        if(pasta.subpastas.length > 0) {
            html += '<ul>'
            pasta.subpastas.forEach(pasta => {
                html += html_lista_pasta2(pasta, origem, pad+pad_inc, pad_inc)
            })
            html += '</ul>'
        }
        html += '</li>'
    }
    return html;
}


// abre o modal com a seleção de pastas
async function abrir_modal(auth, pastas, origem){
    window.jQuery('#form-modal-titulo').html('<h3><span class="material-icons">folder</span> Pastas</h3>');
    window.jQuery('#form-modal-corpo').html('<div class="modal-body"><h4>Clique na pasta de destino para mover</h4><br/><table class="table" data-origem="'+origem+'">'
                                            +html_lista_pasta(pastas, origem)
                                            +'</table></div><div class="modal-footer"><a class="btn" data-dismiss="modal">Fechar</a></div>');
    // adiciona os eventos
    document.querySelectorAll('#form-modal-corpo table tr td a.mover_pasta').forEach( node => {
        node.onclick = async (e) => {
            if(window.confirm("Mover a pasta?")){
                origem = document.querySelector('#form-modal-corpo table').dataset.origem;
                let total = await count_itens(origem);
                // redefine o modal
                window.jQuery('#form-modal-corpo').html(`<div class="modal-body"><h4 class="loading">Movendo</h4><progress id="mover-progress" style="width:100%" value=0 max=${total}></div>`);
                await move_pasta(auth, origem, node.dataset.destino)
                window.alert("Pasta movida")
                // redireciona para novo destino
                window.location.href="/orc/orcamentos?pasta_id="+node.dataset.destino
            }
        }
    })
    window.jQuery('#form-modal-corpo table');
    window.jQuery('#form-modal').modal('show');
}
