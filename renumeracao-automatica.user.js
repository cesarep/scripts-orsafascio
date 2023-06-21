// ==UserScript==
// @name         Renumeração Automatica
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/renumeracao-automatica.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/renumeracao-automatica.user.js
// @version      0.4
// @description  Renumera automaticamente os itens
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant    GM_addStyle
// ==/UserScript==

/**
 * Mudanças:
 * v0.4
 *  - Adicionado checkbox para modificar os subitens de uma etapa com numeraçao atualizada
 *
 * v0.3
 *  - Adicionado Botão para editar numeração removido dos orçamentos
 *
 * v0.2
 *  - Corrigido URL para só aparecer na edição de itens
 */

GM_addStyle ( `
    .input-xsmall {
    width: fit-content !important;
}
` );


(function() {
    'use strict';

    let url = window.location.pathname;
    // se esta no modo de edição de items:
    if(url.startsWith('/orc/orcamentos/edit_todos') && window.location.search.endsWith('&item=true')) {
        var html = `
        <div style='float: left;'>
          <button class="btn btn-warning" id="renumeraitens" type="button">Renumerar Itens Automaticamente</button>
          <span style="vertical-align: text-bottom;">
             <input type="checkbox" style="vertical-align: sub;" id="renumeraetapa">
             <label style="display: inline-block;" for="renumeraetapa">Modificar itens das etapas</span>
          </span>
        </div>`

        document.querySelector("#table_orc_itens tbody tr:first-child td:first-child").insertAdjacentHTML('afterbegin',html)

        var btn = document.querySelector("#renumeraitens")
        var chk = document.querySelector("#renumeraetapa")

        function nivel(value) {
            return (value.match(/\./g)||[]).length+1;
        }

        // aplica evento em todos os inputs de etapas
        Array.from(document.querySelectorAll("#table_orc_itens input[type=text][name^=etapa]")).map(etapa => {
            etapa.oninput = () => {
                // se o checkbox de renumerar etapas esta marcado
                if(chk.checked){
                    // valor original
                    let valor_antigo = etapa.defaultValue
                    // seleciona todos os itens cujo valor original comece com o valor original do input da etapa
                    Array.from(document.querySelectorAll("#table_orc_itens input[type=text][value^='"+valor_antigo+".']")).map(item => {
                        // corrige valor para nova etapa
                        item.value = etapa.value + item.defaultValue.slice(valor_antigo.length);
                        item.style.backgroundColor="yellow";
                        item.title = "Valor antigo: " + item.defaultValue;
                    })
                }
            }
        });

        btn.onclick = () => Array.from(document.querySelectorAll("#table_orc_itens input[type=text]")).reduce(
            (acc, node, idx) => {

                let oldvalue = node.value


                let curnivel = nivel(node.value);

                if( curnivel == acc.N && acc.N > 1 ){ // está no mesmo nivel que o item anteriora
                    let base = acc.v.split(".", curnivel-1).join(".")+".";
                    // novo num
                    let newnum = parseInt(acc.v.substring(acc.v.lastIndexOf(".")+1)) + 1;

                    node.value = base + newnum;
                } else if( curnivel == acc.N && acc.N == 1 ){ // esta no mesmo nivel que o anterior, e é primario
                    let base = acc.v.split(".", curnivel);
                    // novo num
                    let newnum = parseInt(base) + 1;

                    node.value = newnum;
                } else if( curnivel > acc.N){ // nivel maior que o anterior

                    node.value = acc.v + ".1";
                } else { // nivel menor que o anterior
                    let base = acc.v.split(".", curnivel).join(".")

                    let newnum = parseInt(base.substring(base.lastIndexOf(".")+1)) + 1;

                    node.value = base.split(".", curnivel-1).join(".") + (curnivel > 1 ? "." : "") + newnum; // só adiciona ponto se nivel > 1
                }

                if ( node.value != oldvalue ){
                    node.style.backgroundColor="yellow"
                    node.title = "Valor antigo: " + oldvalue;
                }

                return { N: nivel(node.value), v: node.value};
            }, { N: 1, v: "0"});

    } else if(!url.startsWith('/orc/orcamentos/edit_todos')) { // se está na pagina do orçamento
        let ultimo_li = document.querySelector('li a[href^="/orc/orcamentos/edit_todos"]').parentElement;
        let link_novo = document.createElement('li')
        link_novo.innerHTML = '<a href="/orc/orcamentos/edit_todos?id=' + document.querySelector('#orcamento_id').getAttribute('orcamento_id') + '&item=true">Editar todos os itens</a>';
        ultimo_li.insertAdjacentElement('afterEnd', link_novo);
    }
})();