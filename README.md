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
    
    Orçafascio agora inclui página para alteração dos BDIs diferenciados, funcionalidades antigas foram movidas para lá:

    ![Alteração de BDI](imgs/scripts/alteracao-bdi-novo.png)

    Inclui campos para substituir todos os BDIs diferentes ao mesmo tempo e funções para copiar e colar a relação dos itens e BDIs

    ![Alteração de BDI](imgs/scripts/alteracao-bdi.png)

- [Filtro de Exclusão em massa](https://github.com/cesarep/scripts-orsafascio/raw/main/filtro-exclusao-massa.user.js)

    Adiciona campos para filtragem de Composições e Insumos na exclusão em massa.

    ![Exclusão em massa](imgs/scripts/filtro-exclusao.png)

- [Renumeração Automatica](https://github.com/cesarep/scripts-orsafascio/raw/main/renumeracao-automatica.user.js)

    Adiciona botão na página para renumerar automaticamente todos os itens de orçamento. Itens alterados ficam amarelos e exibem mensagem com valor antigo ao passar o mouse por cima.

    ![Renumeração Automática](imgs/scripts/renumeracao-automatica.png)

- [Exclusão de etapas vazias](https://github.com/cesarep/scripts-orsafascio/raw/main/excluir-etapas-vazias.user.js)

    Adiciona botão na página para selecionar as etapas vazias para exclusão.

    ![Excluir etapas vazias](imgs/scripts/excluir-etapas-vazias.png)

- [Selecionar todos os bancos](https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-todos-bancos.user.js)

    Adiciona opção na exportação do **relatório de composições analíticas com preço unitário** para selecionar todos os bancos exceto o próprio, gerando relatório só com as composições próprias.

    ![Selecionar todos os bancos](imgs/scripts/selecionar-bancos.png)

- [Copia e Colar Bancos](https://github.com/cesarep/scripts-orsafascio/raw/main/mudar-bancos.user.js)

    Adiciona botões para copiar e colar os bancos de maneira simplificada através de uma tabela do Excel nos menus de orçamentos e composições.

    ![Copia e Colar Bancos](imgs/scripts/mudar-bancos.png)

    A tabela deve estar com os nomes dos bancos e valores iguais aos presentes no site, conforme exemplo na tabela direita. O banco copiado pode ser colado no Excel, ele apresenta um apóstrofe `'` na frente para evitar a auto-formatação das datas e números, como mostrado na tabela esquerda, cada valor pode ser reeditado para aplicar a formatação de texto e esconder a apóstrofe (Dica: pressionar `F2` e `Enter`). O script ignora as apóstrofres, de maneira que uma lista de bancos também pode ser diretamente copiada e colada em outra página sem intermédio do Excel.

    ![Exemplos de tabela](imgs/scripts/mudar-bancos-2.png)

- Titulos Informativos para [Orçamentos e Pastas](https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-orcs.user.js) e [Insumos e Composições](https://github.com/cesarep/scripts-orsafascio/raw/main/titulo-informativo-comps-ins.user.js)

    Modifica o titulo na aba do navegador para incluir o código e descrição dos insumos, composições, orçamentos e pastas abertas, organizando melhor as abas.

    ![Titulos informativos](imgs/scripts/titulos-informativos.png)

- [Mover pastas](https://github.com/cesarep/scripts-orsafascio/raw/main/mover-pastas.user.js)

    Adiciona botão para mover pastas inteiras nos orçamentos.
    Os botões demoram para aparecer pois precisam carregar toda a estrutura do diretório de pastas antes.

    ![Botão para mover pastas](imgs/scripts/mover-pasta-1.png)
    ![Janela para mover pastas](imgs/scripts/mover-pasta-2.png)

- [Selecionar Itens na ABC de Insumos](https://github.com/cesarep/scripts-orsafascio/raw/main/selecionar-itens-abc-insumos.user.js)

    Adiciona botões radio para fácilmente selecionar um único item para o relatório da curva ABC de Insumos.

    ![Itens na ABC de Insumos](imgs/scripts/itens-abc-insumos.png)
    ![Itens na ABC de Insumos Marcado](imgs/scripts/itens-abc-insumos-2.png)
