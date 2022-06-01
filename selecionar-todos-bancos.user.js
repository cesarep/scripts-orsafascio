// ==UserScript==
// @name         Selecionar todos os bancos
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-todos-bancos.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-todos-bancos.user.js
// @version      0.1
// @description  Cria uma opção para selecionar todos os bancos na exportaçao do relatório de composições
// @author       César E Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var selTodoslb = document.createElement("label");
    selTodoslb.htmlFor="todas_bases";
    var selTodos = document.createElement("input");
    selTodos.id="todas_bases";
    selTodos.type="checkbox";
    selTodos.checked=true;
    selTodoslb.appendChild(selTodos)
    selTodoslb.append(" Selecionar todas as Bases (Exceto Própria)");

    selTodos.onclick = (cb) => window.jQuery("#modal-relatorios-cpu input[type='checkbox'][id^='base_']:not(#base_Emp)").attr('checked', cb.target.checked);

    document.querySelector("#modal-relatorios-cpu .modal-body h4").insertAdjacentElement('afterend',selTodoslb)
})();