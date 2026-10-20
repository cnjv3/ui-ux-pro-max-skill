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


IMAGE_TYPES = {
    '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml',
}
IMAGE_EXT = r'\.(?:webp|avif|jpe?g|png|gif|svg)'


def image_uri(rel, where):
    path = (ROOT / rel).resolve()
    if not path.is_file():
        sys.exit('Imagen no encontrada (%s): %s' % (where, rel))
    return data_uri(path.relative_to(ROOT), IMAGE_TYPES[path.suffix.lower()])


def inline_config_images(code):
    """Incrusta las fotos locales referenciadas en config.js (src, srcMobile, image…)."""
    def repl(m):
        key, quote, rel = m.group(1), m.group(2), m.group(3)
        return '%s: %s%s%s' % (key, quote, image_uri(rel, 'js/config.js'), quote)
    # Solo valores de los campos de imagen (no ejemplos dentro de comentarios).
    pattern = r"\b(src|srcMobile|image)\s*:\s*(['\"])((?!https?:|data:|//)[^'\"\s]+" + IMAGE_EXT + r")\2"
    return re.sub(pattern, repl, code, flags=re.I)


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

    # Precarga de imágenes locales: dentro de un solo archivo no aporta nada.
    html = re.sub(r'\n[ \t]*<link rel="preload" as="image" href="(?!https?:|data:)[^"]*"[^>]*>', '', html)

    # Imágenes locales escritas en el HTML
    def html_img(m):
        return '%s="%s"' % (m.group(1), image_uri(m.group(2), 'index.html'))
    html = re.sub(r'\b(src|href|srcset)="((?!https?:|data:|#|mailto:|tel:|//)[^"]+' + IMAGE_EXT + r')"', html_img, html, flags=re.I)

    # Nada del marcado debe depender de archivos al lado del HTML (los scripts
    # locales se incrustan justo después).
    markup = re.sub(r'<script src="[^"]+" defer></script>', '', html)
    markup = re.sub(r'<script>.*?</script>', '', markup, flags=re.S)
    leftover = re.search(r'\b(?:src|href|srcset)="(?!data:|https?:|#|mailto:|tel:|//)[^"]+"', markup)
    if leftover:
        sys.exit('Queda una referencia a un archivo local: %s' % leftover.group(0)[:120])

    # Scripts (en el mismo orden; al final del body equivalen a defer)
    for src in re.findall(r'<script src="([^"]+)" defer></script>', html):
        tag = '<script src="%s" defer></script>' % src
        code = read(src)
        if src == 'js/config.js':
            code = inline_config_images(code)
        html = replace_once(html, tag, '<script>\n%s\n</script>' % inline_script(code))


    OUT.write_text(html, encoding='utf-8')
    print('%s · %.0f KB' % (OUT.name, OUT.stat().st_size / 1024))


if __name__ == '__main__':
    main()
