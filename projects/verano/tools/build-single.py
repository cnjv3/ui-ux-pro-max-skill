#!/usr/bin/env python3
"""Genera verano-standalone.html: la web completa en un único archivo.

Incrusta la hoja de estilos, las fuentes (base64), el favicon y todos los
scripts (GSAP, config, app, motion) a partir de las fuentes del proyecto, de
modo que el resultado se puede abrir con doble clic, enviar por correo o
subir a cualquier hosting sin carpetas.

Uso (desde projects/verano):  python3 tools/build-single.py
Edita siempre los archivos fuente (index.html, css/, js/) y vuelve a generar.
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'verano-standalone.html'


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')


def data_uri(rel, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode((ROOT / rel).read_bytes()).decode('ascii'))


def inline_script(code):
    # Un "</script" literal dentro del código cerraría la etiqueta antes de tiempo.
    return code.replace('</script', '<\\/script')


def replace_once(html, old, new):
    if html.count(old) != 1:
        sys.exit('No se encontró exactamente una vez: %r' % old[:80])
    return html.replace(old, new)


def main():
    html = read('index.html')

    html = replace_once(html, '<!doctype html>\n',
        '<!doctype html>\n<!-- Archivo generado por tools/build-single.py a partir de index.html, css/ y js/.\n'
        '     Para editar contenido, cambia js/config.js y vuelve a generar este archivo. -->\n')

    # Favicon
    html = replace_once(html, '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
        '<link rel="icon" href="%s" type="image/svg+xml">' % data_uri('favicon.svg', 'image/svg+xml'))

    # Hoja de estilos con fuentes incrustadas
    css = read('css/styles.css')
    def font(m):
        return "url('%s')" % data_uri('fonts/' + m.group(1), 'font/woff2')
    css, n = re.subn(r"url\('\.\./fonts/([^']+\.woff2)'\)", font, css)
    if n == 0:
        sys.exit('No se encontraron fuentes en css/styles.css')
    html = replace_once(html, '<link rel="stylesheet" href="css/styles.css">', '<style>\n%s</style>' % css)

    # Las fuentes ya van dentro del CSS: la precarga de archivos sobra.
    html, n = re.subn(r'\n[ \t]*/\* @build:preload-fonts:start.*?@build:preload-fonts:end \*/', '', html, flags=re.S)
    if n != 1:
        sys.exit('No se encontró el bloque de precarga de fuentes')

    # Scripts (en el mismo orden; al final del body equivalen a defer)
    for src in re.findall(r'<script src="([^"]+)" defer></script>', html):
        tag = '<script src="%s" defer></script>' % src
        html = replace_once(html, tag, '<script>\n%s\n</script>' % inline_script(read(src)))

    if re.search(r'(src|href)="(?!data:|https?:|#|mailto:|tel:)[^"]+\.(js|css|woff2|svg)"', html):
        sys.exit('Queda alguna referencia a un archivo local')

    OUT.write_text(html, encoding='utf-8')
    print('%s · %.0f KB' % (OUT.name, OUT.stat().st_size / 1024))


if __name__ == '__main__':
    main()
