# scripts-orsafascio
Conjunto de _userscripts_ para facilitar utilização do Orçafascio.

## Instalação
1. Instalar o [Tampermonkey](https://www.tampermonkey.net/) ou outro gerenciador de userscripts no navegador.

1. Clicar nos links dos [scripts disponíveis](#scripts-disponíveis).

1. Confirmar a instalação do script:

    ![Instalação do Script](imgs/instalacao-script.png)

1. Periodicamente o Tampermonkey verifica por atualizações dos scripts

    ![Atualização do script](imgs/atualizar-script.png)

## Scripts disponíveis

- [Alteração de BDI em massa](https://github.com/cesarep/scripts-orsafascio/raw/main/alterar-BDI-massa.user.js)
    
    Adiciona botão para alterar vários BDIs diferenciados ao mesmo tempo.

    ![Alteração de BDI](imgs/scripts/alteracao-bdi.png)

- [Filtro de Exclusão em massa](https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-exclusao-massa.user.js)

    Adiciona campos para filtragem por código e descrição de Composições e Insumos na exclusão em massa.

    ![Exclusão em massa](imgs/scripts/filtro-exclusao.png)

- [Renumeração Automatica](https://github.com/cesarep/scripts-orsafascio/raw/main/renumeracao-automatica.user.js)

    Adiciona botão na página para renumerar automaticamente todos os itens de orçamento. Itens alterados ficam amarelos e exibem mensagem com valor antigo ao passar o mouse por cima.

    ![Renumeração Automática](imgs/scripts/renumeracao-automatica.png)

- [Selecionar todos os bancos](https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-todos-bancos.user.js)

    Adiciona opção na exportação do **relatório de composições analíticas com preço unitário** para selecionar todos os bancos exceto o próprio, gerando relatório só com as composições próprias.

    ![Selecionar todos os bancos](imgs/scripts/selecionar-bancos.png)

- Titulos Informativos para [Orçamentos](https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js) e [Insumos e Composições](https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-comps-ins.user.js)

    Modifica o titulo na aba do navegador para incluir o código e descrição dos insumos, composições e orçamentos abertos, organizando melhor as abas.

    ![Titulos informativos](imgs/scripts/titulos-informativos.png)

- [Mover pastas](https://github.com/cesarep/scripts-orsafascio/raw/main/mover-pastas.user.js)

    Adiciona botão para mover pastas inteiras nos orçamentos.
    Os botões demoram para aparecer pois precisam carregar toda a estrutura do diretório de pastas antes.

    ![Botão para mover pastas](imgs/scripts/mover-pasta-1.png)
    ![Janela para mover pastas](imgs/scripts/mover-pasta-2.png)
