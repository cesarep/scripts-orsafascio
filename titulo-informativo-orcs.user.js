// ==UserScript==
// @name         Título Informativo Orçamentos
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js
// @version      0.2
// @description  Modifica o título da aba do navegador para um mais informativo
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

/**
 * Mudanças:
 * v0.2
 *  - Mostra também nome das pastas
 */

(function() {
    'use strict';
    let nome="", cod="";
    if(document.getElementById("orc_orcamento_descricao")){
        nome = document.getElementById("orc_orcamento_descricao").value;
        cod = document.getElementById("orc_orcamento_codigo").value + " - ";
    } else {
        nome = document.querySelector(".pagetitle h1").textContent;
        cod = ""
    }

     document.querySelector("title").text = cod + nome;
})();