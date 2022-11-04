// ==UserScript==
// @name         Mudar Bancos Fácil
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/mudar-bancos.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/mudar-bancos.user.js
// @version      0.1
// @description  Permite copiar e colar uma tabela de datas e bancos
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @match        https://app.orcafascio.com/banco/emp/composicoes/importar
// @match        https://app.orcafascio.com/banco/emp/composicoes/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let location = '', url = window.location.pathname;
    if(url == '/banco/emp/composicoes/importar') location = "#wiz1step3 .widgetcontent";
    else if(url.endsWith('/set_bancos')) location = ".maincontent form";
    else if(url.startsWith('/orc/orcamentos/')) location = "#modal-editar-bancos .modal-body";
    else if(url.startsWith('/banco/emp/composicoes/')) location = "#modal-bancos .modal-body";

    let btn = document.createElement("button");
    btn.id = "muda-bancos-copiar";
    btn.className = "btn btn-info width30";
    btn.innerHTML = "Copiar Bancos <i class='flaticon-copy13' style='line-height: inherit'></i>";
    btn.type="button";

    btn.onclick = () => {
        let bases = document.querySelectorAll(location + " .row-fluid")

        let text = [...bases].map(e => {
            if(!e.querySelector("input").checked) return;
            let s = e.querySelector("select[id$=data]")
            return`${e.id}\t'${s.value}\n`;
        }).join('')

        navigator.clipboard.writeText(text)
        btn.innerHTML = "Copiado!"
    }

    let txt = document.createElement("textarea");
    txt.id = "muda-bancos-colar";
    txt.rows=1;
    txt.placeholder = "Arraste ou cole aqui"
    txt.className = "btn width30"
    txt.style.resize="none"

    txt.onpaste = (e) => {
        e.preventDefault()
        let clipdata = e.clipboardData || window.clipboardData;
        let data = clipdata.getData('text/plain').trim();
        selecionar_bancos(data, location)
    }

    txt.oninput = (e) => {
        e.preventDefault()
        let dados = e.target.value.trim()
        e.target.value = ""
        selecionar_bancos(dados, location)
    }

    let div = document.createElement("div");
    div.id = "muda-bancos";
    div.className = "btn-group text-center"
    div.style.width = "100%"
    div.append(txt, btn)

    document.querySelector(location).insertAdjacentElement("afterBegin", div)

})();

function selecionar_bancos(data, parent) {
    let basedata = data.split(/\r\n|\n/).map( v => v.split(/\t[']*/))
    console.log("Limpando seleção")
    document.querySelectorAll(parent + " .row-fluid input").forEach(n => {if(n.checked) n.click()})
    console.log("Selecionando", basedata)
    basedata.forEach( v => {
        if(!document.querySelector(`#${v[0]} input`)) return;
        document.querySelector(`#${v[0]} input`).click()
        document.querySelector(`#${v[0]} select[id$=data]`).value = v[1]
    })
}