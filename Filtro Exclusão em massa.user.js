// ==UserScript==
// @name         Filtro Exclusão em massa
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adiciona filtros para código e descrição na exclusão em massa
// @author       César E. Petersen
// @match        https://app.orcafascio.com/banco/emp/*/exclusao_em_massa
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // seleciona a linha do cabeçario
    var th = document.querySelector("#table_orc_itens thead tr")

    // inputs para código e descrição
    var inp_c = document.createElement("input")
    inp_c.className ='input-block-level'
    inp_c.id = "filtra-codigo"
    inp_c.placeholder = "Filtrar código"

    var inp_d = document.createElement("input")
    inp_d.className ='input-block-level'
    inp_d.id = "filtra-desc"
    inp_d.placeholder = "Filtrar descrição"

    // adiciona os inputs na linha
    th.childNodes[1].appendChild(inp_c)
    th.childNodes[2].appendChild(inp_d)

    // remove o botão original
    document.querySelector(".marcar_tudo").remove()
    // cria novo botão
    var btn = document.createElement("a")
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
        var cod = inp_c.value, desc = inp_d.value;
        console.log(cod, desc)
        window.jQuery((cod.length > 0 ? `#table_orc_itens tbody tr[item_2]:not([cod*='${cod}' i])` : "") + (desc.length*cod.length > 0 ? ", " : "") + (desc.length > 0 ?`#table_orc_itens tbody tr[item_2]:not([desc*='${desc}'] i)` : "")).hide()
        window.jQuery("#table_orc_itens tbody tr[item_2]" + (cod.length > 0 ? `[cod*='${cod}' i]` : "") + (desc.length > 0 ?`[desc*='${desc}' i]` : "")).show()
    }

})();