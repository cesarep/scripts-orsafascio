// ==UserScript==
// @name         Exclusão Etapas vazias
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/excluir-etapas-vazias.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/excluir-etapas-vazias.user.js
// @version      0.1
// @description  Exclui as etapas sem itens
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/excluir_varios_itens?id=*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant    none
// ==/UserScript==

(function() {
    'use strict';

    var btn = document.createElement("button");
    btn.className="btn btn-warning";
    btn.id="renumeraitens";
    btn.style="float: left;";
    btn.type="button";
    btn.innerHTML = "Selecionar etapas Vazias";

    document.querySelector("#table_orc_itens tbody tr:first-child td:first-child").appendChild(btn)

    btn.onclick = () => {
        document.querySelectorAll("tr.etapa td:last-child").forEach( n => {
            if(n.textContent == "0,00") n.parentElement.querySelector("input").checked = true;
        })
    }

})();