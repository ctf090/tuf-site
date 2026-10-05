# Site de academia — template em HTML, CSS e JS puro

Site de uma academia de artes marciais, feito por **[ctf090](https://github.com/ctf090)**. A versão de exemplo usa os dados da academia **TUF** (Muay Thai e Jiu-Jitsu), mas a ideia deste repositório é ser uma **base livre**: qualquer pessoa pode copiar, trocar fotos, textos e cores, e criar o próprio site.

🔗 **Demo:** https://ctf090.github.io/tuf-site/

## Para que serve

- Ser ponto de partida para o site de uma academia, estúdio, clube ou pequeno negócio local
- Estudar HTML, CSS e JS sem framework e sem build
- Trocar só as fotos e os textos e publicar de graça no GitHub Pages

## O que vem pronto

- Página única com seções: início, modalidades, diferenciais, galeria, horários, planos, localização e contato
- Menu que destaca em laranja a aba da seção atual
- Animações de saída e entrada ao trocar de aba, e conteúdo que aparece ao rolar
- Botão de WhatsApp com mensagem pronta
- Mapa do Google embutido
- Responsivo (celular, tablet e PC)
- Favicon `.ico` com a logo
- Segurança: Content Security Policy, sem código inline, links externos com `noopener noreferrer`, mapa em iframe isolado (`sandbox`) e proteção contra clickjacking
- Respeita a opção "reduzir movimento" do sistema

## Como usar como base

1. Clique em **Use this template** ou **Fork**, ou rode:
   ```bash
   git clone https://github.com/ctf090/tuf-site.git meu-site
   cd meu-site
   ```
2. Troque os dados no `index.html`:

   | O que mudar | Onde |
   |---|---|
   | Nome e textos | Busque por `TUF` e pelos textos de cada seção |
   | WhatsApp | Busque por `wa.me/` e troque o número (formato `55` + DDD + número) |
   | Instagram | Busque por `instagram.com/` |
   | Endereço e horários | Seção `id="local"` e `id="horarios"` |
   | Planos e preços | Seção `id="planos"` |
   | Mapa | Atributo `src` do `<iframe>` na seção de localização |
   | Fotos e logo | Tags `<img>` (veja a nota abaixo) |

3. Troque as **cores** no topo do `style.css`, em `:root`. A cor principal é a variável `--laranja`.
4. Gere um novo `favicon.ico` com a sua logo e substitua o arquivo.
5. Publique: **Settings → Pages → Deploy from a branch → main → / (root)**.

> **Fotos:** neste projeto as imagens estão embutidas no `index.html` (formato base64). Para usar arquivos normais, coloque a foto numa pasta `img/` e troque o `src` por `img/foto.jpg`.

> **Mapa:** se trocar o link do mapa por outro domínio que não seja do Google, ajuste também `frame-src` na tag de CSP no começo do `index.html`.

## Estrutura

```
├── index.html
├── style.css
├── script.js
├── favicon.ico
└── apple-touch-icon.png
```

## Rodar localmente

```bash
python -m http.server 8000
```

Abra http://localhost:8000 no navegador.

## Licença

Uso livre para criar o seu próprio site a partir desta base. Troque nome, logo, fotos e textos pelos seus: a marca, a logo e as fotos da **TUF** pertencem à academia e não devem ser reutilizadas.

---

Feito por [ctf090](https://github.com/ctf090).
