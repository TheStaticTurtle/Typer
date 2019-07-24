import time
import os
from flask import Flask, Response

app = Flask(__name__)
web_root_dir ="www/"
data_root_dir ="data/"

def get_web_file(filename):  # pragma: no cover
    try:
        src = os.path.join(web_root_dir, filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)

def get_data_file(filename):  # pragma: no cover
    try:
        src = os.path.join(data_root_dir, filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)


@app.route('/<path:path>')
def get_resource(path):
	mimetypes = { 
		".css": "text/css",
		".html": "text/html",
		".js": "application/javascript",
		".svg": "image/svg+xml",
		".jpg": "image/jpeg",
		".png": "image/png"
	}

	complete_path = os.path.join(web_root_dir, path)
	ext = os.path.splitext(path)[1]
	mimetype = mimetypes.get(ext, "text/html")
	content = get_web_file(path)
	return Response(content, mimetype=mimetype)

@app.route('/')
@app.route('/en')
def get_index():
	content = get_web_file("index.en.html")
	return Response(content, mimetype="text/html")

@app.route('/fr')
def get_index_fr():
	content = get_web_file("index.fr.html")
	return Response(content, mimetype="text/html")

@app.route('/credits')
def get_credits():
	content = get_web_file("credits.html")
	return Response(content, mimetype="text/html")

@app.route('/data/<string:lang>/<string:file>')
def get_lang_file(lang,file):
	content = get_data_file(lang+"."+file)
	return Response(content, mimetype="text/html")


app.run(host='0.0.0.0')