# Meeting Detection Challenge

## Resolução

Todo o código que faz a resolução do problemas esta dentro de `Application@processMeetings`

Primeiramente, identifico todos os timestamps possíveis e os armazeno em um array. Em seguida, percorro cada timestamp e busco na lista as linhas correspondentes a ele, executando o algoritmo de encontro.

Essa organização é feita inicialmente para garantir que monitoramentos com timestamps diferentes não precisem comparar informações entre si, pois, conforme a regra, devem ser comparados apenas os registros que possuem o mesmo timestamp.

Para evitar comparações duplicadas, utilizo dois loops aninhados (for i e for j), realizando as comparações em pares.

os arquivos de saida fica dentro de `temp/` chamado `out-{timestemp}.json`.

| Pelo que entendi, trata-se de um desafio do LeetCode. Por isso, não foquei em aplicar boas práticas como SOLID ou Clean Code, mas sim em otimizar a solução e buscar o melhor desempenho possível. Obrigado!

## Requisitos

- bun
- node 25 ou 27+

## Sequencia de Comandos para Teste

### Instalações

```bash
bun install
```

### Build (Opcional)

```bash
bun run build
```

### Start

Caso prefira não realizado o build rode: `start:dev`

```bash
bun start <url,file>
```

#### Exemplo com URL

```bash
bun start htttp://321312321/example.txt
```

### Exemplo com arquivo

```bash
bun start /home/User/example/test.txt
```
