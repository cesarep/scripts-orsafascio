// ==UserScript==
// @name         Selecionar Itens na ABC de insumos
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-itens-abc-insumos.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-itens-abc-insumos.user.js
// @version      0.1
// @description  Permite selecionar apenas um item no relatório da curva ABC de insumos
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let selTodoslb = document.createElement("label");
    selTodoslb.htmlFor="todos_tipos";
    let selTodos = document.createElement("input");
    selTodos.id="todos_tipos";
    selTodos.name="tipos"
    selTodos.type="radio";
    selTodos.checked=true;
    selTodoslb.appendChild(selTodos)
    selTodoslb.append("  Todos os tipos");

    selTodoslb.onclick = () => {
        document.querySelectorAll("#modal-relatorios-abc_insumos .modal-body input[type=checkbox][name^=tipo]").forEach( n => {
            n.checked = true;
        })
    }

    document.querySelectorAll("#modal-relatorios-abc_insumos .modal-body input[type=checkbox][name^=tipo]").forEach( n => {
        let r = document.createElement("input");
        console.log(n)
        r.type="radio"
        r.name="tipos"

        r.onclick = () => {
            document.querySelectorAll("#modal-relatorios-abc_insumos .modal-body input[type=checkbox][name^=tipo]").forEach( n => {
                n.checked = false;
            })
            document.getElementById(n.id).checked = true
        }

        n.insertAdjacentElement('beforeBegin', r)
        n.insertAdjacentText('beforeBegin', " ")
    })

    document.querySelector("#modal-relatorios-abc_insumos .modal-body h4").insertAdjacentElement('afterend', selTodoslb)

})();
