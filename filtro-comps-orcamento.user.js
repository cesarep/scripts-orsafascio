// ==UserScript==
// @name         Filtro de Composições
// @namespace     https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-comps-orcamento.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-comps-orcamento.user.js
// @version      0.1
// @description  Adiciona filtros na listagem de comoposições do orçamento
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*/composicoes
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // seleciona a primeira linha da tabela
    let th = document.querySelector(".maincontent .table tbody tr")

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

    let inp_t = document.createElement("input")
    inp_t.className ='input-block-level'
    inp_t.id = "filtra-tipo"
    inp_t.placeholder = "Filtrar tipo"
    th.childNodes[3].appendChild(inp_t);

    let inp_u = document.createElement("input")
    inp_u.className ='input-block-level'
    inp_u.id = "filtra-un"
    inp_u.placeholder = "Filtrar unidade"
    th.childNodes[4].appendChild(inp_u);

    // define atributos em todas as linhas para permitir a pesquisa
    document.querySelectorAll(".maincontent .table tr.success").forEach( (tr) =>{
        tr.setAttribute("cod", tr.childNodes[0].innerText)
        tr.setAttribute("desc", tr.childNodes[2].innerText)
        tr.setAttribute("tipo", tr.childNodes[3].innerText)
        tr.setAttribute("un", tr.childNodes[4].innerText)
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
    inp_t.oninput = debounce(filtrar, 500)
    inp_u.oninput = debounce(filtrar, 500)

    function filtrar() {
        let cod = inp_c.value, desc = inp_d.value, tipo = inp_t.value, unidade = inp_u.value;

        let querybase = ".maincontent .table tr:not(:nth-child(1))"
        let hidequery = []

        if(cod.length) hidequery.push(`[cod*='${cod}' i]`)
        if(desc.length) hidequery.push(`[desc*='${desc}' i]`)
        if(tipo.length) hidequery.push(`[tipo*='${tipo}' i]`)
        if(unidade.length) hidequery.push(`[un*='${unidade}' i]`)

        console.log(querybase + hidequery.join(""))
        console.log(hidequery.map(q => `${querybase}:not(${q})`).join(", "))

        window.jQuery(hidequery.map(q => `${querybase}:not(${q})`).join(", ")).hide()
        window.jQuery(querybase + hidequery.join("")).show()
    }

})();
