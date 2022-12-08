# PSA LINKS DB


## Description

Small HTTP app running on fritzbox storing and returning DL links for release names

## Freetz-ng Packages

- bash 
- curl 
- dehydrated
- dropbear 
- lighttpd
- nano
- openssl
  - im expert mode bei shared libs ec support anhaken
- sqlite3
- tmux
- wol

## Vorbereitung Fritzbox

- Fritz Box externer https Zugriff auf Port 444 einschalten
- Port 88 und 443 freigeben, in /var/flash/ar7.cfg:
```
internet_forwardrules = "tcp 0.0.0.0:444 0.0.0.0:444 0",
                                "tcp 0.0.0.0:80 0.0.0.0:88 0",
                                "tcp 0.0.0.0:443 0.0.0.0:443 0";

```
- /var/media/ftp/uStor01/htdocs anlegen

## Lighttp conf

- Ohne chroot
- Port 88
- SSL Unterstützung aktiviert
  - SSL zusätzlich Port 443
  - nicht HTTP/2 anhaken
- Bei erweitert einfügen:
```
server.modules += ( "mod_cgi" )
cgi.assign = ( ".cgi" => "/bin/bash", "/cgi-bin/" => "/bin/bash" )
server.feature-flags += ("server.h2proto" => "disable", "server.h2c" => "disable")
server.modules += ( "mod_setenv" )
setenv.add-response-header = (
"Access-Control-Allow-Origin" => "*",
"Access-Control-Allow-Methods" => "HEAD, GET, OPTIONS",
"Access-Control-Expose-Headers" => "Content-Range, Date, Etag, Cache-Control, Last-Modified",
"Access-Control-Allow-Headers" => "Content-Type, Origin, Accept, Range, Cache-Control",
"Access-Control-Max-Age" => "600",
"Timing-Allow-Origin" => "*" )

```


## Create DB

sqlite3 psa.db

```
CREATE TABLE release (
	id INTEGER PRIMARY KEY,
	page_url TEXT NOT NULL,
	release_name TEXT NOT NULL,
	release_part_name TEXT NOT NULL UNIQUE,
	created INTEGER NOT NULL,
	links TEXT NOT NULL
);

create index    release_index on release (release_name);

```

## API EXAMPLE

### GET

```
/api/?GET=SOME.RELEASE-NAME
```

### ADD

```
/api/?
ADD=SOME.RELEASE-NAME&
URL=tv-show/some-show/&
PARTNAME=SOME.RELEASE-NAME-2&
LINKS=COMMA_SEPERATED_LINKS_URL_ENCODED
```
