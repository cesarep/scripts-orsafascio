// ==UserScript==
// @name         Filtro Exclusão em massa
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adiciona filtros na exclusão em massa
// @author       César E. Petersen
// @match        https://app.orcafascio.com/banco/emp/*/exclusao_em_massa
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

/**
 * Mudanças:
 * v0.3:
 *  - Inclusos filtros para unidade
 *  - Inclusos filtros para dono, data de criação e modificação nas composições
 *  - Melhorada lógica para montar a query dos filtros
 */

(function() {
    'use strict';

    // seleciona a linha do cabeçario
    let th = document.querySelector("#table_orc_itens thead tr")

    // inputs para código e descrição
    let inp_c = document.createElement("input")
    inp_c.className ='input-block-level'
    inp_c.id = "filtra-codigo"
    inp_c.placeholder = "Filtrar código"
    th.childNodes[1].appendChild(inp_c)

    let inp_d = document.createElement("input")
    inp_d.className ='input-block-level'
    inp_d.id = "filtra-desc"
    inp_d.placeholder = "Filtrar descrição"
    th.childNodes[2].appendChild(inp_d)

    let inp_und = document.createElement("input")
    inp_und.className ='input-block-level'
    inp_und.id = "filtra-uns"
    inp_und.placeholder = "Filtrar unid."
    th.childNodes[3].appendChild(inp_und)

    let in_comps = window.location.pathname == '/banco/emp/composicoes/exclusao_em_massa'

    if(in_comps){
        let inp_dono = document.createElement("input")
        inp_dono.className ='input-block-level'
        inp_dono.id = "filtra-dono"
        inp_dono.placeholder = "Filtrar dono"
        th.childNodes[4].appendChild(inp_dono)

        let inp_data1 = document.createElement("input")
        inp_data1.className ='input-block-level'
        inp_data1.id = "filtra-data1"
        inp_data1.placeholder = "Filtrar data"
        th.childNodes[5].appendChild(inp_data1)

        let inp_data2 = document.createElement("input")
        inp_data2.className ='input-block-level'
        inp_data2.id = "filtra-data2"
        inp_data2.placeholder = "Filtrar data"
        th.childNodes[6].appendChild(inp_data2)
    }

    // remove o botão original
    document.querySelector(".marcar_tudo").remove()
    // cria novo botão
    let btn = document.createElement("a")
    btn.className="btn"
    btn.style="font-size: 10px; padding: 5px; line-height: 1.2;"
    btn.innerText = "Marcar tudo"
    btn.marcar = true
    // marcar ou desmarca os itens visiveis
    btn.onclick = function() {
        window.jQuery("#table_orc_itens tbody tr[item_2]:not(:hidden) input").prop('checked', btn.marcar)
            .parent().parent().toggleClass("selecionada", btn.marcar);
        btn.innerText = btn.marcar ? "Demarcar tudo" : "Marcar tudo"
        btn.marcar = !btn.marcar
    }
    // adiciona o botão
    th.childNodes[0].appendChild(btn)

    // define atributos em todas as linhas para permitir a pesquisa
    document.querySelectorAll("#table_orc_itens tbody tr[item_2]").forEach( (tr) =>{
        tr.setAttribute("cod", tr.childNodes[1].innerText)
        tr.setAttribute("desc", tr.childNodes[2].innerText)
        tr.setAttribute("und", tr.childNodes[3].innerText)
        if(in_comps){
            tr.setAttribute("dono", tr.childNodes[4].innerText)
            tr.setAttribute("data1", tr.childNodes[5].innerText)
            tr.setAttribute("data2", tr.childNodes[6].innerText)
        }
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
    inp_und.oninput = debounce(filtrar, 500)
    if(in_comps){
        inp_dono.oninput = debounce(filtrar, 500)
        inp_data1.oninput = debounce(filtrar, 500)
        inp_data2.oninput = debounce(filtrar, 500)
    }

    function filtrar() {
        let cod = inp_c.value, desc = inp_d.value, und = inp_und.value;

        let querybase = "#table_orc_itens tbody tr[item_2]"
        let hidequery = []

        if(cod.length) hidequery.push(`[cod*='${cod}' i]`)
        if(desc.length) hidequery.push(`[desc*='${desc}' i]`)
        if(und.length) hidequery.push(`[und*='${und}' i]`)
        if(in_comps){
            let dono = inp_dono.value, data1 = inp_data1.value, data2 = inp_data2.value;
            if(dono.length) hidequery.push(`[dono*='${dono}' i]`)
            if(data1.length) hidequery.push(`[data1*='${data1}' i]`)
            if(data2.length) hidequery.push(`[data2*='${data2}' i]`)
        }

        console.log(querybase + hidequery.join(""))
        console.log(hidequery.map(q => `${querybase}:not(${q})`).join(", "))

        window.jQuery(hidequery.map(q => `${querybase}:not(${q})`).join(", ")).hide()
        window.jQuery(querybase + hidequery.join("")).show()
    }

})();