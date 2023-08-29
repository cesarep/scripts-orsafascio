// ==UserScript==
// @name         Filtro Editar Preços
// @namespace     https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-edicao-precos.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-edicao-precos.user.js
// @version      0.1
// @description  Adiciona filtros na edição de preços
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*/insumos/edit_precos?*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // seleciona a primeira linha da tabela
    let th = document.querySelector("#editar-valores .table tbody tr")

    // inputs para código e descrição
    let inp_c = document.createElement("input")
    inp_c.className ='input-block-level'
    inp_c.id = "filtra-codigo"
    inp_c.placeholder = "Filtrar código"
    th.childNodes[0].appendChild(inp_c)

    let inp_d = document.createElement("input")
    inp_d.className ='input-block-level'
    inp_d.id = "filtra-desc"
    inp_d.placeholder = "Filtrar descrição"
    th.childNodes[2].appendChild(inp_d)


    // define atributos em todas as linhas para permitir a pesquisa
    document.querySelectorAll("#editar-valores .table tr[data-id]").forEach( (tr) =>{
        tr.setAttribute("cod", tr.childNodes[0].innerText)
        tr.setAttribute("desc", tr.childNodes[2].innerText)
    })

    // debounce para performance
    function debounce(func, wait) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
        }
    }

    // filtra os itens
    inp_c.oninput = debounce(filtrar, 500)
    inp_d.oninput = debounce(filtrar, 500)

    function filtrar() {
        let cod = inp_c.value, desc = inp_d.value;

        let querybase = "#editar-valores .table tr:not(:nth-child(1)):not(:nth-child(2))"
        let hidequery = []

        if(cod.length) hidequery.push(`[cod*='${cod}' i]`)
        if(desc.length) hidequery.push(`[desc*='${desc}' i]`)

        console.log(querybase + hidequery.join(""))
        console.log(hidequery.map(q => `${querybase}:not(${q})`).join(", "))

        window.jQuery(hidequery.map(q => `${querybase}:not(${q})`).join(", ")).hide()
        window.jQuery(querybase + hidequery.join("")).show()
    }

})();