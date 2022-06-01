// ==UserScript==
// @name         Título Informativo Insumos e Composições
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-comps-ins.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-comps-ins.user.js
// @version      0.2
// @description  Modifica o título da aba do navegador para um mais informativo
// @author       César E. Petersen
// @match        https://app.orcafascio.com/*/composicoes/*
// @match        https://app.orcafascio.com/*/insumos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let desc = document.querySelector(".widgettitle").innerText;
    let cod = document.querySelector(".flaticon-airplane49")?.innerText || document.querySelector(".pagetitle h1").innerText

     document.querySelector("title").text = cod + " - " + desc
})();