// ==UserScript==
// @name         Alterar BDI em massa
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/alterar-BDI-massa.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/alterar-BDI-massa.user.js
// @version      0.8
// @description  Permite modificação em massa dos BDIs no orçamento
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/edit_todos?bdi=true&id=*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

/**
 * Mudanças:
 * 
 * v0.8
 *  - Orçafascio incluiu página própria para BDIs Diferenciados
 *  - Funcionalidades movidas para essa página
 *  - Funções de copia e cola para excel reformuladas
 * 
 * v0.7
 *  - Corrigido itens com bdi "undefined"
 * 
 * v0.6
 *  - Permite copiar e colar dados do BDI diretamente do excel
 *
 * v0.5.1
 *  - Barra com botões de cancelar e salvar fixa na tela
 *  - Campos para alterar BDIs diferenciados de uma vez
 *  - Reorganização das funções no código
 *  - Muda o cursor para carregando enquanto modifica
 */

(function() {
    'use strict';

     // cria campos no topo
     let th = document.querySelector("#table_orc_itens thead tr")

     // Coleta todos os BDIs pre-existente
     let bdis = new Set([...document.querySelectorAll("input.right[value]")].map(x => x.value))
     console.log(bdis)

     document.querySelector("#table_orc_itens thead tr").insertAdjacentHTML('afterEnd', "<tr><td id='classesBDIs' colspan=30><p>BDIs diferenciados:</p></td></tr>")

     let bdi_p = document.querySelector('#classesBDIs p')

     bdis.forEach(bdi => {
         let bdi_input = document.createElement('input')
         bdi_input.type = 'text'
         bdi_input.value = bdi
         bdi_input.placeholder = `BDI antigo: ${bdi} %`

         // modifica todos os itens com esse BDI
         bdi_input.oninput = function() {
             document.querySelectorAll(`#table_orc_itens tbody input.right[value='${bdi}']`).forEach(n => {n.value = bdi_input.value})
         }

         // adiciona o input na tela
         bdi_p.append(bdi_input)
     })

     // botão para copiar dados
     let btn_cp = document.createElement("button");
    btn_cp.id = "copiar-bdis";
    btn_cp.className = "btn btn-info";
    btn_cp.innerHTML = "Copiar <i class='flaticon-copy13' style='line-height: inherit'></i>";
    btn_cp.type="button";

    btn_cp.onclick = () => {
        let inputs_bdi = document.querySelectorAll("#table_orc_itens tbody tr input.right")

        let text = [...inputs_bdi].map(el => {
            let val = el.value
            if(!val) return;
            let item = el.parentElement.parentElement.children[0].textContent;
            return`${item}\t'${val}\n`;
        }).join('')

        navigator.clipboard.writeText(text)
        btn_cp.innerHTML = "Copiado!"
    }

    // botao para colar dados
    let btn_paste = document.createElement("textarea");
    btn_paste.id = "colar-bdis";
    btn_paste.rows=1;
    btn_paste.placeholder = "Arraste ou cole aqui"
    btn_paste.className = "btn width10"
    btn_paste.style.resize="none"

    btn_paste.onpaste = (e) => {
        e.preventDefault()
        let clipdata = e.clipboardData || window.clipboardData;
        let data = clipdata.getData('text/plain').trim();
        colar_bdis(data)
    }

    btn_paste.oninput = (e) => {
        e.preventDefault()
        let dados = e.target.value.trim()
        e.target.value = ""
        colar_bdis(dados)
    }

    bdi_p.append(btn_cp, btn_paste)


})();

function colar_bdis(data) {
    // prepara item das etapas
    document.querySelectorAll(`#table_orc_itens tr input.right`).forEach(el => {
        // define a itenização no html
        el.dataset.item = el.parentElement.parentElement.children[0].textContent;
        // limpa todos os campos
        el.value = '';
    })

    // separa os itens
    let itembdi = data.split(/\r\n|\n/).map( v => v.split(/\t[']*/))

    // aplica itens
    itembdi.forEach(i => {
        if(!document.querySelector(`input[data-item='${i[0]}']`)) return;
        document.querySelector(`input[data-item='${i[0]}']`).value = i[1];
    })
    alert("BDIs colados");
}
