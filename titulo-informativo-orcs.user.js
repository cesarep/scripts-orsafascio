// ==UserScript==
// @name         Título Informativo
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js
// @version      0.1
// @description  Modifica o título da aba do navegador para um mais informativo
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let cod = document.getElementById("orc_orcamento_codigo").value;

    let nome = document.getElementById("orc_orcamento_descricao").value;

     document.querySelector("title").text = cod + " - " + nome;
})();